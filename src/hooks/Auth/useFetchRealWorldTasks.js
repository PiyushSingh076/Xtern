import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig"; // Adjust path if needed
import { collection, getDocs, query } from "firebase/firestore";

const useFetchRealWorldTasks = () => {
  const [realWorldTasks, setRealWorldTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealWorldTasks = async () => {
      try {
        const q = query(collection(db, "RealWorldTask"));
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRealWorldTasks(tasksData);
      } catch (error) {
        console.error("Error fetching RealWorldTasks:", error);
        setError("Failed to fetch real world tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchRealWorldTasks();
  }, []);

  return { realWorldTasks, loading, error };
};

export default useFetchRealWorldTasks;
