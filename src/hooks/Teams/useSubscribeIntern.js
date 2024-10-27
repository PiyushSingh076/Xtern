import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebaseConfig";

const useSubscribeIntern = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ ...firebaseUser, ...userDoc.data() });
          } else {
            console.error("No such document in users collection!");
            setError("User data not found in Firestore.");
          }
        } catch (err) {
          console.error("Error fetching user document:", err);
          setError("Failed to retrieve user information.");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const subscribeIntern = async (internId) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    const userRef = doc(db, "users", user.uid); // Reference to authenticated user
    const stripeCustomerId = user.stripeCustomerId; // Fetch `stripeCustomerId` from the user data
    const internRef = doc(db, "users", internId); // Reference to intern being subscribed

    if (!stripeCustomerId) {
      setError(
        "Stripe Customer ID is missing. Cannot proceed with subscription."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Add a new subscription document in `stripeSubscription` collection
      await addDoc(collection(db, "stripeSubscription"), {
        createdAt: Timestamp.now(),
        internRef: internRef, // Reference to the intern
        stripeCustomerId: stripeCustomerId, // Stripe customer ID from session
        userRef: userRef, // Reference to the authenticated user
      });

      // Query the `shortlistedInterns` collection to find the matching document
      const shortlistQuery = query(
        collection(db, "shortlistedInterns"),
        where("entreRef", "==", userRef),
        where("internRef", "==", internRef)
      );

      const querySnapshot = await getDocs(shortlistQuery);
      if (!querySnapshot.empty) {
        // Assuming only one document matches; delete it
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(db, "shortlistedInterns", docToDelete.id));
        console.log("Successfully removed intern from shortlist.");
      } else {
        console.warn("No matching document found in shortlistedInterns.");
      }
    } catch (err) {
      console.error("Error subscribing intern:", err);
      setError("Failed to subscribe intern. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { subscribeIntern, loading, error };
};

export default useSubscribeIntern;
