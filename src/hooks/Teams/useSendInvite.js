// useSendInvite.js
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig";

const useSendInvite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up an authentication state observer and fetch the authenticated user's data
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // User is signed in, fetch user details
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error("No user profile found.");
          setError("User profile not found.");
        }
      } else {
        setUser(null); // User is signed out
      }
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const sendInvite = async (invitedPhone, accessRole) => {
    if (!user) {
      setError("User not authenticated or no profile data found");
      return;
    }

    const inviterPhone = user.phone_number;
    const organizationRef = user.organization;

    setLoading(true);
    setError(null);

    try {
      // Normalize the phone number by removing any non-digit characters
      const normalizedPhone = invitedPhone.replace(/\D/g, "");

      // Create a query against the "users" collection where phone_number equals the invited phone
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone_number", "==", normalizedPhone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No user found with the given phone number
        setError("The phone number does not exist in our records.");
        return;
      }

      // Create a new invite document in the teamInvite collection
      await addDoc(collection(db, "teamInvite"), {
        invited: normalizedPhone,
        inviter: inviterPhone,
        organization: organizationRef,
        accessRole, // Include the accessRole here
        createdAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("Error sending invite:", err);
      setError("Failed to send invite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { sendInvite, loading, error };
};

export default useSendInvite;
