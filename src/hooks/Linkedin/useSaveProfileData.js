import { useState } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSaveProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const saveProfileData = async (data) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Starting saveProfileData...");
      const user = auth?.currentUser;

      if (!user) {
        throw new Error("User not authenticated.");
      }

      const userUid = user?.uid;
      const userRef = doc(db, "users", userUid); // Firestore reference for the user document

      console.log("Authenticated user UID:", userUid);

      // Update or save top-level user data
      const userData = {
        photo_url: data?.profileImage || "",
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        experience: data?.experience || "",
        type: data?.type || "",
        state: data?.state || "",
        city: data?.city || "",
        consultingPrice: data?.consultingPrice || "",
        consultingDuration: data?.consultingDuration || "",
        consultingDurationType: data?.consultingDurationType || "",
        updatedAt: Timestamp.now(),
      };

      console.log("Saving user data to Firestore:", userData);

      await setDoc(userRef, userData, { merge: true });
      console.log("Top-level user data saved successfully.");

      // Process and save skills
      if (Array.isArray(data?.skills) && data.skills.length > 0) {
        console.log("Updating skillSet with skills:", data.skills);

        const docSnapshot = await getDoc(userRef);
        let existingSkills = [];

        // Retrieve existing skills from Firestore
        if (
          docSnapshot.exists() &&
          Array.isArray(docSnapshot.data()?.skillSet)
        ) {
          existingSkills = docSnapshot.data().skillSet;
        }

        // Normalize the input skills array into a linear format
        const normalizedSkills = data.skills.flatMap((skill) => {
          if (typeof skill === "string") {
            return skill.trim(); // Handle strings directly
          } else if (typeof skill === "object" && skill?.skill) {
            return skill.skill.trim(); // Handle objects with a "skill" property
          }
          return []; // Ignore non-valid items
        });

        // Merge existing skills with the normalized skills, removing duplicates
        const updatedSkills = Array.from(
          new Set([...existingSkills, ...normalizedSkills])
        );

        console.log("Final merged skillSet array:", updatedSkills);

        // Update Firestore with the linearized skills array
        await updateDoc(userRef, {
          skillSet: updatedSkills, // Overwrite with the updated array
        });
        console.log("SkillSet updated successfully.");
        toast.success("Skills updated successfully!");
      }

      const parseDateString = (dateStr) => {
        if (!dateStr) return null;
        if (dateStr?.toLowerCase() === "present") return "Present";
        const [monthStr, year] = dateStr?.split(" ");
        const month = new Date(`${monthStr} 1, ${year}`).getMonth();
        return Timestamp.fromDate(new Date(year, month, 1));
      };

      // Save Education Subcollection
      if (Array.isArray(data?.education)) {
        console.log("Saving education data...");
        const educationCollectionRef = collection(db, "education");

        for (const edu of data.education) {
          const educationData = {
            degree: edu?.degree || "",
            stream: edu?.stream || "",
            collegename: edu?.collegename || "",
            startyear: edu?.startyear || "",
            endyear: edu?.endyear || "",
            usereducation: userRef, // Storing as a DocumentReference
            createdAt: Timestamp.now(),
          };

          console.log("Saving education record:", educationData);

          await setDoc(doc(educationCollectionRef), educationData);
        }
        console.log("Education data saved successfully.");
      }

      // Save Work Experience
      if (Array.isArray(data?.work)) {
        console.log("Saving work experience data...");
        const workerCollectionRef = collection(db, "worker");

        for (const work of data.work) {
          const workData = {
            companyname: work?.companyname || "",
            description: work?.description || "",
            startdate: parseDateString(work?.startdate),
            enddate: parseDateString(work?.enddate),
            role: work?.role || "",
            work: userRef, // Storing as a DocumentReference
            createdAt: Timestamp.now(),
          };

          console.log("Saving work experience record:", workData);

          await setDoc(doc(workerCollectionRef), workData);
        }
        console.log("Work experience data saved successfully.");
      }

      // Save Projects Subcollection
      if (Array.isArray(data?.projects)) {
        console.log("Saving projects data...");
        const projectsCollectionRef = collection(db, "projects");

        for (const project of data.projects) {
          const projectData = {
            projectname: project?.projectname || "",
            startdate: parseDateString(project?.startdate),
            enddate: parseDateString(project?.enddate),
            description: project?.description || "",
            userproject: userRef, // Storing as a DocumentReference
            createdAt: Timestamp.now(),
          };

          console.log("Saving project record:", projectData);

          await setDoc(doc(projectsCollectionRef), projectData);
        }
        console.log("Projects data saved successfully.");
      }

      // Notify success and navigate
      toast.success("Profile data saved successfully!");
      navigate("/homescreen");

      console.log("All profile data saved successfully.");
    } catch (err) {
      console.error("Error saving profile data:", err);
      setError(err.message);
      toast.error(`Error saving profile data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { saveProfileData, loading, error };
};

export default useSaveProfileData;
