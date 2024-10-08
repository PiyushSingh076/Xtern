import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user);
      } else {
        console.log("No user is authenticated.");
      }
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);
  console.log(isAuthenticated, "lllllll");

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
