import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const useUserProfileData = (uid) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user details from `users` collection
        const userRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          throw new Error("User not found");
        }

        const userData = userSnapshot.data();

        // Fetch work experience from `worker` collection by querying for the user reference
        const workQuery = query(
          collection(db, "worker"),
          where("work", "==", userRef) // Using userRef as the reference to match
        );
        const workSnapshot = await getDocs(workQuery);
        const workExperience = workSnapshot.docs.map((doc) => doc.data());

        // Fetch education details from `education` collection by querying for the user reference
        const educationQuery = query(
          collection(db, "education"),
          where("usereducation", "==", userRef) // Using userRef as the reference to match
        );
        const educationSnapshot = await getDocs(educationQuery);
        const educationDetails = educationSnapshot.docs.map((doc) =>
          doc.data()
        );

        // Fetch project details from `projects` collection by querying for the user reference
        const projectQuery = query(
          collection(db, "projects"),
          where("userproject", "==", userRef) // Using userRef as the reference to match
        );
        const projectSnapshot = await getDocs(projectQuery);
        const projectDetails = projectSnapshot.docs.map((doc) => doc.data());

        // Fetch service details from `services` collection by querying for the user reference
        const servicesQuery = query(
          collection(db, "services"),
          where("userRef", "==", userRef) // Use the `userRef` document reference
        );
        const servicesSnapshot = await getDocs(servicesQuery);
        const serviceDetails = servicesSnapshot.docs.map((doc) => doc.data());
        // Combine all data into a single object
        const combinedData = {
          ...userData,
          workExperience,
          educationDetails,
          projectDetails,
          serviceDetails,
        };

        console.table("Combined Data:", combinedData); // Final combined data
        setUserData(combinedData);
      } catch (err) {
        console.log("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  return { userData, loading, error };
};

export default useUserProfileData;
