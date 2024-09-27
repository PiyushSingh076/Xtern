import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db, auth } from "../../firebaseConfig"; // Adjust the path as necessary

const useSubmitProject = () => {
  const [loading, setLoading] = useState(false);

  const submitProject = async (
    deploymentUrl,
    githubUrl,
    videoDemoUrl,
    realref
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

      // Create a unique document reference in Firestore under 'RealWorldSubmissions'
      const projectDocRef = doc(db, "RealWorldSubmissions", user.uid);

      const projectData = {
        codeUrl: githubUrl,
        createdAt: new Date().toISOString(),
        outputUrl: deploymentUrl,
        realref: realref || "/RealWorldTask/default-task",
        uid: user.uid,
        videoUrl: videoDemoUrl,
      };

      await setDoc(projectDocRef, projectData);

      toast.success("Project submitted successfully!");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project. Please try again.");
      setLoading(false);
      return false;
    }
  };

  return { submitProject, loading };
};

export default useSubmitProject;
