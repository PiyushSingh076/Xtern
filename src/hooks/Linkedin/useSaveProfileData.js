// import { useState } from "react";
// import {
//   collection,
//   doc,
//   setDoc,
//   updateDoc,
//   getDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { auth, db } from "../../firebaseConfig";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const useSaveProfileData = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Helper function to parse dates
//   const parseDateString = (dateStr) => {
//     if (!dateStr) return null; // Return null if no date string is provided

//     if (dateStr.toLowerCase() === "present") return "Present"; // Handle special "present" case

//     const [monthStr, year] = dateStr.split(" ");
//     if (!monthStr || !year) return null; // Return null if the date string format is invalid

//     // Attempt to create a valid Date object
//     const month = new Date(`${monthStr} 1, ${year}`).getMonth();
//     const parsedDate = new Date(year, month, 1); // Create a date with the given month and year

//     // Check if parsedDate is a valid Date object
//     if (isNaN(parsedDate)) return null; // Return null if it's an invalid date

//     return Timestamp.fromDate(parsedDate); // Return the Timestamp object if valid
//   };

//   const saveProfileData = async (data) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const user = auth?.currentUser;

//       if (!user) {
//         throw new Error("User not authenticated.");
//       }

//       const userUid = user?.uid;
//       const userRef = doc(db, "users", userUid); // Firestore reference for the user document

//       // Update or save top-level user data
//       const userData = {
//         photo_url: data?.profileImage || "",
//         firstName: data?.firstName || "",
//         lastName: data?.lastName || "",
//         experience: data?.experience || "",
//         type: data?.type || "",
//         state: data?.state || "",
//         city: data?.city || "",
//         consultingPrice: data?.consultingPrice || "",
//         consultingDuration: data?.consultingDuration || "",
//         consultingDurationType: data?.consultingDurationType || "",
//         updatedAt: Timestamp.now(),
//       };

//       await setDoc(userRef, userData, { merge: true });

//       if (Array.isArray(data?.skills) && data.skills.length > 0) {
//         const docSnapshot = await getDoc(userRef);
//         let existingSkills = [];

//         // Retrieve existing skills from Firestore
//         if (
//           docSnapshot.exists() &&
//           Array.isArray(docSnapshot.data()?.skillSet)
//         ) {
//           existingSkills = docSnapshot.data().skillSet;
//         }

//         // Normalize the input skills array to ensure each skill object has the correct structure
//         const normalizedSkills = data.skills
//           .map((skillObj) => {
//             // Ensure skillObj has both 'skill' and 'skill-rating' properties
//             if (
//               skillObj?.skill &&
//               typeof skillObj.skill === "string" &&
//               skillObj["skill-rating"] !== undefined
//             ) {
//               return {
//                 skill: skillObj.skill.trim(), // Trim the skill name
//                 skillRating: skillObj["skill-rating"], // Updated to "skillRating"
//               };
//             }
//             return null; // Ignore invalid or incomplete skill objects
//           })
//           .filter((skill) => skill !== null); // Remove any null values from the array

//         // Merge existing skills with the new ones, ensuring no duplicates and valid data
//         const updatedSkills = Array.from(
//           new Set([
//             ...existingSkills.map((existingSkill) => existingSkill.skill),
//             ...normalizedSkills.map((skill) => skill.skill),
//           ])
//         )
//           .map((skill) => {
//             // Find the matching skill object in normalizedSkills to retrieve full data (including skillRating)
//             return normalizedSkills.find(
//               (skillObj) => skillObj.skill === skill
//             );
//           })
//           .filter((skill) => skill !== undefined); // Ensure no undefined values are included

//         // If there are still undefined values after filtering, log them for debugging
//         if (updatedSkills.some((skill) => skill === undefined)) {
//           console.error(
//             "Found undefined value in updated skills:",
//             updatedSkills
//           );
//         } else {
//           await updateDoc(userRef, {
//             skillSet: updatedSkills,
//           });
//         }
//       }

//       // Save Intern Role Data
//       if (
//         data?.type?.toLowerCase() === "intern" &&
//         Array.isArray(data?.services)
//       ) {
//         const internData = data.services.map((service) => ({
//           serviceName: service?.serviceName || "",
//           serviceDescription: service?.serviceDescription || "",
//           startDate: parseDateString(service?.startDate), // Parse start date
//           endDate: parseDateString(service?.endDate), // Parse end date
//           availability: service?.availability || "full time",
//           hoursPerDay:
//             service?.availability === "part time"
//               ? service?.hoursPerDay || ""
//               : null,
//         }));

//         // Save Intern-specific data in the "users" collection
//         await updateDoc(userRef, { internDetails: internData });
//       }

//       // Save Education Subcollection
//       if (Array.isArray(data?.education)) {
//         const educationCollectionRef = collection(db, "education");

//         for (const edu of data.education) {
//           const educationData = {
//             degree: edu?.degree || "",
//             stream: edu?.stream || "",
//             college: edu?.college || "",
//             startDate: parseDateString(edu?.startDate),
//             endDate: edu?.endDate ? parseDateString(edu?.endDate) : null, // Corrected endDate handling
//             usereducation: userRef, // Storing as a DocumentReference to user document
//             cpga: edu?.cpga || "",
//             createdAt: Timestamp.now(),
//           };

//           await setDoc(doc(educationCollectionRef), educationData);
//         }
//       }

//       // Save Work Experience Subcollection
//       if (Array.isArray(data?.work)) {
//         const workCollectionRef = collection(db, "worker");

//         for (const work of data.work) {
//           const workData = {
//             companyName: work?.company || "",
//             description: work?.description || "",
//             startDate: parseDateString(work?.startDate), // Parse start date
//             endDate: parseDateString(work?.endDate), // Parse end date
//             role: work?.position || "",
//             work: userRef, // Storing as a DocumentReference to user document
//             createdAt: Timestamp.now(),
//           };

