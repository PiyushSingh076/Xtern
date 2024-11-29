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
      const user = auth?.currentUser;

      if (!user) {
        throw new Error("User not authenticated.");
      }

      const userUid = user?.uid;
      const userRef = doc(db, "users", userUid); // Firestore reference for the user document

      // Update or save top-level user data
      const userData = {
        photo_url: data?.profileImage || "",
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        type: data?.type || "",
        state: data?.state || "",
        city: data?.city || "",
        consultingPrice: data?.consultingPrice || "",
        consultingDuration: data?.consultingDuration || "",
        consultingDurationType: data?.consultingDurationType || "",
        updatedAt: Timestamp.now(),
      };

      await setDoc(userRef, userData, { merge: true });

      // Process and save skills as they are
      if (Array.isArray(data?.skills) && data.skills.length > 0) {
        const docSnapshot = await getDoc(userRef);
        let existingSkills = [];

        // Retrieve existing skills from Firestore
        if (
          docSnapshot.exists() &&
          Array.isArray(docSnapshot.data()?.skillSet)
        ) {
          existingSkills = docSnapshot.data().skillSet;
        }

        // Normalize the input skills array to make sure each skill object has the correct structure
        const normalizedSkills = data.skills
          .map((skillObj) => {
            if (skillObj?.skill && skillObj["skill-rating"] !== undefined) {
              return {
                skill: skillObj.skill.trim(),
                "skill-rating": skillObj["skill-rating"], // Retain skill-rating as it is
              };
            }
            return null; // Ignore invalid or incomplete skill objects
          })
          .filter((skill) => skill !== null); // Remove any null values from the array

        // Merge existing skills with the new ones, ensuring no duplicates
        const updatedSkills = Array.from(
          new Set([
            ...existingSkills.map((existingSkill) => existingSkill.skill),
            ...normalizedSkills.map((skill) => skill.skill),
          ])
        ).map((skill) => {
          return normalizedSkills.find((skillObj) => skillObj.skill === skill);
        });

        // Update Firestore with the updated skills array, keeping original structure
        await updateDoc(userRef, {
          skillSet: updatedSkills,
        });

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

          await setDoc(doc(educationCollectionRef), educationData);
        }
      }

      // Save Work Experience
      if (Array.isArray(data?.work)) {
        const workerCollectionRef = collection(db, "worker");

        for (const work of data.work) {
          const workData = {
            companyname: work?.company || "",
            description: work?.description || "",
            startdate: parseDateString(work?.startDate),
            enddate: parseDateString(work?.endDate),
            role: work?.position || "",
            work: userRef, // Storing as a DocumentReference
            createdAt: Timestamp.now(),
          };

          await setDoc(doc(workerCollectionRef), workData);
        }
      }

      // Save Projects Subcollection
      if (Array.isArray(data?.projects)) {
        const projectsCollectionRef = collection(db, "projects");

        for (const project of data.projects) {
          const projectData = {
            projectname: project?.projectName || "",
           startdate: parseDateString(project?.duration?.split('-')?.[0]),
           startdate: parseDateString(project?.duration?.split('-')?.[1]),
           url: project?.liveLink || '',
            description: project?.description || "",
            userproject: userRef, // Storing as a DocumentReference
            createdAt: Timestamp.now(),
          };

          await setDoc(doc(projectsCollectionRef), projectData);
          
        }
      }

      // Save Services Subcollection
      if (Array.isArray(data?.services)) {
        const servicesCollectionRef = collection(db, "services");

        for (const service of data.services) {
          const serviceData = {
            serviceName: service?.serviceName || "",
            serviceDescription: service?.serviceDescription || "",
            servicePrice: service?.servicePrice || "",
            userRef, // Reference to the user's document
            createdAt: Timestamp.now(),
          };

          await setDoc(doc(servicesCollectionRef), serviceData);
        }
      }

      // Notify success and navigate
      toast.success("Profile and services data saved successfully!");
      navigate("/homescreen");
    } catch (err) {
      setError(err.message);
      toast.error(`Error saving profile data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { saveProfileData, loading, error };
};

export default useSaveProfileData;
