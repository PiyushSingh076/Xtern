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

  // Helper function to parse dates
  const parseDateString = (dateStr) => {
    if (!dateStr) return null; // Return null if no date string is provided

    if (dateStr.toLowerCase() === "present") return "Present"; // Handle special "present" case

    const [monthStr, year] = dateStr.split(" ");
    if (!monthStr || !year) return null; // Return null if the date string format is invalid

    // Attempt to create a valid Date object
    const month = new Date(`${monthStr} 1, ${year}`).getMonth();
    const parsedDate = new Date(year, month, 1); // Create a date with the given month and year

    // Check if parsedDate is a valid Date object
    if (isNaN(parsedDate)) return null; // Return null if it's an invalid date

    return Timestamp.fromDate(parsedDate); // Return the Timestamp object if valid
  };

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
        experience: data?.experience || "",
        type: data?.type || "",
        state: data?.state || "",
        city: data?.city || "",
        consultingPrice: data?.consultingPrice || "",
        consultingDuration: data?.consultingDuration || "",
        consultingDurationType: data?.consultingDurationType || "",
        updatedAt: Timestamp.now(),
      };

      await setDoc(userRef, userData, { merge: true });

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

        // Normalize the input skills array to ensure each skill object has the correct structure
        const normalizedSkills = data.skills
          .map((skillObj) => {
            // Ensure skillObj has both 'skill' and 'skill-rating' properties
            if (
              skillObj?.skill &&
              typeof skillObj.skill === "string" &&
              skillObj["skill-rating"] !== undefined
            ) {
              return {
                skill: skillObj.skill.trim(), // Trim the skill name
                skillRating: skillObj["skill-rating"], // Updated to "skillRating"
              };
            }
            return null; // Ignore invalid or incomplete skill objects
          })
          .filter((skill) => skill !== null); // Remove any null values from the array

        // Merge existing skills with the new ones, ensuring no duplicates and valid data
        const updatedSkills = Array.from(
          new Set([
            ...existingSkills.map((existingSkill) => existingSkill.skill),
            ...normalizedSkills.map((skill) => skill.skill),
          ])
        )
          .map((skill) => {
            // Find the matching skill object in normalizedSkills to retrieve full data (including skillRating)
            return normalizedSkills.find(
              (skillObj) => skillObj.skill === skill
            );
          })
          .filter((skill) => skill !== undefined); // Ensure no undefined values are included

        // If there are still undefined values after filtering, log them for debugging
        if (updatedSkills.some((skill) => skill === undefined)) {
          console.error(
            "Found undefined value in updated skills:",
            updatedSkills
          );
        } else {
          await updateDoc(userRef, {
            skillSet: updatedSkills,
          });
        }
      }

      // Save Intern Role Data
      if (
        data?.type?.toLowerCase() === "intern" &&
        Array.isArray(data?.services)
      ) {
        const internData = data.services.map((service) => ({
          serviceName: service?.serviceName || "",
          serviceDescription: service?.serviceDescription || "",
          startDate: parseDateString(service?.startDate), // Parse start date
          endDate: parseDateString(service?.endDate), // Parse end date
          availability: service?.availability || "full time",
          hoursPerDay:
            service?.availability === "part time"
              ? service?.hoursPerDay || ""
              : null,
        }));

        // Save Intern-specific data in the "users" collection
        await updateDoc(userRef, { internDetails: internData });
      }

      // Save Education Subcollection
      if (Array.isArray(data?.education)) {
        const educationCollectionRef = collection(db, "education");

        for (const edu of data.education) {
          const educationData = {
            degree: edu?.degree || "",
            stream: edu?.stream || "",
            college: edu?.college || "",
            startDate: parseDateString(edu?.startDate),
            endDate: edu?.endDate ? parseDateString(edu?.endDate) : null, // Corrected endDate handling
            usereducation: userRef, // Storing as a DocumentReference to user document
            cpga: edu?.cpga || "",
            createdAt: Timestamp.now(),
          };

          await setDoc(doc(educationCollectionRef), educationData);
        }
      }

      // Save Work Experience Subcollection
      if (Array.isArray(data?.work)) {
        const workCollectionRef = collection(db, "worker");

        for (const work of data.work) {
          const workData = {
            companyName: work?.company || "",
            description: work?.description || "",
            startDate: parseDateString(work?.startDate), // Parse start date
            endDate: parseDateString(work?.endDate), // Parse end date
            role: work?.position || "",
            work: userRef, // Storing as a DocumentReference to user document
            createdAt: Timestamp.now(),
          };

          await setDoc(doc(workCollectionRef), workData);
        }
      }

      // Save Projects Subcollection
      if (Array.isArray(data?.projects)) {
        const projectsCollectionRef = collection(db, "projects");

        for (const project of data.projects) {
          const projectData = {
            projectName: project?.projectName || "",
            startDate: parseDateString(project?.duration?.split("-")?.[0]), // Parse start date
            endDate: parseDateString(project?.duration?.split("-")?.[1]), // Parse end date
            liveDemo: project?.liveLink || "",
            description: project?.description || "",
            userproject: userRef, // Storing as a DocumentReference to user document
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
            serviceDuration: service?.duration || "",
            serviceDurationType: service?.durationType || "",
            userRef: userRef, // Reference to the user's document
            createdAt: Timestamp.now(),
          };

          await setDoc(doc(servicesCollectionRef), serviceData);
        }
      }

      // Notify success and navigate
      toast.success("data saved successfully!");
      navigate("/homescreen");
    } catch (err) {
      setError(err.message);
      console.error(err);
      toast.error(`Error saving profile data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { saveProfileData, loading, error };
};

export default useSaveProfileData;