//           await setDoc(doc(workCollectionRef), workData);
//         }
//       }

//       // Save Projects Subcollection
//       if (Array.isArray(data?.projects)) {
//         const projectsCollectionRef = collection(db, "projects");

//         for (const project of data.projects) {
//           const projectData = {
//             projectName: project?.projectName || "",
//             startDate: parseDateString(project?.duration?.split("-")?.[0]), // Parse start date
//             endDate: parseDateString(project?.duration?.split("-")?.[1]), // Parse end date
//             liveDemo: project?.liveLink || "",
//             description: project?.description || "",
//             userproject: userRef, // Storing as a DocumentReference to user document
//             createdAt: Timestamp.now(),
//           };

//           await setDoc(doc(projectsCollectionRef), projectData);
//         }
//       }

//       // Save Services Subcollection
//       if (Array.isArray(data?.services)) {
//         const servicesCollectionRef = collection(db, "services");

//         for (const service of data.services) {
//           const serviceData = {
//             serviceName: service?.serviceName || "",
//             serviceDescription: service?.serviceDescription || "",
//             servicePrice: service?.servicePrice || "",
//             serviceDuration: service?.duration || "",
//             serviceDurationType: service?.durationType || "",
//             userRef: userRef, // Reference to the user's document
//             createdAt: Timestamp.now(),
//           };

//           await setDoc(doc(servicesCollectionRef), serviceData);
//         }
//       }

//       // Notify success and navigate
//       toast.success("data saved successfully!");
//       navigate("/homescreen");
//     } catch (err) {
//       setError(err.message);
//       console.error(err);
//       toast.error(`Error saving profile data: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { saveProfileData, loading, error };
// };
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
 * Hook to save/update user profile data:
 * 1. If profileImage is a data URL (manual upload), upload to Firebase Storage; store its downloadURL in Firestore.
 * 2. skillSet is an array on the user doc.
 * 3. education, worker, projects, services, etc. are top-level collections referencing the user doc.
 */
const useSaveProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const storage = getStorage(); // Initialize Firebase Storage

  /**
   * Parses a date string in "MMM YYYY" format (e.g. "Jan 2020")
   * or the word "Present" -> a Firestore Timestamp or "Present" string.
   */
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    if (typeof dateStr === "string" && dateStr.toLowerCase() === "present") {
      return "Present";
    }

    const [monthStr, year] = dateStr.split(" ");
    if (!monthStr || !year) return null;

    const month = new Date(`${monthStr} 1, ${year}`).getMonth();
    if (isNaN(month)) return null;

    const parsedDate = new Date(year, month, 1);
    if (isNaN(parsedDate)) return null;

    return Timestamp.fromDate(parsedDate);
  };

  /**
   * Delete all documents in a top-level collection where `fieldName` == userRef.
   * Example: "projects", "userproject", userRef
   */
  const deleteDocsInCollection = async (collectionName, fieldName, userRef) => {
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
  };

  /**
   * Batch-add multiple docs to a top-level collection, linking them to the user doc reference.
   */
  const batchAddDocuments = async (
    collectionName,
    fieldName,
    documents,
    userRef
  ) => {
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
  };

  /**
   * The main function that saves or updates the user’s profile data:
   * 1. If data.profileImage is base64, upload to Storage -> get downloadURL -> photo_url
   * 2. Merge user doc with top-level data (photo_url, etc.)
   * 3. skillSet array -> user doc
   * 4. Overwrite top-level collections (education, worker, projects, services) by deleting old docs, then adding new ones
   */
  const saveProfileData = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth?.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const userRef = doc(db, "users", user.uid);

      let photoURL = "";
      // 1) If we have data.profileImage and it looks like a base64 data URL, upload to Storage
      if (
        data.profileImage &&
        typeof data.profileImage === "string" &&
        data.profileImage.startsWith("data:image/")
      ) {
        // Create a unique filename in Storage, e.g. "profileImages/{userId}_{timestamp}.jpg"
        const storageRef = ref(
          storage,
          `profileImages/${user.uid}_${Date.now()}`
        );
        // Use 'uploadString' for data URLs (type = "data_url")
        await uploadString(storageRef, data.profileImage, "data_url");
        // Get the download URL after uploading
        photoURL = await getDownloadURL(storageRef);
      } else {
        // Possibly user already had a URL from LinkedIn or from Firestore
        photoURL = data.profileImage || "";
      }

      // 2) Merge top-level user data
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

      // 3) If skills exist, overwrite skillSet on the user doc
      if (Array.isArray(data.skills)) {
        const normalizedSkills = data.skills
          .map((skillObj) =>
            skillObj?.skill && typeof skillObj.skill === "string"
              ? {
                  skill: skillObj.skill.trim(),
                  skillRating: skillObj.skillRating || 0,
                }
              : null
          )
          .filter(Boolean);

        await updateDoc(userRef, { skillSet: normalizedSkills });
      }

      // 4) Top-level collections
      // EDUCATION
      await deleteDocsInCollection("education", "usereducation", userRef);
      if (Array.isArray(data.education) && data.education.length > 0) {
        const educationDocs = data.education.map((edu) => ({
          collegename: edu.collegename || "",
          degree: edu.degree || "",
          startyear: edu.startyear || "",
          endyear: edu.endyear || "Present",
          branch: edu.branch || "",
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
        const servicesDocs = data.services.map((srv) => ({
          serviceName: srv.serviceName || "",
          serviceDescription: srv.serviceDescription || "",
          servicePrice: srv.servicePrice || "",
          serviceDuration: srv.duration || "",
          serviceDurationType: srv.durationType || "",
        }));
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
