import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Equivalent to FaCalendarAlt
import ListAltIcon from "@mui/icons-material/ListAlt"; // Equivalent to FaClipboardList
import LanguageIcon from "@mui/icons-material/Language"; // Equivalent to FaGlobe
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"; // Equivalent to FaBriefcase
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // Equivalent to FaTasks
import GroupsIcon from "@mui/icons-material/Groups"; // Equivalent to FaUsers
import CloseIcon from "@mui/icons-material/Close"; // Equivalent to FaTimes
import ListIcon from "@mui/icons-material/List"; // Equivalent to FaRegListAlt
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Equivalent to FaCloudUploadAlt
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Equivalent to FaArrowRight
import VisibilityIcon from "@mui/icons-material/Visibility"; // Equivalent to FaEye
import ImageIcon from "@mui/icons-material/Image"; // Equivalent to ImageIcon
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Equivalent to FaFilePdf
import DescriptionIcon from "@mui/icons-material/Description"; // Equivalent to FaFileAlt
import ArticleIcon from "@mui/icons-material/Article"; // Equivalent to FaFileWord
import TableChartIcon from "@mui/icons-material/TableChart"; // Equivalent to FaFileExcel

import { toast, ToastContainer } from "react-toastify";

import { FiXCircle } from "react-icons/fi";
import useSaveJob from "../hooks/Jobs/useSaveJob.js";
import useImageUpload from "../hooks/Auth/useImageUpload.js"; // Custom hook for image upload
import { getAuth } from "firebase/auth";
import { storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextField, InputAdornment } from "@mui/material";
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
    "image/png": <ImageIcon size={20} className="text-blue-500" />,
    "image/jpeg": <ImageIcon size={20} className="text-yellow-500" />,
    "image/jpg": <ImageIcon size={20} className="text-yellow-500" />,
    "application/pdf": <PictureAsPdfIcon size={20} className="text-red-500" />,
    "text/plain": <DescriptionIcon size={20} className="text-gray-500" />,
    "application/msword": <ArticleIcon size={20} className="text-blue-700" />,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
      <ArticleIcon size={20} className="text-blue-700" />
    ),
    "application/vnd.ms-excel": (
      <TableChartIcon size={20} className="text-green-500" />
    ),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
      <TableChartIcon size={20} className="text-green-500" />
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

              <TextField
                className="w-[40vw]"
                style={{ margin: "0 auto" }}
                label="Company Name"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupsIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </div>
            {/* Second Column */}
            <div className="flex flex-col w-[50vw] gap-2">
              <TextField
                className="w-[40vw]"
                style={{ margin: "0 auto" }}
                label="Job Title"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessCenterIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              {/* Skills Input */}
              <TextField
                label="Skills (e.g., PHP, Laravel, MySQL)"
                required
                className="w-[40vw]"
                style={{ margin: "0 auto" }}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentTurnedInIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

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
                        <CloseIcon
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
              {/* Experience Level Input */}
              <TextField
                label="Experience Level (e.g., Beginner, Intermediate, Advanced)"
                required
                className="w-[40vw]"
                style={{ margin: "0 auto" }}
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentTurnedInIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <TextField
                placeholder="Job Description *"
                required
                className="w-[40vw]"
                style={{ margin: "0 auto" }}
                multiline
                rows={4} // Adjust rows for multiline input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ListAltIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{
                  ".MuiOutlinedInput-root": {
                    paddingLeft: "40px", // Adds space for the icon inside the input field
                    paddingTop: "10px", // Adjust the padding to align the icon at the top
                    "& fieldset": {
                      borderColor: "#ccc", // Dark border outline color by default
                    },
                    "&:hover fieldset": {
                      borderColor: "#333", // Light black border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0077b5", // Blue border color when focused (LinkedIn blue)
                    },
                  },
                  ".MuiInputAdornment-root": {
                    position: "absolute", // Make sure the icon stays inside the field
                    top: "9px", // Align the icon at the top of the input field
                    left: "10px", // Position the icon to the left inside the input
                  },
                }}
              />

              <TextField
                label="Job Location"
                required
                className="w-[40vw]"
                style={{ margin: "0 auto" }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

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
                  <ArrowForwardIcon size={16} color="white" />
                </span>
              </button>
            </div>
          </div>
        )}
        {Id === 2 && (
          <div className="flex  gap-4">
            {/* Assessment Detail */}
            <div className="w-[50vw]">
              <TextField
                placeholder="Assessment Detail *"
                required
                className="w-[45vw]"
                style={{ margin: "0 20px" }}
                multiline
                rows={10} // Adjust rows for multiline input
                value={assessmentDetail}
                onChange={(e) => setAssessmentDetail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{
                  ".MuiOutlinedInput-root": {
                    paddingLeft: "40px", // Adds space for the icon inside the input field
                    paddingTop: "10px", // Adjust the padding to align the icon at the top
                    "& fieldset": {
                      borderColor: "#ccc", // Dark border outline color by default
                    },
                    "&:hover fieldset": {
                      borderColor: "#333", // Light black border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0077b5", // Blue border color when focused (LinkedIn blue)
                    },
                  },
                  ".MuiInputAdornment-root": {
                    position: "absolute", // Make sure the icon stays inside the field
                    top: "9px", // Align the icon at the top of the input field
                    left: "10px", // Position the icon to the left inside the input
                  },
                }}
              />
            </div>
            <div className="w-[50vw] flex flex-col items-center gap-3">
              {/* Assessment Duration */}
              <TextField
                type="number"
                className="w-[45vw]"
                style={{ margin: "0 auto" }}
                label="Assessment Duration (e.g., 2 days)"
                required
                value={assessmentDuration}
                onChange={(e) => setAssessmentDuration(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              {/* Job Duration */}
              <TextField
                className="w-[45vw]"
                type="number"
                style={{ margin: "0 auto" }}
                label="Job Duration (e.g., 6 Months)"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="#7f7f7f" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <div
                className="flex flex-col items-center justify-center h-auto w-[45vw] bg-gray p-4 rounded-md cursor-pointer"
                style={{ margin: "0 auto", border: "1px solid #ccc" }}
              >
                <ToastContainer />
                <label
                  htmlFor="file-upload"
                  className="flex items-center px-6 py-3 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 shadow-lg"
                >
                  <CloudUploadIcon size={24} className="mr-2" />
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
                      <DescriptionIcon size={20} className="text-gray-500" />
                    )}
                    <p className="mr-2">{fileName}</p>
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => window.open(filePreview, "_blank")}
                    >
                      <VisibilityIcon size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={clearFile}
                    >
                      <CloseIcon size={20} />
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
