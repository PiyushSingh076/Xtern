// src/Components/Profile/SingleMentor.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import useRegisterUser from "../../../hooks/Stream/client";
import { FaClock, FaRegClock, FaRegFolderOpen } from "react-icons/fa";
import { MdEdit, MdChat, MdCalendarToday, MdClose } from "react-icons/md";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useFetchUsersByType from "../../../hooks/Profile/useFetchUsersByType";
import useGoogleCalendar from "../../../hooks/Profile/useGoogleCalendar";
import useScheduledCallsForUser from "../../../hooks/Profile/useScheduledCallsForUser";
import toast from "react-hot-toast";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Image,
  ProgressBar,
} from "react-bootstrap";
import ScheduledCallsModal from "./ScheduledCallsModal";
import { Box, Tooltip, IconButton, Chip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import useAuthState from "../../../hooks/Authentication/useAuthState";

/**
 * Utility to safely format Firestore Timestamp or "Present"/string.
 */
function formatDateGeneric(value) {
  if (!value) return "N/A";
  if (typeof value === "string") {
    if (value.toLowerCase() === "present") {
      return "Present";
    }
    // Parse the date string
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("D MMM YYYY") : value;
  }
  // If it's a Firestore Timestamp (not applicable as per latest changes)
  return "N/A";
}

/**
 * Format experience if it's numeric or zero
 */
function formatExperience(expValue) {
  // Attempt to parse the experience value
  const parsed = parseInt(expValue, 10);

  // Check if the parsed value is a valid number and greater than 0
  if (isNaN(parsed) || parsed <= 0) return "Less than 1 Year";

  // Return the parsed experience with the "Yr" suffix
  return `${parsed} Yr`;
}

const SingleMentor = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const { user, loading } = useAuthState();

  // For scheduling calls
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [interviewDate, setInterviewDate] = useState(dayjs());
  const [interviewTime, setInterviewTime] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [callsModalOpen, setCallsModalOpen] = useState(false);
  const [meetLink, setMeetLink] = useState("");

  // Toggling descriptions in Work & Projects
  const [workOpen, setWorkOpen] = useState({});
  const [projectOpen, setProjectOpen] = useState({});
  const [serviceOpen, setServiceOpen] = useState({}); // New state for Services

  const toggleWorkDesc = (index) =>
    setWorkOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleProjectDesc = (index) =>
    setProjectOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleServiceDesc = (index) =>
    setServiceOpen((prev) => ({ ...prev, [index]: !prev[index] }));

  // Hook to fetch this user’s data
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);

  const handleChatClick = () => {
    if (user) {
      navigate("/mychat"); // Redirect to chat page if logged in
    } else {
      navigate("/signin"); // Redirect to sign-in page if not logged in
    }
  };

  const handleMeetClick = () => {
    if (user) {
      navigate("/meet"); // Redirect to meet page if logged in
    } else {
      navigate("/signin"); // Redirect to sign-in page if not logged in
    }
  };

  // Example: fetching other users by type
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useFetchUsersByType("Developer");

  // Current user
  const { userData: currentUser } = useFetchUserData();

  // Google Calendar
  const {
    signIn,
    createEvent,
    deleteEvent,
    loading: scheduleLoading,
    isInitialized,
  } = useGoogleCalendar();

  // Calls for user
  const {
    calls,
    loading: callsLoading,
    error: callsError,
  } = useScheduledCallsForUser(currentUser?.uid);

  // If the user is viewing their own profile, let them edit
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (currentUser && currentUser.uid === uid) setEditable(true);
    else setEditable(false);
  }, [currentUser, uid]);

  // If no .type, redirect to fill detail
  useEffect(() => {
    if (!profileLoading && (!profileData?.type || profileData?.type === "")) {
      navigate("/userdetail");
    }
  }, [profileLoading, profileData, navigate]);

  const registrationStatus = useRegisterUser(
    profileData,
    profileLoading,
    profileError
  );

  // On "Edit" -> go to StepperForm
  const handleEdit = () => {
    if (profileData?.type) {
      const sanitized = JSON.parse(JSON.stringify(profileData));
      navigate("/userdetail", { state: { profileData: sanitized } });
    } else {
      navigate("/userdetail");
    }
  };

  // Scheduling calls
  const handleDateChange = (date) => {
    setInterviewDate(date);
    setCurrentStep(2);
  };
  const handleTimeChange = (time) => {
    setInterviewTime(time);
    setCurrentStep(3);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleScheduleCall = async () => {
    try {
      if (!isInitialized) {
        toast.error("Google Calendar not ready. Please try again.");
        return;
      }
      await signIn();
      const startDateTime = interviewDate
        .hour(interviewTime.hour())
        .minute(interviewTime.minute())
        .second(0)
        .toISOString();
      const endDateTime = dayjs(startDateTime).add(30, "minute").toISOString();

      const eventData = {
        title: "XTERN Mentorship Call",
        description: `
          Mentorship Call with ${profileData?.firstName} ${
          profileData?.lastName
        }
          Host: ${currentUser?.firstName} ${currentUser?.lastName}
          Date: ${interviewDate.format("D MMM YYYY")}
          Time: ${interviewTime.format("h:mm A")}
          Description: ${description || "N/A"}
          Meet Link: ${meetLink}
        `,
        startDateTime,
        endDateTime,
        attendees: [
          { email: currentUser?.email },
          { email: profileData?.email },
        ],
        callId: `call-${Date.now()}`,
        hostUserId: currentUser?.uid,
        recipientUserId: profileData?.uid,
        callType: "video",
        location: "Online",
      };

      const response = await createEvent(eventData);
      if (response.success) {
        setCurrentStep(1);
        setInterviewDate(dayjs());
        setInterviewTime(dayjs());
        setDescription("");
        setInterviewScheduled(false);
        setMeetLink(response.meetLink);
        window.open(response.eventLink, "_blank");
        toast.success("Call scheduled and event opened.");
      } else {
        toast.error("Failed to schedule. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error scheduling call.");
    }
  };

  // If user clicks "Service" item
  const handleService = (item) => {
    const serializableItem = JSON.parse(JSON.stringify(item));
    navigate("/project", { state: { item: serializableItem } });
  };
  // Show/hide calls
  const openScheduledCallsModal = () => setCallsModalOpen(true);
  const closeScheduledCallsModal = () => setCallsModalOpen(false);

  // Delete event from calendar
  const handleDeleteEvent = async (eventId, callDocId) => {
    try {
      await deleteEvent(eventId, callDocId);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting event.");
    }
  };

  // "Share" functionality
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Profile link copied!"))
      .catch(() => toast.error("Failed to copy link."));
  };

  return (
    <div className="desktop-profile-container">
      <section id="profile-details-section">
        <div className="profile-details">
          <div className="profile-details-wrap">
            <div className="profile-details-first-wrap">
              {editable && (
                <button
                  onClick={handleEdit}
                  className="edit-btn"
                  title="Edit Profile"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "50%",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f0f0f0"; // Light gray on hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"; // Reset on leave
                  }}
                >
                  <MdEdit size={24} color="#007bff" />
                </button>
              )}

              <div className="profile-img-info-container">
                <div
                  className="mentor-img-sec"
                  style={{ position: "relative" }}
                >
                  <Tooltip title="Share Profile" arrow>
                    <IconButton
                      onClick={handleShare}
                      sx={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        backgroundColor: "#007bff",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#0056b3" },
                      }}
                      size="small"
                    >
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {profileLoading ? (
                    <Skeleton variant="circular" width={150} height={150} />
                  ) : (
                    <img
                      src={profileData?.photo_url || "/default-profile.png"}
                      alt={`${profileData?.firstName} ${profileData?.lastName}`}
                      width={150}
                      height={150}
                      onError={(e) => (e.target.src = "/default-profile.png")}
                    />
                  )}
                </div>
                <div className="profile-details-details">
                  {profileLoading ? (
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1.2rem", width: "150px" }}
                    />
                  ) : (
                    <h4 style={{ marginTop: "10px" }}>
                      {profileData?.firstName} {profileData?.lastName}
                    </h4>
                  )}

                  {profileLoading ? (
                    <Skeleton sx={{ fontSize: "1rem", width: "100px" }} />
                  ) : (
                    <span>
                      {profileData?.city}, {profileData?.state}
                    </span>
                  )}

                  {profileLoading ? (
                    <Skeleton sx={{ fontSize: "1rem", width: "100px" }} />
                  ) : (
                    <span>
                      Experience: {formatExperience(profileData?.experience)}
                    </span>
                  )}

                  {profileLoading ? (
                    <Skeleton sx={{ width: "50px" }} />
                  ) : (
                    <p className="badge-type">{profileData?.type}</p>
                  )}
                </div>
              </div>
            </div>
            {profileLoading ? (
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: "350px", marginTop: "20px" }}
              />
            ) : (
              <div className="skills-section">
                <div className="skills-header">Skills</div>
                {profileData?.skillSet?.length ? (
                  profileData.skillSet.map((item) => {
                    const ratingPct = (parseInt(item.skillRating) / 5) * 100;
                    return (
                      <div className="skill-bar-card" key={item.skill}>
                        <span>{item.skill}</span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className="skill-rating"
                            style={{ marginBottom: "5px", fontSize: "12px" }}
                          >
                            {ratingPct}%
                          </div>
                          <div className="skill-bar">
                            <div
                              className="skill-bar-fill"
                              style={{
                                width: `${ratingPct}%`,
                                backgroundColor: "#007bff",
                                height: "5px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span>No skill set available</span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="acadmic-section-container">
        {profileLoading ? (
          <Skeleton sx={{ width: "100%", height: "100px" }} />
        ) : (
          <div
            className="consulting-container"
            style={{ marginBottom: "20px" }}
          >
            <div className="consulting-btn-container">
              <div style={{ display: "flex", alignItems: "center" }}>
                {profileData?.consultingPrice && (
                  <span className="service-name">Consulting Now</span>
                )}
                <div className="issue-badge mt-4">
                  {profileData?.skillSet?.map((skill, index) => (
                    <div className="badge p-2" key={index}>
                      {skill.skill}
                    </div>
                  ))}
                </div>
              </div>
              {!editable && (
                <div className="consulting-btn">
                  <button onClick={handleChatClick} className="chat-btn">
                    <MdChat /> Chat
                  </button>
                  <button
                    onClick={handleMeetClick}
                    className="chat-btn"
                    disabled={!isInitialized}
                  >
                    <MdCalendarToday /> Meet
                  </button>
                </div>
              )}
              {profileData?.consultingPrice && (
                <span className="consultant-price fs-6 fw-bold">
                  ₹{profileData.consultingPrice}/minute
                </span>
              )}
            </div>
            <Box sx={{ marginTop: "0px", marginLeft: "3px" }}>
              <Tooltip title="View Previous Calls" arrow>
                <Button
                  onClick={openScheduledCallsModal}
                  variant="outline-primary"
                  size="small"
                >
                  <FaRegClock size={16} /> Upcoming Meets
                </Button>
              </Tooltip>
            </Box>
          </div>
        )}

        {profileLoading ? (
          <Skeleton
            sx={{ width: "100%", height: "200px", marginTop: "20px" }}
          />
        ) : (
          <div className="service-container">
            <h4>Service</h4>
            {profileData?.serviceDetails?.length ? (
              <div className="service-list">
                {profileData.serviceDetails.map((item, index) => (
                  <div
                    // onClick={() => handleService(item)}
                    className="service-item"
                    key={index}
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      border: "1px solid #ddd",
                      transition: "box-shadow 0.3s, background-color 0.3s",
                    }}
                  >
                    <span className="service-name">{item.serviceName}</span>

                    {/* **Interactive Description with Tooltip** */}
                    <Tooltip
                      title={
                        item.serviceDescription || "No description available"
                      }
                      arrow
                      placement="top"
                    >
                      <p>
                        {item.serviceDescription?.length > 70
                          ? `${item.serviceDescription.slice(0, 70)}...`
                          : item.serviceDescription}
                      </p>
                    </Tooltip>

                    {profileData?.type?.toLowerCase() === "intern" ? (
                      /* **1. Compact Badge for Interns** */
                      <Chip
                        label={`Avail: ${item.availability}, ${
                          item.hoursPerDay
                        }h/day | ${formatDateGeneric(
                          item.startDate
                        )}, ${formatDateGeneric(item.endDate)}`}
                        size="small"
                        color="primary"
                        sx={{
                          marginTop: 1,
                          backgroundColor: "#f5f5f5", // Lighter background
                          border: "1px solid #424242", // Dark border
                          color: "#424242", // Dark text for contrast
                        }}
                      />
                    ) : (
                      /* **2. Service Duration and Price for Non-Interns** */
                      <div className="price-duration-container">
                        {item.serviceDuration && (
                          <span className="service-duration">
                            <FaClock /> {item.serviceDuration}{" "}
                            {item.serviceDurationType}
                          </span>
                        )}
                        {item.servicePrice && (
                          <span className="service-price">
                            ₹{item.servicePrice}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <FaRegFolderOpen size={50} color="#ccc" />
                <p>No services available</p>
              </div>
            )}
          </div>
        )}

        <div className="single-mentor-third-sec">
          <div className="fifth-decs-sec">
            <div className="fifth-decs-sec-wrap">
              {profileLoading ? (
                <Skeleton
                  sx={{ width: "100%", height: "50px", marginTop: "20px" }}
                />
              ) : (
                <ul
                  className="nav nav-pills single-mentor-tab three-tab"
                  id="mentor-tab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      data-bs-toggle="pill"
                      data-bs-target="#course-content"
                      type="button"
                      role="tab"
                    >
                      Work Experience
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="pill"
                      data-bs-target="#education-content"
                      type="button"
                      role="tab"
                    >
                      Education
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="pill"
                      data-bs-target="#projects-content"
                      type="button"
                      role="tab"
                    >
                      Projects
                    </button>
                  </li>
                </ul>
              )}

              <div className="tab-content">
                {/* Work Experience Tab */}
                <div
                  className="tab-pane fade show active mt-16"
                  id="course-content"
                  role="tabpanel"
                >
                  {profileLoading ? (
                    <Skeleton
                      sx={{ width: "100%", height: "200px", marginTop: "20px" }}
                    />
                  ) : profileData?.workExperience?.length ? (
                    profileData.workExperience.map((work, index) => (
                      <div
                        className="experience-sec"
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <div className="work-logo-container">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/10655/10655913.png"
                            className="educ-logo"
                            alt="Company Logo"
                            style={{ width: "100px", height: "100px" }}
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{work?.role}</h4>
                          <p>
                            {work?.companyName} |{" "}
                            {formatDateGeneric(work?.startDate)} -{" "}
                            {formatDateGeneric(work?.endDate)}
                          </p>
                          <Tooltip
                            title={
                              work.description || "No description available"
                            }
                            arrow
                            placement="top"
                          >
                            <span
                              className="desc-toggle-text"
                              onClick={() => toggleWorkDesc(index)}
                              style={{
                                color: "blue",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              {workOpen[index]
                                ? "Hide Description"
                                : "View Description"}
                            </span>
                          </Tooltip>
                          {workOpen[index] && (
                            <div style={{ marginTop: 5 }}>
                              {work?.description || "No description available"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <FaRegFolderOpen size={50} color="#ccc" />
                      <p>No work experience found</p>
                    </div>
                  )}
                </div>

                {/* Education Tab */}
                <div
                  className="tab-pane fade"
                  id="education-content"
                  role="tabpanel"
                >
                  {profileLoading ? (
                    <Skeleton
                      sx={{ width: "100%", height: "200px", marginTop: "20px" }}
                    />
                  ) : profileData?.educationDetails?.length ? (
                    profileData.educationDetails.map((educ, index) => (
                      <div
                        className="experience-sec"
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <div className="work-logo-container">
                          <img
                            src="https://cdn.vectorstock.com/i/1000x1000/14/68/education-color-icon-vector-29051468.jpg"
                            className="educ-logo"
                            alt="Education Logo"
                            style={{ width: "100px", height: "100px" }}
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{educ?.degree}</h4>
                          <h6>Stream: {educ?.stream}</h6>
                          <p>{educ?.collegename}</p>
                          <p>
                            {formatDateGeneric(educ?.startyear)} -{" "}
                            {formatDateGeneric(educ?.endyear)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <FaRegFolderOpen size={50} color="#ccc" />
                      <p>No education details found</p>
                    </div>
                  )}
                </div>

                {/* Projects Tab */}
                <div
                  className="tab-pane fade"
                  id="projects-content"
                  role="tabpanel"
                >
                  {profileLoading ? (
                    <Skeleton
                      sx={{ width: "100%", height: "200px", marginTop: "20px" }}
                    />
                  ) : profileData?.projectDetails?.length ? (
                    profileData.projectDetails.map((project, index) => (
                      <div
                        className="experience-sec"
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <div className="work-logo-container">
                          <img
                            src="https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg"
                            className="educ-logo"
                            alt="Project Logo"
                            style={{ width: "100px", height: "100px" }}
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{project?.projectName}</h4>
                          {project?.duration && <h6>{project?.duration}</h6>}
                          {project?.techstack &&
                            project?.techstack.length > 0 && (
                              <div>
                                <b>Tech Stack:</b>{" "}
                                {project.techstack.map((itm, idx) => (
                                  <span key={idx}>
                                    {itm}
                                    {idx !== project.techstack.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                              </div>
                            )}
                          <div className="desc-view-btn-container">
                            {/* Tooltip for Live Link */}
                            {project?.liveDemo && (
                              <Tooltip
                                title={project.liveDemo}
                                arrow
                                placement="top"
                              >
                                <a
                                  href={project.liveDemo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="link-btn"
                                  style={{
                                    marginRight: "10px", // Add spacing between link and description
                                  }}
                                >
                                  Live Link
                                </a>
                              </Tooltip>
                            )}

                            {/* Tooltip for View Description */}
                            <Tooltip
                              title={
                                project.description ||
                                "No description available"
                              }
                              arrow
                              placement="top"
                            >
                              <span
                                className="desc-toggle-text"
                                onClick={() => toggleProjectDesc(index)}
                                style={{
                                  color: "blue",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                              >
                                {projectOpen[index]
                                  ? "Hide Description"
                                  : "View Description"}
                              </span>
                            </Tooltip>
                          </div>

                          {projectOpen[index] && (
                            <div style={{ marginTop: 5 }}>
                              {project?.description ||
                                "No description available"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <FaRegFolderOpen size={50} color="#ccc" />
                      <p>No projects found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scheduling Modal */}
      <Modal
        show={interviewScheduled}
        onHide={() => {
          setInterviewScheduled(false);
          setCurrentStep(1);
          setInterviewDate(dayjs());
          setInterviewTime(dayjs());
          setDescription("");
        }}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>Schedule a Call</Modal.Title>
          <Button
            variant="link"
            onClick={() => {
              setInterviewScheduled(false);
              setCurrentStep(1);
              setInterviewDate(dayjs());
              setInterviewTime(dayjs());
              setDescription("");
            }}
            style={{ color: "white", textDecoration: "none" }}
          >
            <MdClose size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <Container>
            <Row>
              <Col>
                <ProgressBar
                  now={(currentStep / 4) * 100}
                  label={`Step ${currentStep} of 4`}
                  className="mb-4"
                  variant="info"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                {currentStep === 1 && (
                  <div>
                    <h5>Select Date</h5>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        value={interviewDate}
                        onChange={handleDateChange}
                      />
                    </LocalizationProvider>
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <h5>Select Time</h5>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimeClock
                        value={interviewTime}
                        onChange={handleTimeChange}
                        format="hh:mm A"
                        ampm
                      />
                    </LocalizationProvider>
                  </div>
                )}
                {currentStep === 3 && (
                  <div>
                    <h5>Add Description</h5>
                    <Form>
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Enter description..."
                          value={description}
                          onChange={handleDescriptionChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                )}
                {currentStep === 4 && (
                  <div>
                    <h5>Confirm Details</h5>
                    <Container>
                      <Row className="mb-3">
                        <Col
                          xs={12}
                          md={6}
                          className="d-flex align-items-center"
                        >
                          <Image
                            src={
                              currentUser?.photo_url || "/default-profile.png"
                            }
                            roundedCircle
                            alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                            className="me-3 img-fluid d-block"
                            style={{ width: "100px", height: "100px" }} // Optional for fixed square size
                          />

                          <div>
                            <strong>
                              {currentUser?.firstName} {currentUser?.lastName}
                            </strong>
                            <br />
                            <a href={`mailto:${currentUser?.email}`}>
                              {currentUser?.email}
                            </a>
                          </div>
                        </Col>
                        <Col
                          xs={12}
                          md={6}
                          className="d-flex align-items-center"
                        >
                          <Image
                            src={
                              profileData?.photo_url || "/default-profile.png"
                            }
                            roundedCircle
                            width={50}
                            height={50}
                            alt={`${profileData?.firstName} ${profileData?.lastName}`}
                            className="me-3"
                          />
                          <div>
                            <strong>
                              {profileData?.firstName} {profileData?.lastName}
                            </strong>
                            <br />
                            <a href={`mailto:${profileData?.email}`}>
                              {profileData?.email}
                            </a>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p>
                            <strong>Date:</strong>{" "}
                            {interviewDate.format("D MMM YYYY")}
                          </p>
                          <p>
                            <strong>Time:</strong>{" "}
                            {interviewTime.format("h:mm A")}
                          </p>
                          <p>
                            <strong>Description:</strong> {description || "N/A"}
                          </p>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="bg-white">
          <Container>
            <Row className="w-100">
              <Col className="d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setInterviewScheduled(false);
                    setCurrentStep(1);
                    setInterviewDate(dayjs());
                    setInterviewTime(dayjs());
                    setDescription("");
                  }}
                >
                  Cancel
                </Button>
                <div>
                  {currentStep > 1 && (
                    <Button
                      variant="outline-primary"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="me-2"
                    >
                      Back
                    </Button>
                  )}
                  {currentStep < 4 && (
                    <Button
                      variant="primary"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={
                        (currentStep === 1 && !interviewDate) ||
                        (currentStep === 2 && !interviewTime)
                      }
                    >
                      Next
                    </Button>
                  )}
                  {currentStep === 4 && (
                    <Button
                      variant="success"
                      onClick={handleScheduleCall}
                      disabled={scheduleLoading}
                    >
                      {scheduleLoading ? "Scheduling..." : "Schedule Call"}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>

      {/* Scheduled Calls Modal */}
      <ScheduledCallsModal
        open={callsModalOpen}
        onClose={closeScheduledCallsModal}
        loading={callsLoading}
        calls={calls}
        error={callsError}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default SingleMentor;
