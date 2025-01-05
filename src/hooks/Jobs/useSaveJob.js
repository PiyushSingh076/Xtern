import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
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
  }) => {
    try {
      // Validate if user is authenticate
      // Add job data to Firestore and get the reference

      const currentUser = await auth.currentUser;
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      async function addJobToEntrepreneur(jobId) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          jobPostings: arrayUnion({
            title: jobTitle,
            companyName: companyName,
            description: description,
            image: imageURL,
            jobId: jobId,
            skills: skills
          }),
        });

        const test = await getDoc(doc(db, "users", currentUser.uid));
        console.log(test.data());
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
        applicants: [], // Empty applicants array initially
      });

      // Fetch the newly created job by its ID
      const docSnapshot = await getDoc(doc(db, "jobPosting", docRef.id));

      if (docSnapshot.exists()) {
        console.log("Job added successfully!");
        console.log("Created Job:", {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        });
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

  return { saveJob }; // Return the function
};

export default useSaveJob;
