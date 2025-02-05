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
  const [loaded, setLoaded] = useState(false)

  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  function verifyPhone() {
    localStorage.setItem("phone-verified", true);
    setPhoneVerified(true);
  }

  useEffect(() => {
    async function checkPhoneVerified(uid) {
      setLoaded(false)
      const userSnapshot = await getDoc(doc(db, "users", uid));
      const userData = userSnapshot.data();
      if(userSnapshot.exists()){
        if(userData.isPhoneVerified === true){
          setPhoneVerified(true);
        }
        else{
          setPhoneVerified(false)
        }
      }
      setLoaded(true)
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkPhoneVerified(user.uid)
      }
    })
  }, [refresh]);

  // useEffect(() => {
  //   async function checkIfVerified() {
  //     const verified = localStorage.getItem("phone-verified");
  //     if (verified === "true") {
  //       console.log("Phone Status", auth.currentUser);
  //       const user = auth.currentUser.uid;
  //       const docRef = doc(db, "users", user);
  //       const docSnap = await getDoc(docRef);
  //       const userData = docSnap.data();

  //       console.log("Phone Status",userData);
  //       setUser(userData);
  //       if (userData.isPhoneVerified === true) {
  //         setPhoneVerified(true);
  //       } else {
  //         setPhoneVerified(false);
  //       }
  //     }
  //     else{
  //       setPhoneVerified(false)
  //     }
  //   }
  //   onAuthStateChanged(auth, (user) => {

  //     if (user) {
  //       checkIfVerified();
  //     }
  //   });
  // }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        refresh,
        setRefresh,
        phoneVerified,
        loading,
        verifyPhone,
        user,
        loaded
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
    loaded: authContext.loaded,
  };
};
