// src/Components/Profile/SingleMentor.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Profile.css";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import "react-circular-progressbar/dist/styles.css";
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
import { Box, Tooltip, IconButton } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

/**
 * Utility to safely format dates whether they're Firestore timestamps
 * (with .seconds) or normal strings ("2025-01-31", "Present", etc.).
 */
function formatDateGeneric(value) {
  if (!value) return "N/A";

  // If it's a Firestore timestamp object
  if (value.seconds !== undefined) {
    return dayjs.unix(value.seconds).format("D MMM YYYY");
  }

  // If it's the string "Present"
  if (typeof value === "string" && value.toLowerCase() === "present") {
    return "Present";
  }

  // Otherwise, try to parse it as a date string
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("D MMM YYYY") : value;
}

/**
 * Helper to format experience:
 * - If no/zero, returns "Less than 1"
 * - Otherwise returns integer (e.g., "3")
 */
function formatExperience(expValue) {
  const parsed = parseInt(expValue || "0", 10);
  if (parsed === 0) return "Less than 1";
  return parsed.toString();
}

const SingleMentor = () => {
  const navigate = useNavigate();
  const { uid } = useParams();

  // For scheduling calls
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [interviewDate, setInterviewDate] = useState(dayjs());
  const [interviewTime, setInterviewTime] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [callsModalOpen, setCallsModalOpen] = useState(false);
  const [meetLink, setMeetLink] = useState("");

  // For toggling descriptions in Work and Projects
  const [workOpen, setWorkOpen] = useState({});
  const [projectOpen, setProjectOpen] = useState({});

  const toggleWorkDesc = (index) => {
    setWorkOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const toggleProjectDesc = (index) => {
    setProjectOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Hook to fetch this profile's data by UID
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);

  // Example: fetching other users by type (not critical)
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useFetchUsersByType("Developer");

  // Current user (the one logged in)
  const { userData: currentUser } = useFetchUserData();

  // Google Calendar integration
  const {
    signIn,
    createEvent,
    deleteEvent,
    loading: scheduleLoading,
    isInitialized,
  } = useGoogleCalendar();

  // Calls for the user (history)
  const {
    calls,
    loading: callsLoading,
    error: callsError,
  } = useScheduledCallsForUser(currentUser?.uid);

  // If the user is viewing their own profile, let them edit
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (currentUser && currentUser.uid === uid) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [currentUser, uid]);

  // If no .type, redirect to fill detail
  useEffect(() => {
    if (!profileLoading && (!profileData?.type || profileData?.type === "")) {
      navigate("/userdetail");
    }
  }, [profileLoading, profileData, navigate]);

  // For Stream registration (optional)
  const registrationStatus = useRegisterUser(
    profileData,
    profileLoading,
    profileError
  );

  // On "Edit" -> go to StepperForm with data preloaded
  const handleEdit = () => {
    if (profileData?.type) {
      // Deep copy to avoid accidental mutation
      const sanitizedData = JSON.parse(JSON.stringify(profileData));
      navigate("/userdetail", { state: { profileData: sanitizedData } });
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

  // Submit a call to Google Calendar
  const handleScheduleCall = async () => {
    try {
      if (!isInitialized) {
        toast.error(
          "Google Calendar is not initialized yet. Please try again."
        );
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
        📞 XTERN Mentorship Call

        👤 Host: ${currentUser?.firstName} ${currentUser?.lastName} (${
          currentUser?.email
        })
        👥 Recipient: ${profileData?.firstName} ${profileData?.lastName} (${
          profileData?.email
        })

        📅 Date: ${interviewDate.format("D MMM YYYY")}
        ⏰ Time: ${interviewTime.format("h:mm A")}
        ⏳ Duration: 30 minutes
        📝 Description: ${description || "N/A"}

        Meet Link: ${meetLink}

        💬 Looking forward to our mentorship session!

        Best Regards,
        ✨ XTERN Team
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

        // Open the event link in a new tab
        window.open(response.eventLink, "_blank");
        toast.success("Call scheduled and event opened in a new tab.");
      } else {
        toast.error("Failed to schedule the call. Please try again.");
      }
    } catch (error) {
      console.error("Error scheduling call:", error);
      toast.error("An error occurred while scheduling the call.");
    }
  };

  // If user clicks a "Service" item (for demonstration)
  const handleService = (item) => {
    const serializableItem = {
      serviceName: item.serviceName,
      serviceDescription: item.serviceDescription,
      serviceDuration: item.serviceDuration,
      serviceDurationType: item.serviceDurationType,
      servicePrice: item.servicePrice,
    };
    navigate("/project", { state: { item: serializableItem } });
  };

  // Show/hide scheduled calls
  const openScheduledCallsModal = () => setCallsModalOpen(true);
  const closeScheduledCallsModal = () => setCallsModalOpen(false);

  // Delete a scheduled call from the calendar
  const handleDeleteEvent = async (eventId, callDocId) => {
    try {
      await deleteEvent(eventId, callDocId);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred while deleting the event.");
    }
  };

  // "Share" functionality
  const handleShare = () => {
    const url = window.location.href; // current page URL
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Profile link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link. Please try again."));
  };

  return (
    <div className="desktop-profile-container">
      {/* Profile details section */}
      <section id="profile-details-section">
        <div className="profile-details">
          <div className="profile-details-wrap">
            <div className="profile-details-first-wrap">
              {/* Show the "Edit" button if I'm the owner */}
              {editable && (
                <button onClick={handleEdit} className="edit-btn">
                  <MdEdit />
                </button>
              )}

              <div className="profile-img-info-container">
                <div
                  className="mentor-img-sec"
                  style={{ position: "relative" }}
                >
                  {/* Share button in top-left corner of the avatar */}
                  <Tooltip title="Share Profile" arrow>
                    <IconButton
                      onClick={handleShare}
                      sx={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        backgroundColor: "#007bff",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#0056b3",
                        },
                      }}
                      size="small"
                    >
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {profileLoading ? (
                    <Skeleton
                      variant="circular"
                      width={150}
                      height={150}
                      animation="wave"
                    />
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
                      animation="wave"
                      sx={{
                        fontSize: "1.2rem",
                        width: "150px",
                        height: "30px",
                      }}
                    />
                  ) : (
                    <h4 style={{ marginTop: "10px" }}>
                      {profileData?.firstName} {profileData?.lastName}
                    </h4>
                  )}

                  {profileLoading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ fontSize: "1rem", width: "100px", height: "20px" }}
                    />
                  ) : (
                    <span>
                      {profileData?.city}, {profileData?.state}
                    </span>
                  )}

                  {profileLoading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ fontSize: "1rem", width: "200px", height: "20px" }}
                    />
                  ) : (
                    <span>
                      Year of Experience:{" "}
                      {formatExperience(profileData?.experience)}
                    </span>
                  )}

                  {profileLoading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ fontSize: "1rem", width: "100px", height: "20px" }}
                    />
                  ) : (
                    <p className="badge-type">{profileData?.type}</p>
                  )}
                </div>
              </div>
            </div>

            {profileLoading ? (
              <Skeleton
                variant="rectangle"
                sx={{
                  width: "100%",
                  height: "350px",
                  marginTop: "20px",
                  borderRadius: "20px",
                }}
              />
            ) : (
              <div className="skills-section">
                <div className="skills-header">Skills</div>
                {profileData?.skillSet?.length > 0 ? (
                  profileData.skillSet.map((item) => {
                    // skillRating is out of 5 -> convert to percentage
                    const ratingPercentage =
                      (parseInt(item.skillRating) / 5) * 100;
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
                            style={{
                              marginBottom: "5px",
                              fontSize: "12px",
                              color: "#007bff",
                            }}
                          >
                            {ratingPercentage}%
                          </div>
                          <div className="skill-bar">
                            <div
                              className="skill-bar-fill"
                              style={{
                                width: `${ratingPercentage}%`,
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
          <Skeleton
            animation="pulse"
            variant="rectangular"
            sx={{ width: "100%", height: "100px", borderRadius: "20px" }}
          />
        ) : (
          <div
            className="consulting-container"
            style={{ marginBottom: "20px" }}
          >
            <div className="consulting-btn-container">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {profileData?.consultingPrice && (
                  <span className="service-name">Consulting Now</span>
                )}
                {/* If there's a skillSet, display them as badges */}
                <div className="issue-badge mt-2">
                  {profileData?.skillSet?.map((skill, index) => (
                    <div className="badge p-2" key={index}>
                      {skill.skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hide Chat/Meet if I'm viewing my own profile */}
              {!editable && (
                <div className="consulting-btn">
                  <button
                    onClick={() => navigate("/mychat")}
                    className="chat-btn"
                  >
                    <MdChat /> Chat
                  </button>
                  <button
                    onClick={() => setInterviewScheduled(true)}
                    className="chat-btn"
                    disabled={!isInitialized}
                  >
                    <MdCalendarToday /> Meet
                  </button>
                </div>
              )}

              {profileData?.consultingPrice && (
                <span className="consultant-price">
                  ₹{profileData.consultingPrice}/minute
                </span>
              )}
            </div>

            <Box
              sx={{
                marginTop: "0px",
                marginLeft: "3px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Tooltip title="View Previous Calls" arrow>
                <Button
                  onClick={openScheduledCallsModal}
                  variant="contained"
                  startIcon={<FaRegClock size={20} />}
                  sx={{
                    backgroundColor: "#e8f4ff",
                    color: "#003366",
                    border: "1px solid #003366",
                    borderRadius: "24px",
                    padding: "8px 16px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#d4ebff",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  Calls
                </Button>
              </Tooltip>
            </Box>
          </div>
        )}

        {profileLoading ? (
          <Skeleton
            animation="pulse"
            variant="rectangular"
            sx={{
              width: "100%",
              height: "200px",
              borderRadius: "20px",
              marginTop: "20px",
            }}
          />
        ) : (
          <div className="service-container">
            <h4>Service</h4>
            {profileData?.serviceDetails?.length > 0 ? (
              <div className="service-list" style={{ cursor: "pointer" }}>
                {profileData.serviceDetails.map((item, index) => (
                  <div
                    onClick={() => handleService(item)}
                    className="service-item"
                    key={`${item.serviceName}-${index}`}
                  >
                    <span className="service-name">{item.serviceName}</span>
                    <p>
                      {item.serviceDescription.slice(0, 70)}
                      {item.serviceDescription.length > 70 ? "..." : ""}
                    </p>

                    {/* If user is "intern", show internship fields */}
                    {profileData?.type?.toLowerCase() === "intern" ? (
                      <>
                        <div className="price-duration-container">
                          <span className="service-duration">
                            <strong>Availability:</strong> {item.availability}
                            {item.availability === "part time" &&
                              item.hoursPerDay && (
                                <> / {item.hoursPerDay} hours/day</>
                              )}
                          </span>
                        </div>
                        <div className="price-duration-container">
                          <span>
                            <strong>Start:</strong>{" "}
                            {formatDateGeneric(item.startDate)}
                          </span>
                          <span style={{ marginLeft: "10px" }}>
                            <strong>End:</strong>{" "}
                            {formatDateGeneric(item.endDate)}
                          </span>
                        </div>
                      </>
                    ) : (
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
                <FaRegFolderOpen
                  size={50}
                  color="#ccc"
                  style={{ marginBottom: "10px" }}
                />
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
                  variant="rectangle"
                  sx={{
                    width: "100%",
                    height: "50px",
                    marginTop: "20px",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <ul
                  className="nav nav-pills single-mentor-tab"
                  id="mentor-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="mentor-course-tab-btn"
                      data-bs-toggle="pill"
                      data-bs-target="#course-content"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Work Experience
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="student-tab-btn"
                      data-bs-toggle="pill"
                      data-bs-target="#education-content"
                      type="button"
                      role="tab"
                      aria-selected="false"
                      tabIndex="-1"
                    >
                      Education
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="reviews-tab-btn"
                      data-bs-toggle="pill"
                      data-bs-target="#projects-content"
                      type="button"
                      role="tab"
                      aria-selected="false"
                      tabIndex="-1"
                    >
                      Projects
                    </button>
                  </li>
                </ul>
              )}

              <div className="tab-content" id="mentor-tab-content">
                {/* Work Experience Tab */}
                <div
                  className="tab-pane fade show active mt-16"
                  id="course-content"
                  role="tabpanel"
                >
                  {profileLoading ? (
                    <Skeleton
                      animation="pulse"
                      variant="rectangular"
                      sx={{
                        width: "100%",
                        height: "200px",
                        borderRadius: "20px",
                        marginTop: "20px",
                      }}
                    />
                  ) : profileData?.workExperience?.length > 0 ? (
                    profileData.workExperience.map((work, index) => (
                      <div
                        className="experience-sec"
                        key={`${work?.role}-${index}`}
                      >
                        <div className="work-logo-container">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/10655/10655913.png"
                            className="educ-logo"
                            alt="Company Logo"
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{work?.role}</h4>
                          <p>
                            {work?.companyName} |{" "}
                            {formatDateGeneric(work?.startDate)} -{" "}
                            {formatDateGeneric(work?.endDate)}
                          </p>
                          <button
                            className="desc-btn"
                            onClick={() => toggleWorkDesc(index)}
                          >
                            {workOpen[index]
                              ? "Hide Description"
                              : "View Description"}
                          </button>
                          {workOpen[index] && (
                            <div className="w-full" style={{ marginTop: 5 }}>
                              {work?.description || "No description available"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <FaRegFolderOpen
                        size={50}
                        color="#ccc"
                        style={{ marginBottom: "10px" }}
                      />
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
                      animation="pulse"
                      variant="rectangular"
                      sx={{
                        width: "100%",
                        height: "200px",
                        borderRadius: "20px",
                        marginTop: "20px",
                      }}
                    />
                  ) : profileData?.educationDetails?.length > 0 ? (
                    profileData.educationDetails.map((educ, index) => (
                      <div className="experience-sec" key={`educ-${index}`}>
                        <div className="work-logo-container">
                          <img
                            src="https://cdn.vectorstock.com/i/1000x1000/14/68/education-color-icon-vector-29051468.jpg"
                            className="educ-logo"
                            alt="Education Logo"
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{educ?.degree}</h4>
                          <h6>Stream: {educ?.stream}</h6>
                          <p>{educ?.college}</p>
                          <p>
                            {formatDateGeneric(educ?.startDate)} -{" "}
                            {formatDateGeneric(educ?.endDate)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <FaRegFolderOpen
                        size={50}
                        color="#ccc"
                        style={{ marginBottom: "10px" }}
                      />
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
                      animation="pulse"
                      variant="rectangular"
                      sx={{
                        width: "100%",
                        height: "200px",
                        borderRadius: "20px",
                        marginTop: "20px",
                      }}
                    />
                  ) : profileData?.projectDetails?.length > 0 ? (
                    profileData.projectDetails.map((project, index) => (
                      <div className="experience-sec" key={`project-${index}`}>
                        <div className="work-logo-container">
                          <img
                            src="https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg"
                            className="educ-logo"
                            alt="Project Logo"
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{project?.projectName}</h4>
                          {project?.techstack &&
                            project?.techstack.length > 0 && (
                              <div>
                                <b>Tech Stack:</b>{" "}
                                {project.techstack.map((item, idx) => (
                                  <span key={idx}>
                                    {item}
                                    {idx !== project.techstack.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                              </div>
                            )}
                          <div className="desc-view-btn-container">
                            {project?.liveDemo && (
                              <a
                                href={project?.liveDemo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-btn"
                              >
                                Live Link
                              </a>
                            )}
                            <button
                              className="desc-btn"
                              onClick={() => toggleProjectDesc(index)}
                            >
                              {projectOpen[index]
                                ? "Hide Description"
                                : "View Description"}
                            </button>
                          </div>
                          {projectOpen[index] && (
                            <div className="w-full" style={{ marginTop: 5 }}>
                              {project?.description ||
                                "No description available"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <FaRegFolderOpen
                        size={50}
                        color="#ccc"
                        style={{ marginBottom: "10px" }}
                      />
                      <p>No projects found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scheduling Interview Modal */}
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
        <Modal.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
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
                      <Form.Group controlId="description">
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Enter description for the call (optional)"
                          value={description}
                          onChange={handleDescriptionChange}
                          className="form-control"
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
                            width={50}
                            height={50}
                            alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                            className="me-3"
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
