import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaGlobe,
  FaBriefcase,
  FaImage,
  FaTasks,
  FaUsers,
  FaTimes,
  FaRegListAlt,
} from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";
import { db } from "./../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import Loading from "../components/Loading";
import useImageUpload from "../hooks/Auth/useImageUpload"; // Custom hook for image upload
import { getAuth } from "firebase/auth";

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [assessmentDetail, setAssessmentDetail] = useState("");
  const [assessmentDuration, setAssessmentDuration] = useState("");
  const [duration, setDuration] = useState("");
  const {
    projectImage,
    imagePreviewUrl,
    error,
    loading,
    handleImageUpload,
    clearImage,
    uploadImage,
  } = useImageUpload();
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    return (
      jobTitle &&
      companyName &&
      description &&
      location &&
      skills.length &&
      experienceLevel &&
      assessmentDetail &&
      assessmentDuration &&
      duration &&
      projectImage
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitLoading(true);
    const imageURL = await uploadImage();
    if (!imageURL) {
      setSubmitLoading(false);
      return;
    }

    try {
      // Get the current user using Firebase Authentication
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Adding job to Firestore with userref
      await addDoc(collection(db, "jobPosting"), {
        title: jobTitle,
        companyName,
        description,
        location,
        skills,
        experienceLevel,
        assessmentDetail,
        assessmentDuration,
        duration,
        image: imageURL,
        createdAt: new Date(),
        userref: `/users/${currentUser.uid}`, // Storing the reference to the user who created the job
      });

      setSubmitLoading(false);
      navigate("/homescreen");
    } catch (err) {
      console.error("Error adding job: ", err);
      setSubmitLoading(false);
    }
  };

  return (
    <>
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

      <section id="create-job-section" className="mt-8 mb-8 fade-in">
        <div className="container">
          <div className="sign-up-login-form mt-24 zoom-in">
            <form onSubmit={handleSubmit}>
              <div className={`mb-4 ${error ? "is-invalid" : ""}`}>
                <label
                  htmlFor="projectImage"
                  className="drag-drop-label"
                  style={{
                    border: "2px dashed black",
                    borderRadius: "10px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {imagePreviewUrl ? (
                    <div style={{ position: "relative", textAlign: "center" }}>
                      <img
                        src={imagePreviewUrl}
                        alt="Project Preview"
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          borderRadius: "10px",
                        }}
                      />
                      {/* Clear Icon */}
                      <div
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "2px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          borderRadius: "50%",
                          padding: "5px",
                        }}
                        onClick={clearImage}
                      >
                        <FiXCircle
                          size={32}
                          color="white"
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_2_203153)">
                          <path
                            d="M37.5 20H37.52"
                            stroke="#7F7F7F"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M31.25 52.5H15C13.0109 52.5 11.1032 51.7098 9.6967 50.3033C8.29018 48.8968 7.5 46.9891 7.5 45V15C7.5 13.0109 8.29018 11.1032 9.6967 9.6967C11.1032 8.29018 13.0109 7.5 15 7.5H45C46.9891 7.5 48.8968 8.29018 50.3033 9.6967C51.7098 11.1032 52.5 13.0109 52.5 15V31.25"
                            stroke="#7F7F7F"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.5 40.0005L20 27.5005C22.32 25.268 25.18 25.268 27.5 27.5005L37.5 37.5005"
                            stroke="#7F7F7F"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M35 35.0001L37.5 32.5001C39.175 30.8901 41.125 30.4401 42.955 31.1501"
                            stroke="#7F7F7F"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M40 47.5H55"
                            stroke="#7F7F7F"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M47.5 40V55"
                            stroke="#7F7F7F"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2_203153">
                            <rect width="60" height="60" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <p style={{ color: "#7f7f7f", fontSize: "14px" }}>
                        Drag & Drop or Click to Upload Image
                      </p>
                    </div>
                  )}
                </label>
                {error && <p className="text-danger">{error}</p>}
                <input
                  type="file"
                  id="projectImage"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
              {/* Job Title */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaBriefcase />
                </span>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title"
                  className="sign-in-custom-input"
                  required
                />
              </div>

              {/* Company Name */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaUsers />
                </span>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="sign-in-custom-input"
                  required
                />
              </div>

              {/* Job Description */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaClipboardList />
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Job Description"
                  className="sign-in-custom-input"
                  rows="4"
                  required
                />
              </div>

              {/* Location */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaGlobe />
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Job Location"
                  className="sign-in-custom-input"
                  required
                />
              </div>

              {/* Skills Input */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaTasks />
                </span>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="Skills (e.g., PHP, Laravel, MySQL)"
                  className="sign-in-custom-input"
                />
              </div>

              {/* Display Skills as Badges */}
              <div className="d-flex gap-2 item-center text mt-1 mb-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-primary mr-2 p-2 text-capitalize"
                    style={{ backgroundColor: "#007bff", color: "#fff" }}
                  >
                    {skill}
                    <FaTimes
                      style={{ marginLeft: "8px", cursor: "pointer" }}
                      onClick={() => removeSkill(index)}
                    />
                  </span>
                ))}
              </div>

              {/* Experience Level */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaTasks />
                </span>
                <input
                  type="text"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="Experience Level (e.g., Beginner, Intermediate, Advanced)"
                  className="sign-in-custom-input"
                  required
                />
              </div>

              {/* Assessment Detail */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaClipboardList />
                </span>
                <textarea
                  value={assessmentDetail}
                  onChange={(e) => setAssessmentDetail(e.target.value)}
                  placeholder="Assessment Detail"
                  className="sign-in-custom-input"
                  rows="4"
                  required
                />
              </div>

              {/* Assessment Duration */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaCalendarAlt />
                </span>
                <input
                  type="text"
                  value={assessmentDuration}
                  onChange={(e) => setAssessmentDuration(e.target.value)}
                  placeholder="Assessment Duration (e.g., 2 days)"
                  className="sign-in-custom-input"
                  required
                />
              </div>

              {/* Job Duration */}
              <div
                className="form-details-sign-in "
                style={{ marginBottom: "100px" }}
              >
                <span className="text-primary">
                  <FaRegListAlt />
                </span>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Job Duration (e.g., 6 months)"
                  className="sign-in-custom-input"
                  required
                />
              </div>

              {/* Image Upload */}

              {/* Submit Button */}
              <div className="buy-now-description mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-3 w-100"
                  disabled={loading || submitLoading}
                >
                  {submitLoading ? "Submitting..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateJob;
