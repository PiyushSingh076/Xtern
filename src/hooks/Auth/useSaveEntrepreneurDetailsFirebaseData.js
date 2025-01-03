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
      const docRef = await addDoc(collection(db, "entrepreneur"),data);
      return docRef.id; // Return document ID
      console.log(data)
    } catch (error) {
      throw new Error("Failed to save entrepreneur details: " + error.message);
    }
  };

  return { saveEntrepreneurDetails };
};

export default useSaveEntrepreneurDetails;

