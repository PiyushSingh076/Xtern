// Imports
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import useUserProfileData from "../../hooks/Profile/useUserProfileData";

import { useSelector } from "react-redux";

import SkillSet from "./SkillSet";
import Acadamic from "./Acadamic";
import MainProfile from "./MainProfile";
import VentureOptions from "./VentureOptions";

const SingleMentor = () => {
  // State declarations
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const navigate = useNavigate();
  const role = useSelector((state) => state.role);

  const {uid} = useParams()

  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);
  console.log("Mob profileData", profileData, profileError);

  // Slider settings for the skills carousel

  // Custom hooks and Redux state

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page in the history stack
  };

  return (
    <>
      {/* Header section */}
      <header id="top-header">
        <div className="container">
          <div className="top-header-full">
            {/* Back button */}
            <div className="back-btn">
              <svg
                onClick={handleBackClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_330_7385"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="black" />
                </mask>
                <g mask="url(#mask0_330_7385)">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            {/* Header title */}
            <div className="header-title">
              <p>Profile</p>
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      {/* Main content section */}
      <section id="single-mentor-sec">
        <div className="container">
          <h1 className="d-none">Hidden</h1>
          <h2 className="d-none">Mentor</h2>
          <div className="single-mentor-sec-wrap mt-32">
            {/* Profile information */}
            <MainProfile ProfileData = {profileData}/>
            <div className="navbar-boder mt-24"></div>

            {profileData.typeUser === "venture" && <VentureOptions />}

            {profileData.typeUser === "Intern" && <SkillSet skill={profileData.skillSet} />}

            {/* Tabs section */}
            {profileData.typeUser === "Intern" && <Acadamic />}
          </div>
        </div>
      </section>
      {/* End of main content section */}
    </>
  );
};

export default SingleMentor;
