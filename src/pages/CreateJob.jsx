import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

import Stepper from "../components/Stepper.jsx";
import useImageUpload from "../hooks/Auth/useImageUpload"; // Custom hook for image upload
import { getAuth } from "firebase/auth";

const CreateJob = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn" onClick={() => navigate(-1)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" />
              </svg>
            </div>
            <div className="top-navbar-title">
              <p>Job Posting</p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>
       <Stepper/>
    </div>
  );
};

export default CreateJob;
