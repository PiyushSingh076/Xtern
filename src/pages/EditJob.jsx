import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { db } from "../firebaseConfig.js";
import { addDoc, collection, getDocs } from "firebase/firestore";

import Stepper from "../components/Stepper.jsx";
import useImageUpload from "../hooks/Auth/useImageUpload.js"; // Custom hook for image upload
import { getAuth } from "firebase/auth";
import { useFetchJob } from "../hooks/Jobs/useFetchJob.jsx";

const EditJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  console.log(jobId);

  const job = useFetchJob(jobId);

  useEffect(() => {
    console.log(job);
  }, [job]);

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
              <p>Edit Job</p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>
      {job.loading ? (
        <div className="size-full h-[80vh] flex items-center justify-center">
          <div className="spinner-border spinner-border-sm"></div>
        </div>
      ) : (
        job.jobData && <><Stepper data={{...job.jobData, jobId: jobId}} /></>
      )}
    </div>
  );
};

export default EditJob;
