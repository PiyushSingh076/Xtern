import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Authentication removed
    setIsAuthenticated(true);
  }, []);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return children;
};

export default ProtectedRoute;
