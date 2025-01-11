import { collection, addDoc, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../src/firebaseConfig";

const useSaveEntrepreneurDetails = () => {
  const saveEntrepreneurDetails = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not logged in.");

      const userId = data.uid || user.uid; // Use existing uid if editing
      const userRef = doc(db, "users", userId);

      if (!data) throw new Error("No data provided");
      if (!db) throw new Error("Firestore instance not initialized");

      let normalizedData = {
        firstName: data.firstName,
        lastName: data.lastName,
        industry: data.industry,
        linkedinProfileUrl: data.linkedinProfile,
        experience: data.experience,
        location: {
          city: data.city,
          state: data.state,
        },
        photo_url: data.photo_url,
        companyDetails: {
          name: data.companyDetails.name,
          description: data.companyDetails.description,
          logo: data.companyDetails.logo.url,
          startDate: data.companyDetails.startDate,
        },
        skills: data.skillsRequired,
        jobPostings: data.jobPostings || [], // Preserve existing job postings if any
        uid: userId,
        type: "entrepreneur",
      };

      // If editing, merge with existing data to preserve fields not in the form
      if (data.uid) {
        const existingDoc = await getDoc(userRef);
        if (existingDoc.exists()) {
          normalizedData = {
            ...existingDoc.data(),
            ...normalizedData,
          };
        }
      }

      await setDoc(userRef, normalizedData, { merge: true });
      return userId;

    } catch (error) {
      console.error("Error: ", error.message);
      throw new Error("Failed to save entrepreneur details: " + error.message);
    }
  };

  return { saveEntrepreneurDetails };
};

export default useSaveEntrepreneurDetails;