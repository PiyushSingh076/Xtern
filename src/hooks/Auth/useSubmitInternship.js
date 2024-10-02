import { useState } from "react";
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db, auth } from "../../firebaseConfig"; // Adjust the path as necessary

const useSubmitInternship = () => {
  const [loading, setLoading] = useState(false);

  const submitInternship = async (
    deploymentUrl,
    githubUrl,
    videoDemoUrl,
    jobref
  ) => {
    // Perform basic validation
    if (!deploymentUrl || !githubUrl || !videoDemoUrl) {
      toast.error("All fields are required.");
      return false;
    }

    setLoading(true);
    try {
      const user = auth?.currentUser;
      if (!user) {
        toast.error("User is not authenticated.");
        setLoading(false);
        return false;
      }

      // Create a unique document reference in Firestore under 'applicants'
      const internshipDocRef = doc(collection(db, "applicants"));

      const internshipData = {
        githublink: githubUrl,
        createdAt: new Date().toISOString(),
        outputUrl: deploymentUrl,
        jobref: jobref || "/applicants/default-job",
        userref: doc(db, "users", user.uid),
        videourl: videoDemoUrl,
      };

      await setDoc(internshipDocRef, internshipData);

      const jobPostingRef = doc(db, jobref); // Reference to the job posting

      const jobPostingDoc = await getDoc(jobPostingRef);

      if (jobPostingDoc.exists()) {
        // If jobPosting exists, update the applicants array
        const jobPostingData = jobPostingDoc.data();

        // If 'applicants' array doesn't exist, initialize it
        const applicants = jobPostingData.applicants || [];

        await updateDoc(jobPostingRef, {
          applicants: arrayUnion(doc(db, "users", user.uid)) // Add user reference
        });
      } else {
        // If the jobPosting document doesn't exist, throw an error or handle accordingly
        toast.error("Job posting not found.");
        setLoading(false);
        return false;
      }

      toast.success("Internship submitted successfully!");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error submitting internship:", error);
      toast.error("Failed to submit internship. Please try again.");
      setLoading(false);
      return false;
    }
  };

  return { submitInternship, loading };
};

export default useSubmitInternship;
