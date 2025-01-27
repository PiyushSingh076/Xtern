// import React, { useState } from "react";
// import StarRateIcon from "@mui/icons-material/StarRate";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import { saveReview } from "./firestoreHelpers";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// const db = getFirestore();

// import "./projectDetail.css";

// const LeaveReviewBox = ({ onCancel }) => {
//   const [rating, setRating] = useState(0); // Tracks the selected rating
//   const [hoverRating, setHoverRating] = useState(0); // Tracks the rating being hovered over
//   const [comment, setComment] = useState(""); // Tracks the entered comment

//   const handleReviewSubmit = async () => {
//     try {
//       const auth = getAuth(); // Initialize Firebase Auth
//       const currentUser = auth.currentUser; // Get the currently logged-in user

//       // Check if the user is logged in
//       if (!currentUser) {
//         console.error("User not logged in.");
//         return alert("You must be logged in to submit a review.");
//       }

//       // Get Firestore instance
//       const firestore = getFirestore();

//       // Fetch the user's name from the 'users' collection using their UID
//       const userRef = doc(firestore, "users", currentUser.uid); // Reference to the user's document in 'users' collection
//       const userDoc = await getDoc(userRef); // Fetch the user's document

//       let userName = "";
//       if (userDoc.exists()) {
//         userName = userDoc.data().displayName || "User"; // Use displayName from Firestore, fallback to "User"
//       } else {
//         userName = currentUser.displayName || "User"; // Fallback to currentUser's displayName or "User"
//       }

//       // Prepare review data
//       const reviewData = {
//         name: userName,
//         review: comment,
//         rating: rating, // Assuming rating is defined in your state
//         timestamp: new Date(),
//       };

//       console.log("Submitting review:", reviewData);

//       // Save the review
//       const reviewId = await saveReview(reviewData); // Assuming saveReview function is implemented
//       console.log("Review saved successfully:", reviewId);

//       // Fetch reviews again after submitting a review
//       const fetchReviews = async () => {
//         try {
//           const firestore = getFirestore();
//           // const reviewsRef = doc(firestore, "projects", projectId);
//           const reviewsDoc = await getDoc(reviewsRef);

//           if (reviewsDoc.exists()) {
//             const reviewsData = reviewsDoc.data();
//             if (reviewsData.reviews) {
//               console.log("Fetched reviews:", reviewsData.reviews); // Debug
//               setComment(reviewsData.reviews || []);
//             } else {
//               console.error("No reviews found for this project.");
//             }
//           } else {
//             console.error("No reviews found for this project.");
//           }
//         } catch (error) {
//           console.error("Error fetching reviews:", error);
//         }
//       };

//       fetchReviews();

//       // Reset form
//       setComment("");
//       setRating(0);
//       // setShowReviewForm(false);
//     } catch (error) {
//       console.error("Failed to save review:", error);
//     }
//   };

//   return (
//     <div
//       className="review-item"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         marginTop: "10px",
//         padding: "10px",
//         border: "1px solid #ccc",
//         borderRadius: "4px",
//       }}
//     >
//       <textarea
//         placeholder="Write your review here..."
//         style={{
//           width: "100%",
//           height: "80px",
//           resize: "none",
//           padding: "8px",
//           marginBottom: "10px",
//           border: "1px solid #ccc",
//           borderRadius: "4px",
//         }}
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//       ></textarea>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         {/* Star Rating */}
//         <div style={{ display: "flex" }}>
//           {Array.from({ length: 5 }).map((_, index) => (
//             <span
//               key={index}
//               onMouseEnter={() => setHoverRating(index + 1)} // Set hover rating
//               onMouseLeave={() => setHoverRating(0)} // Reset hover rating
//               onClick={() => setRating(index + 1)} // Set the rating
//               style={{ cursor: "pointer" }}
//             >
//               {index < (hoverRating || rating) ? (
//                 <StarRateIcon sx={{ color: "#0a65fc" }} />
//               ) : (
//                 <StarBorderIcon sx={{ color: "#0a65fc" }} />
//               )}
//             </span>
//           ))}
//         </div>
//         {/* Submit and Cancel Buttons */}
//         <div style={{ marginLeft: "100px" }}>
//           <button
//             style={{
//               backgroundColor: "#0a65fc",
//               color: "white",
//               fontSize: "12px",
//               padding: "4px 10px",
//               borderRadius: "4px",
//               border: "none",
//               marginRight: "5px",
//               cursor: "pointer",
//             }}
//             onClick={handleReviewSubmit}
//           >
//             Submit
//           </button>
//           <button
//             style={{
//               backgroundColor: "#ccc",
//               color: "black",
//               fontSize: "12px",
//               padding: "4px 10px",
//               borderRadius: "4px",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={onCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveReviewBox;

import React, { useState } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { saveReview } from "./firestore";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const LeaveReviewBox = ({ projectId, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleReviewSubmit = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("User not logged in.");
        return alert("You must be logged in to submit a review.");
      }

      const firestore = getFirestore();
      const userRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      let userName = "";
      if (userDoc.exists()) {
        userName = userDoc.data().displayName || "User";
      } else {
        userName = currentUser.displayName || "User";
      }

      const reviewData = {
        name: userName,
        review: comment,
        rating,
        userId: currentUser.uid,
        timestamp: new Date(),
      };

      console.log("Submitting review:", reviewData);

      const reviewId = await saveReview(reviewData);
      console.log("Review saved successfully:", reviewId);

      const fetchReviews = async () => {
        try {
          const reviewsRef = collection(firestore, "reviews");
          const q = query(reviewsRef, where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);

          const reviews = [];
          querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
          });

          setReviews(reviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();

      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Failed to save review:", error);
    }
  };

  return (
    <div
      className="review-item"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <textarea
        placeholder="Write your review here..."
        style={{
          width: "100%",
          height: "80px",
          resize: "none",
          padding: "8px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Star Rating */}
        <div style={{ display: "flex" }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              onMouseEnter={() => setHoverRating(index + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(index + 1)}
              style={{ cursor: "pointer" }}
            >
              {index < (hoverRating || rating) ? (
                <StarRateIcon sx={{ color: "#0a65fc" }} />
              ) : (
                <StarBorderIcon sx={{ color: "#0a65fc" }} />
              )}
            </span>
          ))}
        </div>
        {/* Submit and Cancel Buttons */}
        <div style={{ marginLeft: "100px" }}>
          <button
            style={{
              backgroundColor: "#0a65fc",
              color: "white",
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "4px",
              border: "none",
              marginRight: "5px",
              cursor: "pointer",
            }}
            onClick={handleReviewSubmit}
          >
            Submit
          </button>
          <button
            style={{
              backgroundColor: "#ccc",
              color: "black",
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewBox;
