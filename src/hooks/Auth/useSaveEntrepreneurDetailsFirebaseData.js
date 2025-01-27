import { collection, addDoc, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../src/firebaseConfig";
import useAuthState from "../Authentication/useAuthState";

const useSaveEntrepreneurDetails = () => {
  const auth2 = useAuthState()
  
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


      // Debugging to check data
      console.log("Normalized Data:", normalizedData);
      // Check if user document exists
      // const testUser = await getDoc(userRef);
      // console.log(testUser.data());
      
      // Save or overwrite the document in Firestore
      console.log("Saving entrepreneur details...");
      try {
        await setDoc(userRef, normalizedData);
        auth2.setRegistrationStatus("logged_in");
        
        console.log("Data successfully saved to Firestore.");
      } catch (error) {
        console.error("Error while saving data to Firestore: ", error);
        throw new Error("Failed to save data to Firestore");

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