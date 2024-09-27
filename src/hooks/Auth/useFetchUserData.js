import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const useFetchUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            toast.error("No user profile found.");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to fetch user data.");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("User is not signed in.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};

export default useFetchUserData;
