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

const useSaveProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const storage = getStorage();

  /**
   * Delete all documents in a collection where `fieldName == userRef`.
   */
  async function deleteDocsInCollection(collectionName, fieldName, userRef) {
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
  }

  /**
   * Batch-add multiple docs to a top-level collection
   */
  async function batchAddDocuments(
    collectionName,
    fieldName,
    docsArray,
    userRef
  ) {
    if (!docsArray || !docsArray.length) return;
    const collRef = collection(db, collectionName);
    const batch = writeBatch(db);
    docsArray.forEach((item) => {
      const newDocRef = doc(collRef); // auto-ID
      batch.set(newDocRef, {
        ...item,
        [fieldName]: userRef,
        createdAt: new Date().toISOString(), // Store as string
      });
    });
    await batch.commit();
  }

  // Main function that saves/updates user’s profile data
  const saveProfileData = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");
      const userRef = doc(db, "users", user.uid);

      let photoURL = "";
      // 1) If data.profileImage is base64 -> upload to Storage
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

      // 2) Merge user doc
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
        updatedAt: new Date().toISOString(), // Store as string
      };

      await setDoc(userRef, userData, { merge: true });

      // 3) skillSet
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

      // 4) Overwrite top-level collections

      // EDUCATION
      await deleteDocsInCollection("education", "usereducation", userRef);
      if (Array.isArray(data.education) && data.education.length > 0) {
        const educationDocs = data.education.map((edu) => ({
          collegename: edu.college || "",
          degree: edu.degree || "",
          // Store dates as strings
          startyear: edu.startDate || "",
          endyear: edu.endDate || "",
          stream: edu.stream || "",
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
          // Store dates as strings
          startDate: w.startDate || "",
          endDate: w.endDate || "",
          role: w.position || "",
        }));
        await batchAddDocuments("worker", "work", workDocs, userRef);
      }

      // PROJECTS
      await deleteDocsInCollection("projects", "userproject", userRef);
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        const projectsDocs = data.projects.map((proj) => ({
          projectName: proj.projectName || "",
          liveDemo: proj.liveLink || "",
          description: proj.description || "",
          duration: proj.duration || "",
          // Store dates as strings if needed
        }));
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
          if ((data.type || "").toLowerCase() === "intern") {
            return {
              serviceName: srv.serviceName || "",
              serviceDescription: srv.serviceDescription || "",
              startDate: srv.startDate || "",
              endDate: srv.endDate || "",
              availability: srv.availability || "full time",
              hoursPerDay: srv.hoursPerDay || null,
            };
          } else {
            return {
              serviceName: srv.serviceName || "",
              serviceDescription: srv.serviceDescription || "",
              servicePrice: srv.servicePrice || "",
              serviceDuration: srv.duration || "",
              serviceDurationType: srv.durationType || "",
              serviceVideo: srv.serviceVideo || "",
              images: srv.images || [],
            };
          }
        });
        await batchAddDocuments("services", "userRef", servicesDocs, userRef);
      }

      toast.success("Data saved successfully!");
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
