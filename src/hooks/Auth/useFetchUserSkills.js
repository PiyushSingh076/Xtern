import { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const useFetchUserSkills = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserSkills(userData.skills || []);
        } else {
          setUserSkills([]);
        }
      } catch (error) {
        console.error("Error fetching user skills:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSkills();
  }, [auth.currentUser]);

  return { userSkills, loading, error };
};

export default useFetchUserSkills;
