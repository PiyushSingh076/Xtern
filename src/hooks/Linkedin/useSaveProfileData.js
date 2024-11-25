import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Timestamp } from "firebase/firestore"; // Ensure firebase is properly set up

/**
 * Custom hook to save profile data.
 * Handles user, education, work experience, projects, and services data appropriately.
 */
const useSaveProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveProfileData = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      const userUid = user.uid;

      // Reference to the user's document
      const userRef = doc(db, "users", userUid);

      // Save top-level user data
      await setDoc(
        userRef,
        {
          profileImage: data.profileImage || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          experience: data.experience || "",
          type: data.type || "",
          state: data.state || "",
          city: data.city || "",
          consultingPrice: data.consultingPrice || "",
          consultingDuration: data.consultingDuration || "",
          consultingDurationType: data.consultingDurationType || "",
          skills: data.skills || [], // Storing skills in the user's collection
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );

      // Helper function to parse date strings
      const parseDateString = (dateStr) => {
        if (!dateStr) return null;
        if (dateStr.toLowerCase() === "present") return "Present";
        const [monthStr, year] = dateStr.split(" ");
        const month = new Date(`${monthStr} 1, ${year}`).getMonth(); // Month is 0-indexed
        return Timestamp.fromDate(new Date(year, month, 1));
      };

      // Save Education Subcollection
      if (data.education && Array.isArray(data.education)) {
        const educationCollectionRef = collection(userRef, "education");
        for (const edu of data.education) {
          await setDoc(doc(educationCollectionRef), {
            degree: edu.degree || "",
            stream: edu.stream || "",
            college: edu.college || "",
            startDate: parseDateString(edu.startDate),
            endDate: parseDateString(edu.endDate),
            cgpa: edu.cgpa || "",
            createdAt: Timestamp.now(),
          });
        }
      }

      // Save Work Experiences in the Worker Collection
      if (data.work && Array.isArray(data.work)) {
        const workerCollectionRef = collection(db, "worker");
        for (const work of data.work) {
          await setDoc(doc(workerCollectionRef), {
            companyname: work.companyname || "",
            description: work.description || "",
            startdate: parseDateString(work.startdate),
            enddate: parseDateString(work.enddate),
            role: work.role || "",
            userReference: `/users/${userUid}`, // Linking the document to the user
            createdAt: Timestamp.now(),
          });
        }
      }

      // Save Projects Subcollection
      if (data.projects && Array.isArray(data.projects)) {
        const projectsCollectionRef = collection(userRef, "projects");
        for (const project of data.projects) {
          await setDoc(doc(projectsCollectionRef), {
            projectName: project.projectName || "",
            duration: project.duration || "",
            liveLink: project.liveLink || "",
            description: project.description || "",
            createdAt: Timestamp.now(),
          });
        }
      }

      //   // Save Services Subcollection
      //   if (data.services && Array.isArray(data.services)) {
      //     const servicesCollectionRef = collection(userRef, "services");
      //     for (const service of data.services) {
      //       await setDoc(doc(servicesCollectionRef), {
      //         serviceName: service.serviceName || "",
      //         serviceDescription: service.serviceDescription || "",
      //         servicePrice: service.servicePrice || "",
      //         createdAt: Timestamp.now(),
      //       });
      //     }
      //   }

      console.log("Profile data saved successfully.");
    } catch (err) {
      console.error("Error saving profile data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { saveProfileData, loading, error };
};

export default useSaveProfileData;
