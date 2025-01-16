import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { removeAuth, removeRole } from "../../Store/Slice/UserInfo";
import { clearVentureInfo } from "../../Store/Slice/VentureInfo";
import { resetInternInfo } from "../../Store/Slice/InternInfo";
import { useAuth } from "./useAuth";

const useOAuthLogout = () => {
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {refreshUser} = useAuth()

  const handleLogout = async () => {
    setLoading(true); // Set loading state to true during logout
    try {
      await signOut(auth); // Sign out the user from Firebase authentication

      // Clear any user-related data from storage
      sessionStorage.removeItem("uid");
      localStorage.removeItem("phone-verified") // Remove specific item
      // If you store other user data, consider clearing it here

      toast.success("Successfully logged out", { position: "bottom-left" });
      navigate("/");
      dispatch(removeAuth());
      dispatch(removeRole());
      dispatch(clearVentureInfo());
      dispatch(resetInternInfo());
      
      // Redirect the user to the login page
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed", { position: "bottom-left" });
    } finally {
      setLoading(false);
      refreshUser() // Reset the loading state after logout
    }
  };

  return { handleLogout, loading };
};

export default useOAuthLogout;
