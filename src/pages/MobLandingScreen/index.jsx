import React from "react";
import "./MobHomeScreen.css";
import LandingPage from "./LandingPage";
import Categories from "./Categories";
import Xpert from "./Xpert";
import Xtern from "./Xtern";
import TrustedComp from "./TrustedComp";
import ImageBtn from "./ImageBtn";
import Blog from "./Blog";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import Footer from "../Desktop/Footer/Footer";

export default function MobHomeScreen() {
  const navigate = useNavigate();
  const { userData } = useFetchUserData();

  // if (userData) {
  //   navigate("/homescreen");
  // }

  return (
    <div className="MobHomeScreen-container">
      {userData && <Dashboard />}
      {!userData && <LandingPage />}
      {!userData && <Categories />}
      {!userData && <Xpert />}
      {!userData && <Xtern />}
      {!userData && <TrustedComp />}
      {!userData && <ImageBtn />}
      {!userData && <Footer />}
    </div>
  );
}
