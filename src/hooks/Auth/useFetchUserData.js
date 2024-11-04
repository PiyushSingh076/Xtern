import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const useFetchUserData = () => {
  const [userData, setUserData] = useState(null); // Holds user data from Firestore
  const [loading, setLoading] = useState(true); // Indicates loading state
  const [error, setError] = useState(null); // Holds error messages, if any

  useEffect(() => {
    // Set up an authentication state observer
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Update userData state with Firestore data
          } else {
            // User document does not exist in Firestore
            setError("No user profile found.");
            setUserData(null); // Clear any existing userData
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data.");
          setUserData(null); // Clear any existing userData
        } finally {
          setLoading(false); // Update loading state
        }
      } else {
        // User is signed out
        setUserData(null); // Clear userData when user signs out
        setLoading(false); // Update loading state
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { userData, loading, error };
};

export default useFetchUserData;
