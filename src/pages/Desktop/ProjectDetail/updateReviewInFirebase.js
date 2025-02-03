import { db } from "../../../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

// Function to update review in Firebase
const updateReviewInFirebase = async (userId, updatedReview, updatedRating) => {
  try {
    const reviewRef = doc(db, "reviews", userId);
    const reviewSnap = await getDoc(reviewRef);
    
    if (reviewSnap.exists()) {
      await updateDoc(reviewRef, {
        review: updatedReview,
        rating: updatedRating,
        timestamp: new Date(), 
      });
      console.log("Review updated successfully!");
    } else {
      console.error("No review found for this user!");
    }
  } catch (error) {
    console.error("Error updating review: ", error);
  }
};

export default updateReviewInFirebase;
