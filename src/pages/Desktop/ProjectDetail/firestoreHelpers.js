import { collection, addDoc, getFirestore } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

// Save review to the Firestore reviews collection
export const saveReview = async (reviewData) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), reviewData);
    console.log("Review saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving review:", error);
    throw error;
  }
};