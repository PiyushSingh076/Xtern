import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";

const useUserRole = () => {
  const [selectedRole, setSelectedRole] = useState("Intern");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.id);
  };

  const saveRole = async () => {
    if (!userId) return;

    const typeUser = selectedRole;
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { typeUser });
      toast.success("Role saved successfully!");

      // Redirect after saving the role
      if (selectedRole === "Intern") {
        navigate("/select-skills");
      } else {
        // navigate("/homescreen");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role. Please try again.");
    }
  };

  return { selectedRole, handleRoleChange, saveRole };
};

export default useUserRole;
