import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

import Stepper from "../components/Stepper.jsx";
import useImageUpload from "../hooks/Auth/useImageUpload"; // Custom hook for image upload
import { getAuth } from "firebase/auth";
import Layout from "../components/SEO/Layout.jsx";

const CreateJob = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   async function test(){
  //     const docs = await getDocs(collection(db, "jobPosting"));
  //     docs.forEach((doc) => {
  //       console.log(doc.data());
  //     });
  //   }

  //   test();
  // }, [])
  
  return (
    <>
    <Layout
    title={"CreateJob"}
        description={"Create and Publish Job Postings to Hire Talent"}
        keywords={"Create Job Posting, Hire Employees, Recruitment, Job Listings, Employer"}/>
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
    </>
  );
};

export default CreateJob;
