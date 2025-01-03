import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../src/firebaseConfig";

const useSaveEntrepreneurDetails = () => {
  const saveEntrepreneurDetails = async (data) => {
    try {
      // Validate that the data exists
    if(data){
      console.log(data)
    }
      if (!data) throw new Error("No data provided");

      // Validate the Firestore instance
      if (!db) throw new Error("Firestore instance not initialized");

      // Save data in the "entrepreneurs" collection
<<<<<<< Updated upstream
      const docRef = await addDoc(collection(db, "entrepreneur"),data);
=======
      const docRef = await addDoc(collection(db, "users"), {...data, type: "entrepreneur"});
>>>>>>> Stashed changes
      return docRef.id; // Return document ID
      console.log(data)
    } catch (error) {
      throw new Error("Failed to save entrepreneur details: " + error.message);
    }
  };

  return { saveEntrepreneurDetails };
};

export default useSaveEntrepreneurDetails;

