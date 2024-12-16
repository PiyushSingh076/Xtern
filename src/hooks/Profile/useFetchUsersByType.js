import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Custom Hook
const useFetchUsersByType = (type) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(); // Initialize Firestore
      const usersCollectionRef = collection(db, "users");

      try {
        setLoading(true);
        const q = query(usersCollectionRef, where("type", "==", type)); // Filter by type
        const querySnapshot = await getDocs(q);

        const userList = [];
        querySnapshot.forEach((doc) => {
          userList.push({ id: doc.id, ...doc.data() }); // Collect user data
        });

        setUsers(userList);
        console.log(userList, "sdfsdfsdfsdf");
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (type) fetchUsers();
  }, [type]); // Re-run if type changes

  return { users, loading, error };
};

export default useFetchUsersByType;
