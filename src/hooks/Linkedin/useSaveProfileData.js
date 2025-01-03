// src/hooks/Linkedin/useSaveProfileData.js

import { useState } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * Attempt to parse a date string in "MMM YYYY" (e.g. "Jan 2023") or "Present".
 * - If "Present", returns "Present".
 * - Otherwise, returns a Timestamp if valid, else the raw string.
 */
function parseDateString(dateStr) {
  if (!dateStr) return null;

  const lower = dateStr.trim().toLowerCase();
  if (lower === "present") {
    return "Present";
  }

  const [monthStr, yearStr] = dateStr.split(" ");
  if (!monthStr || !yearStr) {
    return dateStr; // fallback
  }

  const dateObj = new Date(`${monthStr} 01, ${yearStr}`);
  if (isNaN(dateObj.getTime())) {
    return dateStr;
  }

  return Timestamp.fromDate(dateObj);
}

const useSaveProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Firebase Storage
  const storage = getStorage();

  /**
   * Delete all documents in a top-level collection where `fieldName` == userRef.
   */
  async function deleteDocsInCollection(collectionName, fieldName, userRef) {
    try {
      const collRef = collection(db, collectionName);
      const qRef = query(collRef, where(fieldName, "==", userRef));
      const snapshot = await getDocs(qRef);

      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error(`Error deleting documents in '${collectionName}':`, err);
      throw err;
    }
  }

  /**
   * Batch-add multiple docs to a top-level collection, linking them to the user doc reference.
   */
  async function batchAddDocuments(
    collectionName,
    fieldName,
    documents,
    userRef
  ) {
    try {
      if (!documents || !documents.length) return;

      const collRef = collection(db, collectionName);
      const batch = writeBatch(db);

      documents.forEach((item) => {
        const newDocRef = doc(collRef); // auto-generate ID
        batch.set(newDocRef, {
          ...item,
          [fieldName]: userRef,
          createdAt: Timestamp.now(),
        });
      });

      await batch.commit();
    } catch (err) {
      console.error(`Error adding documents to '${collectionName}':`, err);
      throw err;
    }
  }

  /**
   * Main function to save/update user profile data.
   * 1) If data.profileImage is base64 -> upload to Storage -> get URL
   * 2) Merge user doc with top-level fields
   * 3) Overwrite skillSet on user doc
   * 4) Overwrite top-level collections (education, worker, projects, services)
   */
  const saveProfileData = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth?.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const userRef = doc(db, "users", user.uid);

      let photoURL = "";
      // 1) If base64 image
      if (
        data.profileImage &&
        typeof data.profileImage === "string" &&
        data.profileImage.startsWith("data:image/")
      ) {
        const storageRef = ref(
          storage,
          `profileImages/${user.uid}_${Date.now()}`
        );
        await uploadString(storageRef, data.profileImage, "data_url");
        photoURL = await getDownloadURL(storageRef);
      } else {
        photoURL = data.profileImage || "";
      }

      // 2) Merge with user doc
      const userData = {
        photo_url: photoURL,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        experience: data.experience || "",
        type: data.type || "",
        state: data.state || "",
        city: data.city || "",
        consultingPrice: data.consultingPrice || "",
        consultingDuration: data.consultingDuration || "",
        consultingDurationType: data.consultingDurationType || "",
        updatedAt: Timestamp.now(),
      };

      await setDoc(userRef, userData, { merge: true });

      // 3) Overwrite skillSet
      if (Array.isArray(data.skills)) {
        const normalizedSkills = data.skills
          .map((skillObj) => {
            if (!skillObj?.skill) return null;
            return {
              skill: skillObj.skill.trim(),
              skillRating: skillObj.skillRating || 0,
            };
          })
          .filter(Boolean);

        await updateDoc(userRef, { skillSet: normalizedSkills });
      }

      // 4) Overwrite sub-collections

      // EDUCATION
      await deleteDocsInCollection("education", "usereducation", userRef);
      if (Array.isArray(data.education) && data.education.length > 0) {
        const educationDocs = data.education.map((edu) => ({
          collegename: edu.college || "",
          degree: edu.degree || "",
          startyear: parseDateString(edu.startDate),
          endyear: parseDateString(edu.endDate),
          branch: edu.stream || "",
          cgpa: edu.cgpa || "",
        }));
        await batchAddDocuments(
          "education",
          "usereducation",
          educationDocs,
          userRef
        );
      }

      // WORK
      await deleteDocsInCollection("worker", "work", userRef);
      if (Array.isArray(data.work) && data.work.length > 0) {
        const workDocs = data.work.map((w) => ({
          companyName: w.company || "",
          description: w.description || "",
          startDate: parseDateString(w.startDate),
          endDate: parseDateString(w.endDate),
          role: w.position || "",
        }));
        await batchAddDocuments("worker", "work", workDocs, userRef);
      }

      // PROJECTS
      await deleteDocsInCollection("projects", "userproject", userRef);
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        const projectsDocs = data.projects.map((proj) => {
          // e.g. "Jan 2023 - Present"
          const [startStr, endStr] = proj.duration?.split(" - ") || [];
          return {
            projectName: proj.projectName || "",
            startDate: parseDateString(startStr),
            endDate: endStr ? parseDateString(endStr) : "Present",
            liveDemo: proj.liveLink || "",
            description: proj.description || "",
          };
        });
        await batchAddDocuments(
          "projects",
          "userproject",
          projectsDocs,
          userRef
        );
      }

      // SERVICES
      await deleteDocsInCollection("services", "userRef", userRef);
      if (Array.isArray(data.services) && data.services.length > 0) {
        const servicesDocs = data.services.map((srv) => {
          if (data.type?.toLowerCase() === "intern") {
            // For an intern
            return {
              serviceName: srv.serviceName || "",
              serviceDescription: srv.serviceDescription || "",
              startDate: parseDateString(srv.startDate),
              endDate: parseDateString(srv.endDate),
              availability: srv.availability || "full time",
              hoursPerDay: srv.hoursPerDay || null,
            };
          } else {
            // Normal
            return {
              serviceName: srv.serviceName || "",
              serviceDescription: srv.serviceDescription || "",
              servicePrice: srv.servicePrice || "",
              serviceDuration: srv.duration || "",
              serviceDurationType: srv.durationType || "",
            };
          }
        });

        await batchAddDocuments("services", "userRef", servicesDocs, userRef);
      }

      toast.success("Data saved successfully!");
      navigate(`/profile/${user.uid}`);
    } catch (err) {
      setError(err.message);
      console.error("Error saving profile data:", err);
      toast.error(`Error saving profile data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { saveProfileData, loading, error };
};

export default useSaveProfileData;
