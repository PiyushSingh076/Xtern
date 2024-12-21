import { useState, useEffect } from "react";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

/**
 * Custom hook to fetch all scheduled calls for a given user (as host)
 * and include recipient user data
 * @param {string} userId - The UID of the host user
 * @returns {Object} { calls, loading, error }
 */
const useScheduledCallsForUser = (userId) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setCalls([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const hostRef = doc(db, "users", userId);
    const q = query(
      collection(db, "scheduledCalls"),
      where("hostUserRef", "==", hostRef)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const callsData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();
              let recipientData = null;

              if (data.recipientUserRef) {
                const recipientSnap = await getDoc(data.recipientUserRef);
                recipientData = recipientSnap.exists()
                  ? recipientSnap.data()
                  : null;
              }

              return {
                id: docSnap.id,
                ...data,
                recipient: recipientData,
              };
            })
          );

          setCalls(callsData);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching scheduled calls:", err);
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching scheduled calls:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { calls, loading, error };
};

export default useScheduledCallsForUser;
