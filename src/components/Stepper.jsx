import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaGlobe,
  FaBriefcase,
  FaTasks,
  FaUsers,
  FaTimes,
  FaRegListAlt,
  FaCloudUploadAlt,
  FaArrowRight,
  FaEye,
  FaFileImage,
  FaFilePdf,
  FaFileAlt,
  FaFileWord,
  FaFileExcel,
} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiXCircle } from "react-icons/fi";
import useSaveJob from "../hooks/Jobs/useSaveJob.js";
import useImageUpload from "../hooks/Auth/useImageUpload.js"; // Custom hook for image upload
import { getAuth } from "firebase/auth";
import { storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Stepper = () => {
  const steps = [
    { id: 1, name: "Job" },
    { id: 2, name: "Assessment" },
  ];
  const [Id, setId] = useState(1);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
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
  const { saveJob } = useSaveJob();
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const onStepClick = (id) => {
    setId(id);
  };
  const fileIcons = {
    "image/png": <FaFileImage size={20} className="text-blue-500" />,
    "image/jpeg": <FaFileImage size={20} className="text-yellow-500" />,
    "image/jpg": <FaFileImage size={20} className="text-yellow-500" />,
    "application/pdf": <FaFilePdf size={20} className="text-red-500" />,
    "text/plain": <FaFileAlt size={20} className="text-gray-500" />,
    "application/msword": <FaFileWord size={20} className="text-blue-700" />,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
      <FaFileWord size={20} className="text-blue-700" />
    ),
    "application/vnd.ms-excel": (
      <FaFileExcel size={20} className="text-green-500" />
    ),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
      <FaFileExcel size={20} className="text-green-500" />
    ),
  };
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
      fileName &&
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
    console.log(imageURL, imagePreviewUrl);
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
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      // Adding job to Firestore with userref
      const data = {
        fileName: file.name,
        filePath: downloadURL, // Store the file URL
        uploadedAt: new Date(),
      };
      const isSaved = await saveJob({
        currentUser,
        jobTitle,
        companyName,
        description,
        location,
        skills,
        experienceLevel,
        assessmentDetail,
        assessmentDuration,
        duration,
        imageURL,
        data,
      });
      if (isSaved) {
        alert("Job added successfully!");
        setSubmitLoading(false);
        navigate("/viewjob/" + isSaved); // Redirect to home screen
      } else {
        toast.error("Failed to add job.");
      }
    } catch (err) {
      console.error("Error adding job: ", err);
      setSubmitLoading(false);
    }
  };
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];

    // Check if file exists
    if (!uploadedFile) {
      toast.error("No file selected");
      return;
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (uploadedFile.size > maxSize) {
      toast.error("File exceeds the 10MB size limit!");
    } else {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
      setFilePreview(URL.createObjectURL(uploadedFile));
      toast.success("File uploaded successfully!");
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileName("");
    setFilePreview(null);
    toast.info("File cleared successfully!");
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full mt-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center w-full relative"
            onClick={() => onStepClick(step.id)}
          >
            {/* Step Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                Id === step.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-400 text-white border-gray-400"
              }`}
            >
              {step.id}
            </div>

            {/* Step Label */}
            <div
              className={`mt-2 text-sm ${
                Id === step.id ? "text-black font-medium" : "text-gray-600"
              }`}
            >
              {step.name}
            </div>

            {/* Horizontal Line */}
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-4 right-0 h-0.5 bg-gray-300`}
                style={{
                  width: `calc(50% - ${step.id === 1 ? "16px" : "8px"})`,
                }}
              />
            )}
            {index !== 0 && (
              <div
                className={`absolute top-4 left-0 h-0.5 bg-gray-300`}
                style={{
                  width: `calc(50% - ${step.id === 2 ? "16px" : "8px"})`,
                }} // Adjusted for second circle
              />
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        {Id === 1 && (
          <div className="flex justify-evenly">
            {/* First Column */}
            <div className="flex flex-col w-[50vw] h-auto gap-2">
              <div
                className={`mb-4 ${error ? "is-invalid" : ""}`}
                style={{ width: "36vw", margin: "0 auto" }}
              >
                <label
                  htmlFor="projectImage"
                  className="drag-drop-label"
                  style={{
                    border: "2px dashed black",
                    height: "36vh",
                    width: "36vw",
                    borderRadius: "8px",
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
                          width: "36vw",
                          height: "36vh",
                          borderRadius: "10px",
                        }}
                      />
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

              <div
                className="form-details-sign-in mb-2 flex items-center gap-2" // Align items horizontally (icon + input)
                style={{
                  width: "45vw",
                  margin: "0 auto",
                  height: "10vh",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  flexDirection: "row", // Keep the flex direction as row for icon and input to be aligned horizontally
                  justifyContent: "flex-start", // Align items to the left
                  alignItems: "center", // Align both the icon and the input at the top
                }}
              >
                <span className="text-primary flex items-center">
                  <FaUsers size={20} color="#7f7f7f" />
                </span>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="sign-in-custom-input"
                  required
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#7f7f7f",
                    background: "transparent",
                    width: "100%", // Ensure the input takes up the remaining space
                    paddingLeft: "5px", // Add space between the icon and input text
                  }}
                />
              </div>
            </div>
            {/* Second Column */}
            <div className="flex flex-col w-[50vw] gap-2">
              <div
                className="form-details-sign-in mb-2 flex items-center gap-2" // Align items horizontally (icon + input)
                style={{
                  width: "40vw",
                  margin: "0 auto",
                  height: "8vh",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  flexDirection: "row", // Keep the flex direction as row for icon and input to be aligned horizontally
                  justifyContent: "flex-start", // Align items to the left
                  alignItems: "center", // Align both the icon and the input at the top
                }}
              >
                <span className="text-primary flex items-center">
                  <FaBriefcase size={20} color="#7f7f7f" />
                </span>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title"
                  className="sign-in-custom-input"
                  required
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#7f7f7f",
                    background: "transparent",
                    width: "100%", // Ensure the input takes up the remaining space
                    paddingLeft: "5px", // Add space between the icon and input text
                  }}
                />
              </div>
              <div
                className="form-details-sign-in mb-2 flex items-center gap-2" // Align items horizontally (icon + input)
                style={{
                  width: "40vw",
                  margin: "0 auto",
                  height: "8vh",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  flexDirection: "row", // Keep the flex direction as row for icon and input to be aligned horizontally
                  justifyContent: "flex-start", // Align items to the left
                  alignItems: "center", // Align both the icon and the input at the top
                }}
              >
                <span className="text-primary flex items-center">
                  <FaTasks size={20} color="#7f7f7f" />
                </span>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="Skills(e.g., PHP,Laravel,MySQL)"
                  className="sign-in-custom-input"
                  required
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#7f7f7f",
                    background: "transparent",
                    width: "100%", // Ensure the input takes up the remaining space
                    paddingLeft: "5px", // Add space between the icon and input text
                  }}
                />
              </div>
              <div className="flex items-center justify-center">
                {skills.length > 0 && (
                  <div className="d-flex gap-2 items-center text mt-1 mb-2 w-[40vw] flex-wrap">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="relative flex items-center justify-between badge badge-primary text-capitalize"
                        style={{
                          backgroundColor: "#007bff",
                          color: "#fff",
                          padding: "10px 16px", // Added more padding horizontally
                          width: "auto", // Adjust width to fit content dynamically
                          borderRadius: "12px",
                          display: "inline-flex", // Flexbox for better alignment
                          alignItems: "center",
                        }}
                      >
                        {skill}
                        <FaTimes
                          className="absolute cursor-pointer"
                          style={{
                            fontSize: "14px", // Increased size of icon
                            top: "-6px", // Moved upwards
                            right: "-6px", // Moved rightwards
                            background: "#ff0000", // Added red background for visibility
                            color: "#fff",
                            borderRadius: "50%", // Circular shape
                            padding: "2px", // Small padding for clickable area
                          }}
                          onClick={() => removeSkill(index)}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="form-details-sign-in mb-2 flex items-center gap-2" // Align items horizontally (icon + input)
                style={{
                  width: "40vw",
                  margin: "0 auto",
                  height: "8vh",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  flexDirection: "row", // Keep the flex direction as row for icon and input to be aligned horizontally
                  justifyContent: "flex-start", // Align items to the left
                  alignItems: "center", // Align both the icon and the input at the top
                }}
              >
                <span className="text-primary flex items-center">
                  <FaTasks size={20} color="#7f7f7f" />
                </span>
                <input
                  type="text"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="Experience Level(e.g., Beginner,Intermediate,Advance)"
                  className="sign-in-custom-input"
                  required
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#7f7f7f",
                    background: "transparent",
                    width: "100%", // Ensure the input takes up the remaining space
                    paddingLeft: "5px", // Add space between the icon and input text
                  }}
                />
              </div>
              <div
                className="form-details-sign-in mb-2 flex items-center gap-2" // Align items horizontally (icon + input)
                style={{
                  width: "40vw",
                  margin: "0 auto",
                  height: "20vh",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  flexDirection: "row", // Keep the flex direction as row for icon and input to be aligned horizontally
                  justifyContent: "flex-start", // Align items to the left
                  alignItems: "flex-start", // Align both the icon and the input at the top
                }}
              >
                <span className="text-primary flex items-center">
                  <FaClipboardList size={20} color="#7f7f7f" />
                </span>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Job Description"
                  className="sign-in-custom-input"
                  required
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#7f7f7f",
                    background: "transparent",
                    width: "100%", // Ensure the input takes up the remaining space
                    paddingLeft: "5px", // Add space between the icon and input text
                  }}
                />
              </div>
              <div
                className="form-details-sign-in mb-2 flex items-center gap-2" // Align items horizontally (icon + input)
                style={{
                  width: "40vw",
                  margin: "0 auto",
                  height: "8vh",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  flexDirection: "row", // Keep the flex direction as row for icon and input to be aligned horizontally
                  justifyContent: "flex-start", // Align items to the left
                  alignItems: "center", // Align both the icon and the input at the top
                }}
              >
                <span className="text-primary flex items-center">
                  <FaGlobe size={20} color="#7f7f7f" />
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Job Location"
                  className="sign-in-custom-input"
                  required
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "#7f7f7f",
                    background: "transparent",
                    width: "100%", // Ensure the input takes up the remaining space
                    paddingLeft: "5px", // Add space between the icon and input text
                  }}
                />
              </div>
              <button
                style={{
                  border: "none",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "none",
                  height: "5vh",
                  margin: "0 auto",
                  marginBottom: "2px",
                  fontSize: "16px",
                  width: "25vw",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                }}
                className="bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md active:scale-95"
                onClick={() => setId(2)}
              >
                Next
                <span className="ml-2 flex items-center">
                  <FaArrowRight size={16} color="white" />
                </span>
              </button>
            </div>
          </div>
        )}
        {Id === 2 && (
          <div className="flex  gap-4">
            {/* Assessment Detail */}
            <div className="w-[50vw]">
              <div
                className="form-details-sign-in mb-2 bg-gray-100 rounded-lg px-4 py-2"
                style={{ width: "45vw", margin: "0 auto", height: "40vh" }}
              >
                <span className="text-primary mr-2 mt-[3px]">
                  <FaClipboardList />
                </span>
                <textarea
                  value={assessmentDetail}
                  onChange={(e) => setAssessmentDetail(e.target.value)}
                  placeholder="Assessment Detail"
                  className="flex-1 bg-transparent outline-none resize-none text-gray-500"
                  rows="4"
                  required
                />
              </div>
            </div>
            <div className="w-[50vw] flex flex-col items-center gap-3">
              {/* Assessment Duration */}
              <div
                className="form-details-sign-in mb-2 flex items-center"
                style={{ width: "45vw", margin: "0 auto", height: "10vh" }}
              >
                <span className="text-primary flex items-center">
                  <FaCalendarAlt />
                </span>
                <input
                  type="number"
                  value={assessmentDuration}
                  onChange={(e) => setAssessmentDuration(e.target.value)}
                  placeholder="Assessment Duration (e.g., 2 days)"
                  className="sign-in-custom-input"
                  required
                />
              </div>
              {/* Job Duration */}
              <div
                className="form-details-sign-in mb-2 flex items-center"
                style={{ width: "45vw", margin: "0 auto", height: "10vh" }}
              >
                <span className="text-primary flex items-center">
                  <FaRegListAlt />
                </span>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Job Duration (e.g., 6 months)"
                  className="sign-in-custom-input"
                  required
                />
              </div>
              <div
                className="flex flex-col items-center justify-center h-auto w-[45vw] bg-gray-100 p-4 rounded-md"
                style={{ margin: "0 auto" }}
              >
                <ToastContainer />
                <label
                  htmlFor="file-upload"
                  className="flex items-center px-6 py-3 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 shadow-lg"
                >
                  <FaCloudUploadAlt size={24} className="mr-2" />
                  Upload File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {fileName && (
                  <div className="mt-4 flex items-center text-gray-700 bg-white p-2 rounded-md shadow-md gap-2">
                    {fileIcons[file?.type] || (
                      <FaFileAlt size={20} className="text-gray-500" />
                    )}
                    <p className="mr-2">{fileName}</p>
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => window.open(filePreview, "_blank")}
                    >
                      <FaEye size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={clearFile}
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                )}
              </div>
              {/* Submit Button */}
              <div
                className=" mt-4"
                style={{
                  width: "45vw",
                  margin: "0 auto",
                  padding: "10px",
                  background: "white",
                  boxShadow: "0 -4px 4px 0 rgb(0 0 0 / 4%)",
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-3 w-100"
                  disabled={loading || submitLoading}
                >
                  {submitLoading ? "Submitting..." : "Post Job"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Stepper;
