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
import Jobs from "./Jobs";
import Layout from "../../components/SEO/Layout";

export default function MobHomeScreen() {
  const navigate = useNavigate();
  const { userData } = useFetchUserData();

  // if (userData) {
  //   navigate("/homescreen");
  // }

  return (
    <>
    <Layout title={"Xtern-Hire or become an expert"}
        description={"Connect with experts in every field to navigate your path to a dream career"}
        keywords={"Xtern,career,guide"}/>
    <div className="MobHomeScreen-container">
      {userData && <Dashboard />}
      {!userData && <LandingPage />}
      {!userData && <Categories />}
      {!userData && <Jobs />}
      {!userData && <Xpert />}
      {!userData && <Xtern />}
      {!userData && <TrustedComp />}
      {!userData && <ImageBtn />}
      {!userData && <Footer />}
    </div>
    </>
  );
}
