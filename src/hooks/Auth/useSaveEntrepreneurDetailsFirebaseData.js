import { useState } from "react";
import { doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../src/firebaseConfig"; // Adjust the path based on your project structure
import toast from "react-hot-toast";

const useSaveEntrepreneurDetailsbFirebaseData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveData = async ({ collectionName, docId, data }) => {
    setLoading(true);
    setError(null);

    try {
      const timestampedData = {
        ...data,
        createdAt: Timestamp.now(),
      };

      if (docId) {
        
        await setDoc(doc(db, collectionName, docId), timestampedData, { merge: true });
      } else {
       
        await addDoc(collection(db, collectionName), timestampedData);
      }

      toast.success("Data saved successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(`Error saving data: ${err.message}`);
      console.error("Firebase save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { saveData, loading, error };
};

export default useSaveEntrepreneurDetailsbFirebaseData;
