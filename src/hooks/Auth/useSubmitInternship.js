import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
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
      const internshipDocRef = doc(db, "applicants", user.uid);

      const internshipData = {
        githublink: githubUrl,
        createdAt: new Date().toISOString(),
        outputUrl: deploymentUrl,
        jobref: jobref || "/applicants/default-job",
        videourl: videoDemoUrl,
      };

      await setDoc(internshipDocRef, internshipData);

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
