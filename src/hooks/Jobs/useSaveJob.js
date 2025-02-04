import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig.js"; // Adjust the path if necessary

const useSaveJob = () => {
  // Function to save job data
  const saveJob = async ({
    jobTitle,
    companyName,
    description,
    location,
    skills,
    experienceLevel,
    assessmentDetail,
    assessmentDuration,
    duration,
    imageURL,
    file
  }) => {
    try {
      // Validate if user is authenticate
      // Add job data to Firestore and get the reference

      const currentUser = await auth.currentUser;
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      async function addJobToEntrepreneur(jobId) {
        await setDoc(doc(db, "users", currentUser.uid), {
          jobPostings: arrayUnion({
            title: jobTitle,
            companyName: companyName,
            description: description,
            image: imageURL,
            jobId: jobId,
            skills: skills,
            file: file
          }),
        }, {merge: true});

        const test = await getDoc(doc(db, "users", currentUser.uid));
      }

      const docRef = await addDoc(collection(db, "jobPosting"), {
        title: jobTitle,
        companyName,
        description,
        location,
        skills,
        experienceLevel,
        assessmentDetail,
        assessmentDuration,
        duration,
        image: imageURL,
        createdAt: new Date(),
        createdBy: currentUser.uid, // User reference
        applicants: [],
        file: file, // Empty applicants array initially
      });

      // Fetch the newly created job by its ID
      const docSnapshot = await getDoc(doc(db, "jobPosting", docRef.id));

      if (docSnapshot.exists()) {
        addJobToEntrepreneur(docRef.id);
      } else {
        console.error("No such document!");
      }

      return docSnapshot.id; // Success response
    } catch (error) {
      console.error("Error adding job: ", error);
      return null; // Failure response
    }
  };

  const updateJob = async (jobId, {
    jobTitle,
    companyName,
    description,
    location,
    skills,
    experienceLevel,
    assessmentDetail,
    assessmentDuration,
    duration,
    file,
    imageURL
  }) => {
    try {
      // Validate if user is authenticate
      // Add job data to Firestore and get the reference


      await setDoc(doc(db, "jobPosting", jobId), {
        title: jobTitle,
        companyName,
        description,
        location,
        skills,
        experienceLevel,
        assessmentDetail,
        assessmentDuration,
        duration,
        image: imageURL,
        file
        // User reference
      }, { merge: true });

      // Fetch the newly created job by its ID


      return true; // Success response
    } catch (error) {
      console.error("Error adding job: ", error);
      return false; // Failure response
    }
  };

  return { saveJob, updateJob }; // Return the function
};

export default useSaveJob;