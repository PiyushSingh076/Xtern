import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaTasks,
  FaRegListAlt,
  FaGlobe,
} from "react-icons/fa"; // React Icons
import { FiXCircle } from "react-icons/fi";
import { db } from "./../firebaseConfig"; // Your firebase configuration file
import { addDoc, collection } from "firebase/firestore";
import Loading from "../components/Loading";
import ProjectLevelSelection from "../components/ProjectLevelSelection";
import useImageUpload from "../hooks/Auth/useImageUpload";

const CreateProject = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState(""); // For capturing typed skills
  const [projectLevel, setProjectLevel] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [projectDomain, setProjectDomain] = useState(""); // New field for project domain
  const [errors, setErrors] = useState({});
  const {
    projectImage,
    imagePreviewUrl,
    error,
    loading,
    handleImageUpload,
    clearImage,
    uploadImage,
  } = useImageUpload(); // Use the custom hook
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  // Handle skills input, adding skill on 'Enter' key
  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      setSkills([...skills, skillInput.trim()]);
      setSkillInput(""); // Reset input
    }
  };

  // Remove skill from list
  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Validate all required fields
  const validateForm = () => {
    const newErrors = {};
    if (!projectTitle.trim())
      newErrors.projectTitle = "Project title is required.";
    if (!skills.length) newErrors.skills = "Please add at least one skill.";
    if (!projectLevel) newErrors.projectLevel = "Project level is required.";
    if (!projectDuration.trim())
      newErrors.projectDuration = "Project duration is required.";
    if (!dueDate.trim()) newErrors.dueDate = "Due date is required.";
    if (!projectDetails.trim())
      newErrors.projectDetails = "Project details are required.";
    if (!projectImage) newErrors.projectImage = "Project image is required.";
    if (!projectDomain)
      newErrors.projectDomain = "Please select a project domain."; // New domain validation
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const imageURL = await uploadImage();
    if (!imageURL) {
      setSubmitLoading(false);
      return;
    }

    try {
      // Save the project details along with the image URL and skills to Firestore
      await addDoc(collection(db, "RealWorldTask"), {
        title: projectTitle,
        skills,
        level: projectLevel,
        duration: projectDuration,
        dueDate,
        details: projectDetails,
        domain: projectDomain, // Include domain in form data
        imageUrl: imageURL,
      });

      setSubmitLoading(false);
      navigate("/all-projects"); // Redirect to project list after creation
    } catch (err) {
      console.error("Error adding document: ", err);
      setSubmitLoading(false);
    }
  };

  if (loading || submitLoading) {
    return <Loading />;
  }

  return (
    <>
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
              <p>Create New Project</p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      <section id="create-project-section" className="mt-8 mb-8 fade-in">
        <div className="container">
          <div className="sign-up-login-form mt-24 zoom-in">
            <form onSubmit={handleSubmit}>
              {/* Image Upload Section at Top with Preview */}
              <div
                className={`mb-4 ${errors.projectImage ? "is-invalid" : ""}`}
              >
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
                {errors.projectImage && (
                  <p className="text-danger">{errors.projectImage}</p>
                )}
                <input
                  type="file"
                  id="projectImage"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>

              {/* Project Title Input */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaUser />
                </span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Project Title"
                  className={`sign-in-custom-input ${
                    errors.projectTitle ? "is-invalid" : ""
                  }`}
                  required
                />
                {errors.projectTitle && (
                  <p className="text-danger">{errors.projectTitle}</p>
                )}
              </div>

              {/* Project Domain Input */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaGlobe />
                </span>
                <select
                  value={projectDomain}
                  onChange={(e) => setProjectDomain(e.target.value)}
                  className={`sign-in-custom-input ${
                    errors.projectDomain ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Select Project Domain</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Web Dev">Web Dev</option>
                  <option value="UI/UX">UI/UX</option>
                </select>
                {errors.projectDomain && (
                  <p className="text-danger">{errors.projectDomain}</p>
                )}
              </div>

              {/* Skills Input */}
              <div className="form-details-sign-in ">
                <span className="text-primary">
                  <FaClipboardList />
                </span>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="Skills (e.g., React, UI/UX, Firebase)"
                  className={`sign-in-custom-input ${
                    errors.skills ? "is-invalid" : ""
                  }`}
                />
              </div>
              {errors.skills && <p className="text-danger">{errors.skills}</p>}

              {/* Display Skills as Badges */}
              <div className="d-flex gap-2 item-center text mt-2 mb-2">
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

              {/* Project Duration Input */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaRegListAlt />
                </span>
                <input
                  type="text"
                  value={projectDuration}
                  onChange={(e) => setProjectDuration(e.target.value)}
                  placeholder="Project Duration (e.g., 4 weeks)"
                  className={`sign-in-custom-input ${
                    errors.projectDuration ? "is-invalid" : ""
                  }`}
                  required
                />
                {errors.projectDuration && (
                  <p className="text-danger">{errors.projectDuration}</p>
                )}
              </div>

              {/* Due Date Input */}
              <div className="form-details-sign-in mb-2">
                <span className="text-primary">
                  <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`sign-in-custom-input ${
                    errors.dueDate ? "is-invalid" : ""
                  }`}
                  required
                />
                {errors.dueDate && (
                  <p className="text-danger">{errors.dueDate}</p>
                )}
              </div>
              {/* Project Level Input */}
              <ProjectLevelSelection
                projectLevel={projectLevel}
                setProjectLevel={setProjectLevel}
              />
              {errors.projectLevel && (
                <p className="text-danger">{errors.projectLevel}</p>
              )}

              {/* Project Details Input */}
              <div
                className="form-details-sign-in"
                style={{ marginBottom: "100px" }}
              >
                <span className="text-primary">
                  <FaClipboardList />
                </span>
                <textarea
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Project Details"
                  className={`sign-in-custom-input ${
                    errors.projectDetails ? "is-invalid" : ""
                  }`}
                  rows="5"
                  required
                />
                {errors.projectDetails && (
                  <p className="text-danger">{errors.projectDetails}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="buy-now-description mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-3 w-100"
                  disabled={loading || submitLoading}
                >
                  {submitLoading ? "Submitting..." : "Post Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateProject;
