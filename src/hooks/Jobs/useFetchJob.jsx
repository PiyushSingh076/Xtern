import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export const useFetchJob = (id) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid job ID");
      setLoading(false);
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
    const jobSnapshot = await getDoc(doc(db, "jobs", id));
    console.log("jobSnapshot", jobSnapshot);
    if (!jobSnapshot.exists()) {
      toast.error("Job not found");
      throw new Error("Job not found");
    }

    const data = jobSnapshot.data();
    // delete data["applicants"];
    return data;
  }

  async function fetchApplicantDetails() {
    try {
      const jobSnapshot = await getDoc(doc(db, "jobs", id));

      if (!jobSnapshot.exists()) {
        throw new Error("Job not found");
      }

      const job = jobSnapshot.data();
      const applicants = job.applicants || [];
      return applicants;
    } catch (error) {
      console.error("Error fetching applicants:", error.message);
      toast.error("Error fetching applicants");
      throw error;
    }
  }

  return { jobDetails, loading, fetchApplicantDetails };
};
