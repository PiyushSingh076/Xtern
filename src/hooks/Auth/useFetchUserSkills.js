import { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";

const useFetchUserSkills = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const user = auth?.currentUser;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserSkills(userData.skillSet || []);
          console.log(userData, "....");
        }
      } catch (error) {
        console.error("Error fetching user skills:", error);
      }
    };

    if (auth?.currentUser) {
      fetchUserSkills();
    }
  }, [auth?.currentUser]);

  return { userSkills, loading, error };
};

export default useFetchUserSkills;
