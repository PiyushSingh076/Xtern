import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(0);
  const [phoneVerified, setPhoneVerified] = useState(null);
  const [loading, setLoading] = useState(null);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Phone verify", phoneVerified);
  }, [phoneVerified]);

  function verifyPhone() {
    sessionStorage.setItem("phone-verified", true);
    setPhoneVerified(true);
  }

  function checkPhoneVerified() {
    if (sessionStorage.getItem("phone-verified") === "true") {
      return true;
    } else {
      const user = auth.currentUser.uid;
      console.log("Auth Test", user);
      return true;
    }
  }

  useEffect(() => {
    async function checkIfVerified() {
      const verified = sessionStorage.getItem("phone-verified");
      if (verified === "true") {
        console.log("Phone Status", auth.currentUser);
        const user = auth.currentUser.uid;
        const docRef = doc(db, "users", user);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        console.log("Phone Status",userData);
        setUser(userData);
        if (userData.isPhoneVerified === true) {
          setPhoneVerified(true);
        } else {
          setPhoneVerified(false);
        }
      }
      else{
        setPhoneVerified(false)
      }
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkIfVerified();
      }
    });
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        refresh,
        setRefresh,
        phoneVerified,
        loading,
        verifyPhone,
        user,
        checkPhoneVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  function refreshUser() {
    authContext.setRefresh((prev) => prev + 1);
  }

  return {
    refreshUser,
    refresh: authContext.refresh,
    phoneVerified: authContext.phoneVerified,
    loading: authContext.loading,
    verifyPhone: authContext.verifyPhone,
    userData: authContext.user,
    checkPhoneVerified: authContext.checkPhoneVerified,
  };
};
