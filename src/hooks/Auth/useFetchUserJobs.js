import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const useFetchUserJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User not authenticated");
        }

        // Assuming the user reference follows the pattern in the image
        const userRefPath = `/users/${user.uid}`;

        const q = query(
          collection(db, "jobPosting"),
          where("userref", "==", userRefPath) // Querying by 'userref' field
        );
        const querySnapshot = await getDocs(q);

        const jobData = [];
        querySnapshot.forEach((doc) => {
          jobData.push({ id: doc.id, ...doc.data() });
        });
        console.log(jobData, ".........");
        setJobs(jobData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading, error };
};

export default useFetchUserJobs;
