import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import Loading from "../components/Loading";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/Auth/useAuth";
import toast from "react-hot-toast";
import useFetchUserData from "../hooks/Auth/useFetchUserData";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const { phoneVerified, loading, refreshUser, loaded: authLoaded } = useAuth();
  
  const { userData, loading: userLoading } = useFetchUserData();

  
  useEffect(() => {
    if(authLoaded === true){
      console.log("Latest Phone", phoneVerified)
    }
  }, [authLoaded])
 

  // useEffect(() => {
  //   console.log("Phone Latest", phoneVerified)
  //   if(phoneVerified !== null){
  //     if(!phoneVerified){
  //       navigate("/verifyscreen");
  //     }
  //   }
  // }, [phoneVerified])

  // useEffect(() => {
  //   if (userData) {
  //     if (allowedRoles && !allowedRoles.includes(userData.type)) {
  //       navigate("/homescreen");
  //       toast.error("Unauthorized access");
  //     }
  //   }
  // }, [userData]);

  return <>{children}</>;
};

export default ProtectedRoute;
