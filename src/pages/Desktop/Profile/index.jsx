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
import { Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import ScheduledCallsModal from "./ScheduledCallsModal";
import { Box, Tooltip, IconButton, Chip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import useAuthState from "../../../hooks/Authentication/useAuthState";
import Layout from "../../../components/SEO/Layout";

import { Button as ButtonM } from "@mui/material";

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
import { useInvites } from "../../../hooks/Teams/useInvites";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Bell } from "lucide-react";


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
  const [invitations, setInvitations] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchInvites = async () => {
      if (!uid) return;
      const q = query(collection(db, "invites"), where("to", "==", uid));
      const querySnapshot = await getDocs(q);
      const invites = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInvitations(invites);
    };
    fetchInvites();
  }, [uid]);

  const toggleWorkDesc = (index) =>
    setWorkOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleProjectDesc = (index) =>
    setProjectOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleServiceDesc = (index) =>
    setServiceOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const [isInvited, setIsInvited] = useState(false);

  // Hook to fetch this user’s data
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);

  useEffect(() => {
    if (profileData) {
      if (profileData.type == "entrepreneur") {
        navigate(`/entrepreneur/${profileData.uid}`);
      }
    }
  }, [profileData]);
  const { sendInvite, checkInvited } = useInvites();
  const { userData: currentUser, loading: currentUserLoading } =
    useFetchUserData();

  useEffect(() => {
    async function checkIfInvited() {
      const inv = await checkInvited(uid, currentUser.uid);
      setIsInvited(inv);
    }
    if (currentUser) {
      checkIfInvited();
    }
  }, [currentUser]);

  const handleChatClick = () => {
    if (user) {
      navigate("/mychat"); // Redirect to chat page if logged in
    } else {
      navigate("/signin"); // Redirect to sign-in page if not logged in
    }
  };

  // Add these new states at the top of the component, near other state declarations
  const [meetScheduled, setMeetScheduled] = useState(false);
  const [meetDate, setMeetDate] = useState(dayjs());
  const [meetTime, setMeetTime] = useState(dayjs());
  const [meetDescription, setMeetDescription] = useState("");
  const [currentMeetStep, setCurrentMeetStep] = useState(1);
  const [inviting, setInviting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shortlistDescription, setShortlistDescription] = useState("");

  const handleSendInvite = async () => {
    setInviting(true);
    try {
      await sendInvite(uid, currentUser.uid, shortlistDescription);
      setIsInvited(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error sending invite:", error);
    } finally {
      setInviting(false);
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShortlistDescription("");
  };

  // Modify handleMeetClick to open meet scheduling modal
  const handleMeetClick = () => {
    if (user) {
      setMeetScheduled(true);
    } else {
      navigate("/signin");
    }
  };

  // Add a new function to handle meet scheduling
  const handleScheduleMeet = async () => {
    try {
      if (!isInitialized) {
        toast.error("Google Calendar not ready. Please try again.");
        return;
      }
      await signIn();
      const startDateTime = meetDate
        .hour(meetTime.hour())
        .minute(meetTime.minute())
        .second(0)
        .toISOString();
      const endDateTime = dayjs(startDateTime).add(30, "minute").toISOString();

      const eventData = {
        title: "XTERN Mentorship Meet",
        description: `
        Online Meet with ${profileData?.firstName} ${profileData?.lastName}
        Host: ${currentUser?.firstName} ${currentUser?.lastName}
        Date: ${meetDate.format("D MMM YYYY")}
        Time: ${meetTime.format("h:mm A")}
        Description: ${meetDescription || "N/A"}
      `,
        startDateTime,
        endDateTime,
        attendees: [
          { email: currentUser?.email },
          { email: profileData?.email },
        ],
        callId: `meet-${Date.now()}`,
        hostUserId: currentUser?.uid,
        recipientUserId: profileData?.uid,
        callType: "video",
        location: "Online",
      };

      const response = await createEvent(eventData);

      setCurrentMeetStep(1);
      setMeetDate(dayjs());
      setMeetTime(dayjs());
      setMeetDescription("");
      setMeetScheduled(false);
      window.open(response.eventLink, "_blank");
      toast.success("Meet scheduled and event opened.");
    } catch (err) {
      console.error(err);
      toast.error("Error scheduling meet.");
    }
  };

  // Example: fetching other users by type
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useFetchUsersByType("Developer");

  // Current user

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
  } = useScheduledCallsForUser(uid);

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
      // navigate("/userdetail");
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
          Mentorship Call with ${profileData?.firstName} ${profileData?.lastName
          }
          Host: ${currentUser?.firstName} ${currentUser?.lastName}
          Date: ${interviewDate.format("D MMM YYYY")}
          Time: ${interviewTime.format("h:mm A")}
          Description: ${description || "N/A"}
          Meet Link: <a href="https://xpert.works/myvideocall">Join Meeting</a>
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
    serializableItem.uid = uid;
    navigate("/service/" + item.id, { state: { item: serializableItem } });
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

  // Config object to control clickability based on user type
  const SERVICE_CLICK_RESTRICTIONS = {
    intern: true, // Interns cannot click
    // Add more user types here as needed
  };
  return (
    <>
      <Layout
        title={profileData?.firstName ? profileData.firstName : "User Profile"}
        description={
          profileData?.firstName
            ? `Profile page of ${profileData.firstName}, view and manage account details.`
            : "User profile page to view and manage account details."
        }
        keywords={
          "user profile, account, settings, personal details, dashboard"
        }
      />


      <div key={uid} className="desktop-profile-container">
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
                  {currentUser?.type === "entrepreneur" && (
                    <>
                      {isInvited ? (
                        <ButtonM
                          sx={{ marginTop: "10px" }}
                          variant="contained"
                          disabled
                        >
                          Shortlisted
                        </ButtonM>
                      ) : (
                        <>
                          <ButtonM
                            disabled={inviting}
                            onClick={handleOpenModal}
                            variant="contained"
                            sx={{
                              marginTop: "10px",
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            {inviting && (
                              <>
                                <div className="spinner-border spinner-border-sm"></div>
                              </>
                            )}
                            Shortlist
                          </ButtonM>
                          <Dialog
                            open={isModalOpen}
                            onClose={handleCloseModal}
                            maxWidth="sm"
                            fullWidth
                          >
                            <DialogTitle>Add Shortlist Description</DialogTitle>
                            <DialogContent>
                              <TextField
                                autoFocus
                                margin="dense"
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={shortlistDescription}
                                onChange={(e) => setShortlistDescription(e.target.value)}
                                variant="outlined"
                                placeholder="Enter description for the shortlist invitation..."
                              />
                            </DialogContent>
                            <DialogActions sx={{ padding: 2, gap: 1 }}>
                            <ButtonM
                              onClick={handleCloseModal}
                              variant="contained"
                              sx={{
                                backgroundColor: 'red',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'darkred',
                                },
                              }}
                            >
                              Cancel
                            </ButtonM>
                            <ButtonM
                              onClick={handleSendInvite}
                              variant="contained"
                              disabled={inviting || !shortlistDescription.trim()}
                              startIcon={inviting ? <CircularProgress size={20} /> : null}
                              sx={{
                                backgroundColor: 'blue',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'darkblue',
                                },
                              }}
                            >
                              {inviting ? 'Sending...' : 'Send Invite'}
                            </ButtonM>
                          </DialogActions>

                          </Dialog>
                        </>
                      )}
                    </>
                  )}
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

              {profileLoading === false &&
                currentUserLoading == false &&
                currentUser?.uid === uid && (
                  <>
                    {callsLoading ? (
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          width: "100%",
                          height: "350px",
                          marginTop: "20px",
                        }}
                      ></Skeleton>
                    ) : (
                      calls.length > 0 && (
                        <>
                          {" "}
                          <div className="flex flex-col gap-2 rounded-[10px] border border-[#e5e5e5] mt-[20px] p-[10px]">
                            <div className="font-normal text-2xl  flex items-start justify-center ">
                              <div>Upcoming meets</div>
                            </div>

                            {calls.slice(0, 3).map((call) => {
                              const dateTime = dayjs(call.scheduledDateTime);
                              return (
                                <div
                                  onClick={() =>
                                    window.open(call.eventLink, "_blank")
                                  }
                                  className="flex cursor-pointer hover:bg-black/10 gap-2 min-h-[50px] items-stretch w-full border-none p-1 h-fit  border-[#e5e5e5] rounded-[10px]"
                                  key={call.callId}
                                >
                                  <div className="size-[50px] shrink-0 relative flex items-center justify-center rounded-full overflow-hidden">
                                    <img
                                      src={call.recipient.photo_url}
                                      className="absolute left-0 top-0 size-full object-cover"
                                      alt=""
                                    />
                                  </div>
                                  <div className="w-full flex flex-col items-start">
                                    <div className="text-left">
                                      {call.recipient.firstName}{" "}
                                      {call.recipient.lastName}{" "}
                                      <span className="text-black/70 ">
                                        | {call.recipient.type}
                                      </span>
                                    </div>
                                    <div className="text-left">
                                      {dateTime.format(" h:mm A, MMMM D, YYYY")}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            <ButtonM
                              variant="contained"
                              onClick={() => setCallsModalOpen(true)}
                            >
                              View all
                            </ButtonM>
                          </div>
                        </>
                      )
                    )}
                  </>
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

              {profileLoading === false &&
                currentUserLoading == false &&
                currentUser?.uid === uid && (
                  <>
                    <div className="upcoming-meets-container">
                      <Tooltip title="View Previous Calls" arrow>
                        <button
                          onClick={openScheduledCallsModal}
                          className="upcoming-meets-btn"
                        >
                          <FaRegClock /> Upcoming Meets
                        </button>
                      </Tooltip>
                    </div>
                  </>
                )}
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
                  {profileData.serviceDetails.map((item, index) => {
                    const isRestricted =
                      SERVICE_CLICK_RESTRICTIONS[
                      profileData?.type?.toLowerCase()
                      ];

                    return (
                      <div
                        onClick={() => !isRestricted && handleService(item)} // Prevent click if restricted
                        className="service-item"
                        key={index}
                        style={{
                          cursor: isRestricted ? "not-allowed" : "pointer",
                          padding: "10px",
                          border: "1px solid #ddd",
                          transition: "box-shadow 0.3s, background-color 0.3s",
                        }}
                      >
                        <span className="service-name">{item.serviceName}</span>

                        {/* **Interactive Description with Tooltip** */}
                        <Tooltip title={item.serviceName} arrow placement="top">
                          <div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item?.serviceDescription,
                              }}
                              className="pointer-events-none saturate-0 no-underline max-h-[70px] overflow-hidden"
                            ></div>
                          </div>
                        </Tooltip>

                        {profileData?.type?.toLowerCase() === "intern" ? (
                          /* **1. Compact Badge for Interns** */
                          <Chip
                            label={`Avail: ${item.availability}, ${item.hoursPerDay
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
                          <div className="price-duration-container !mt-auto">
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
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{ textAlign: "center", marginTop: "20px" }}
                  className="No-work"
                >
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
                    className="tab-pane fade show active "
                    id="course-content"
                    role="tabpanel"
                  >
                    {profileLoading ? (
                      <Skeleton sx={{ width: "100%", height: "200px" }} />
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
                              src={
                                work?.companyLogo ||
                                "https://cdn-icons-png.flaticon.com/512/10655/10655913.png"
                              }
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
                            <Accordion
                            sx={{
                              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", 
                              borderRadius: "8px",
                              backgroundColor: "#f8f9fa",  // Light grey for better contrast
                              width: "100%", 
                              marginTop: "8px",
                              "&:before": { display: "none" } // Removes the default MUI divider line
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon sx={{ fontSize: "18px", color: "#007bff" }} />}
                              sx={{ padding: "2px 4px", fontWeight: "bold", color: "#333", borderRadius: "5px" }}
                            >
                              <span style={{ fontSize: "14px", fontWeight: "500", color: "#007bff" }}>
                                View Description
                              </span>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: "8px", fontSize: "14px", color: "#444", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" }}>
                              {work?.description || "No description available"}
                            </AccordionDetails>
                          </Accordion>

                            {workOpen[index] && (
                              <div style={{ marginTop: 5 }}>
                                {work?.description ||
                                  "No description available"}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="No-work"
                        style={{ textAlign: "center", marginTop: "20px" }}
                      >
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
                        sx={{
                          width: "100%",
                          height: "200px",
                          marginTop: "20px",
                        }}
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
                      <div
                        className="No-work"
                        style={{ textAlign: "center", marginTop: "20px" }}
                      >
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
                        sx={{
                          width: "100%",
                          height: "200px",
                          marginTop: "20px",
                        }}
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
                              src={
                                project?.projectLogo ||
                                "https://cdn-icons-png.flaticon.com/512/1087/1087815.png"
                              }
                              className="educ-logo"
                              alt="Project Logo"
                              style={{ width: "100px", height: "100px" }}
                            />
                          </div>
                          <div className="experience-info">
                            <h3>{project?.projectName}</h3>
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
                             <Accordion
                            sx={{
                              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", 
                              borderRadius: "8px",
                              backgroundColor: "#f8f9fa",  // Light grey for better contrast
                              width: "100%", 
                              marginTop: "8px",
                              "&:before": { display: "none" } // Removes the default MUI divider line
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon sx={{ fontSize: "18px", color: "#007bff" }} />}
                              sx={{ padding: "2px 4px", fontWeight: "bold", color: "#333", borderRadius: "5px" }}
                            >
                              <span style={{ fontSize: "14px", fontWeight: "500", color: "#007bff" }}>
                                View Description
                              </span>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: "8px", fontSize: "14px", color: "#444", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" }}>
                              {project?.description || "No description available"}
                            </AccordionDetails>
                          </Accordion>

                            {project?.liveDemo && (
                              <Tooltip
                                title={project.liveDemo}
                                arrow
                                placement="top"
                              >
                                <Button
                                  href={project.liveDemo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="live-link-button"
                                  style={{
                                    
                                    marginTop: "10px", // Add spacing between link and description
                                  }}
                                >
                                  Live Link
                                </Button>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{ textAlign: "center", marginTop: "20px" }}
                        className="No-work"
                      >
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
                              <strong>Description:</strong>{" "}
                              {description || "N/A"}
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

        {/* Scheduling Modal */}

        <Modal
          show={meetScheduled}
          onHide={() => {
            setMeetScheduled(false);
            setCurrentMeetStep(1);
            setMeetDate(dayjs());
            setMeetTime(dayjs());
            setMeetDescription("");
          }}
          centered
          size="lg"
          backdrop="static"
          keyboard={false}
          className="custom-meet-modal"
          dialogClassName="modal-90w"
        >
          <Modal.Header className="bg-primary text-white">
            <Modal.Title>Schedule a Meet</Modal.Title>
            <Button
              variant="link"
              onClick={() => {
                setMeetScheduled(false);
                setCurrentMeetStep(1);
                setMeetDate(dayjs());
                setMeetTime(dayjs());
                setMeetDescription("");
              }}
              style={{ color: "white", textDecoration: "none" }}
            ></Button>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Container
              fluid
              style={{
                padding: 10, // Removes internal padding
                margin: 0, // Removes external margin
              }}
              className="border" // Ensure border class is applied if needed
            >
              <Row>
                <Col>
                  <ProgressBar
                    now={(currentMeetStep / 4) * 100}
                    label={`Step ${currentMeetStep} of 4`}
                    className="mb-4"
                    variant="info"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {currentMeetStep === 1 && (
                    <div>
                      <h5>Select Date</h5>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          value={meetDate}
                          onChange={(date) => {
                            setMeetDate(date);
                            setCurrentMeetStep(2);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                  {currentMeetStep === 2 && (
                    <div>
                      <h5>Select Time</h5>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeClock
                          value={meetTime}
                          onChange={(time) => {
                            setMeetTime(time);
                            setCurrentMeetStep(3);
                          }}
                          format="hh:mm A"
                          ampm
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                  {currentMeetStep === 3 && (
                    <div>
                      <h5>Add Description (Optional)</h5>
                      <Form>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Enter meet description..."
                            value={meetDescription}
                            onChange={(e) => setMeetDescription(e.target.value)}
                          />
                        </Form.Group>
                      </Form>
                    </div>
                  )}
                  {currentMeetStep === 4 && (
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
                              style={{ width: "100px", height: "100px" }}
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
                              {meetDate.format("D MMM YYYY")}
                            </p>
                            <p>
                              <strong>Time:</strong> {meetTime.format("h:mm A")}
                            </p>
                            <p>
                              <strong>Description:</strong>{" "}
                              {meetDescription || "N/A"}
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
          <Modal.Footer
            className="bg-white"
            style={{
              padding: "5px",
              margin: "0",
              borderTop: "none",
            }}
          >
            <Container fluid>
              <Row className="w-100 m-0">
                <Col className="d-flex justify-content-between align-items-center p-0">
                  <Button
                    variant="outline-secondary"
                    size="md" // Changed size to medium
                    style={{ padding: "8px 16px", fontSize: "14px" }} // Added custom styles for larger buttons
                    onClick={() => {
                      setMeetScheduled(false);
                      setCurrentMeetStep(1);
                      setMeetDate(dayjs());
                      setMeetTime(dayjs());
                      setMeetDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                  <div>
                    {currentMeetStep > 1 && (
                      <Button
                        variant="outline-primary"
                        size="md" // Changed size to medium
                        className="me-1"
                        style={{ padding: "8px 16px", fontSize: "14px" }} // Added custom styles for larger buttons
                        onClick={() => setCurrentMeetStep(currentMeetStep - 1)}
                      >
                        Back
                      </Button>
                    )}
                    {currentMeetStep < 4 && (
                      <Button
                        variant="primary"
                        size="md" // Changed size to medium
                        style={{ padding: "8px 16px", fontSize: "14px" }} // Added custom styles for larger buttons
                        onClick={() => setCurrentMeetStep(currentMeetStep + 1)}
                        disabled={
                          (currentMeetStep === 1 && !meetDate) ||
                          (currentMeetStep === 2 && !meetTime)
                        }
                      >
                        Next
                      </Button>
                    )}
                    {currentMeetStep === 4 && (
                      <Button
                        variant="success"
                        size="md" // Changed size to medium
                        style={{ padding: "8px 16px", fontSize: "14px" }} // Added custom styles for larger buttons
                        onClick={handleScheduleMeet}
                        disabled={scheduleLoading}
                      >
                        {scheduleLoading ? "Scheduling..." : "Schedule Meet"}
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Container>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default SingleMentor;