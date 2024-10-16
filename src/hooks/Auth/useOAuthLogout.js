import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../../firebaseConfig";

const useOAuthLogout = () => {
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true); // Set loading state to true during logout
    try {
      await signOut(auth); // Sign out the user from Firebase authentication

      // Clear any user-related data from storage
      sessionStorage.removeItem("uid"); // Remove specific item
      // If you store other user data, consider clearing it here

      toast.success("Successfully logged out", { position: "bottom-left" });
      navigate("/homescreen"); // Redirect the user to the login page
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed", { position: "bottom-left" });
    } finally {
      setLoading(false); // Reset the loading state after logout
    }
  };

  return { handleLogout, loading };
};

export default useOAuthLogout;
