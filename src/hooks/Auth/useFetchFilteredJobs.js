import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the path as necessary

const useFetchFilteredJobs = (userSkills, activeSkill) => {
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchFilteredJobs = async () => {
      if (userSkills.length === 0 || activeSkill === undefined) return;

      try {
        const jobsRef = collection(db, "jobPosting");
        let q;

        if (activeSkill === null) {
          // Fetch jobs that match any of the user's skills
          q = query(jobsRef);
        } else {
          // Fetch jobs that match the selected skill
          q = query(jobsRef, where("skills", "array-contains", activeSkill));
        }

        const querySnapshot = await getDocs(q);
        const matchingJobs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFilteredJobs(matchingJobs);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };

    fetchFilteredJobs();
  }, [activeSkill, userSkills]);

  return filteredJobs;
};

export default useFetchFilteredJobs;
