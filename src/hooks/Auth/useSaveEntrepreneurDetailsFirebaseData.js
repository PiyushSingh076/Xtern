import { collection, addDoc, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../src/firebaseConfig";

const useSaveEntrepreneurDetails = () => {
  const saveEntrepreneurDetails = async (data) => {
    if (data){
      console.log(data)
    }
    try {
      // Validate that the data exists
      const user = auth.currentUser;
      const userId = user.uid;
      const userRef = doc(db, "users", userId)
      if (!data) throw new Error("No data provided");

      // Validate the Firestore instance
      if (!db) throw new Error("Firestore instance not initialized");

      // Save data in the "entrepreneurs" collection
      console.log("uhh")
      let normalizedData= {
        firstName: data.firstName,
        lastName: data.lastName,
        industry: data.industry,
        linkedinProfileUrl: data.linkedinProfile,
        experience: data.experience,
        location: {
          city: data.city,
          state: data.state
        },
        photo_url: data.profileImage.url,
        companyDetails : data.companyDetails,
        skills: data.skillsRequired,
        jobPostings: [],
        uid: userId,
        type: "entrepreneur"
      };

      // console.log(normalizedData)
      const testuser = await getDoc(userRef);
      console.log(testuser.data())
      try {
        await updateDoc(userRef, normalizedData, { merge: true });
        
      } catch (error) {
        console.log(error)
      }
      // return docRef.id;
      
      return userId;

      // const docRef = await addDoc(collection(db, "users"),{...data, type: "entrepreneur", jobs: [], });
      // console.log(docRef)
      // return docRef.id; // Return document ID
      throw new Error("test")
      
    } catch (error) {
      throw new Error("Failed to save entrepreneur details: " + error.message);
    }
  };

  return { saveEntrepreneurDetails };
};

export default useSaveEntrepreneurDetails;
