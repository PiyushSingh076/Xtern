import { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const useRoleSelection = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectRole = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        role,
        registrationStatus: "role_selected",
      });
      toast.success("Role selected successfully");
    } catch (err) {
      setError("Failed to select role. Please try again.");
      console.error("Error selecting role:", err);
    } finally {
      setLoading(false);
    }
  };

  return { selectRole, loading, error };
};

export default useRoleSelection;
