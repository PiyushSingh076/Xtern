import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
const useUnsubscribeCandidate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const unsubscribeCandidate = async (candidate) => {
    if (!user) {
      setError("User not authenticated");
      console.error("Error: User not authenticated");
      return;
    }

    // Firestore references for the authenticated user and intern
    const userRef = doc(db, "users", user.uid);
    const internRef = doc(db, "users", candidate.internDetails.uid);

    setLoading(true);
    setError(null);

    try {
      // Step 1: Query and delete from `stripeSubscription` collection using reference types
      const stripeQuery = query(
        collection(db, "stripeSubscription"),
        where("internRef", "==", internRef), // Use reference type directly
        where("userRef", "==", userRef) // Use reference type directly
      );

      const querySnapshot = await getDocs(stripeQuery);
      if (querySnapshot.empty) {
        console.warn("No matching documents found in stripeSubscription.");
      } else {
        for (const docSnapshot of querySnapshot.docs) {
          await deleteDoc(docSnapshot.ref);
        }
      }

      // Step 2: Add document to `shortlistedInterns` collection using reference types
      const newDocRef = await addDoc(collection(db, "shortlistedInterns"), {
        entreRef: userRef, // Store as reference type
        internRef: internRef, // Store as reference type
      });
    } catch (err) {
      console.error("Error during unsubscription:", err);
      setError("Failed to unsubscribe candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { unsubscribeCandidate, loading, error };
};

export default useUnsubscribeCandidate;
