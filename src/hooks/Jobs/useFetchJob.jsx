import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export const useFetchJob = (id) => {
  const [jobData, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplicantDetails = async (userId) => {
    const user = (await getDoc(doc(db, "users", userId))).data();
    return user;
  }

  useEffect(() => {
    if (!id) {
      toast.error("Invalid job ID");
      setLoading(true);
      return;
    }

    const handleFetchJob = async () => {
      try {
        setLoading(true);
        const data = await fetchJob();
        setJobDetails(data);
      } catch (error) {
        console.error("Error fetching job:", error.message);
        toast.error("Error fetching job");
      } finally {
        setLoading(false);
      }
    };

    handleFetchJob();
  }, [id]);

  async function fetchJob() {
    const jobSnapshot = await getDoc(doc(db, "jobPosting", id));
    console.log("Job", jobSnapshot.data());
    if (!jobSnapshot.exists()) {
      toast.error("Job not found");
      throw new Error("Job not found");
    }

    const data = jobSnapshot.data();
    // delete data["applicants"];
    return data;
  }


  return { jobData, loading, fetchApplicantDetails };
};
