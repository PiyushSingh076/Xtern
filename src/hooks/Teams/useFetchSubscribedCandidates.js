import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";

const useFetchSubscribedCandidates = () => {
  const [subscribedCandidates, setSubscribedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribedCandidates = async (userId) => {
      try {
        // Query to get documents in `stripeSubscription` where `userRef` matches the user's UID
        const q = query(
          collection(db, "stripeSubscription"),
          where("userRef", "==", doc(db, "users", userId))
        );

        const querySnapshot = await getDocs(q);

        const candidatesData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const internRef = docSnapshot.data().internRef;
            const createdAt = docSnapshot.data().createdAt;


            if (!internRef) {
              console.warn(
                "Skipping document due to missing internRef:",
                docSnapshot.id
              );
              return null;
            }

            try {
              // Fetch intern details using the `internRef` directly as a document reference
              const internDoc = await getDoc(internRef);
              if (internDoc.exists()) {
                return {
                  id: docSnapshot.id,
                  createdAt: createdAt,
                  internDetails: internDoc.data(),
                  stripeCustomerId: docSnapshot.data().stripeCustomerId,
                };
              } else {
                console.warn(
                  "No intern document found for internRef:",
                  internRef.id
                );
                return null;
              }
            } catch (error) {
              console.error(
                "Error fetching intern document:",
                error,
                "internRef:",
                internRef.id
              );
              return null;
            }
          })
        );

        setSubscribedCandidates(candidatesData.filter(Boolean));

      } catch (error) {
        console.error("Error fetching subscribed candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSubscribedCandidates(user.uid);
      } else {
        setSubscribedCandidates([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { subscribedCandidates, loading };
};

export default useFetchSubscribedCandidates;
