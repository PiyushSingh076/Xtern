import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc, // Import `doc` directly from Firestore
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";

const useFetchShortlistedInterns = () => {
  const [shortlistedInterns, setShortlistedInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortlistedInterns = async (userId) => {
      try {
        // Use `doc(db, "collection", "documentID")` to create a reference path in the modular SDK
        const q = query(
          collection(db, "shortlistedInterns"),
          where("entreRef", "==", doc(db, "users", userId)) // Using `doc(db, "users", userId)` to reference entrepreneur's document
        );

        const querySnapshot = await getDocs(q);

        const internsData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const internRef = docSnapshot.data().internRef;

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
                return { id: docSnapshot.id, ...internDoc.data() };
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

        setShortlistedInterns(internsData.filter(Boolean));
      } catch (error) {
        console.error("Error fetching shortlisted interns:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchShortlistedInterns(user.uid);
      } else {
        setShortlistedInterns([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { shortlistedInterns, loading };
};

export default useFetchShortlistedInterns;
