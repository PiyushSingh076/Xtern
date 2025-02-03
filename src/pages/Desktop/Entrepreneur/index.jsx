import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Profile.css";
import useSaveEntrepreneurDetails from "../../../hooks/Auth/useSaveEntrepreneurDetailsFirebaseData";
import "react-circular-progressbar/dist/styles.css";
import Skeleton from "@mui/material/Skeleton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button as ButtonM,
  Chip,
  IconButton,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import useRegisterUser from "../../../hooks/Stream/client";
import { FaClock } from "react-icons/fa";
import { MdEdit, MdChat, MdCalendarToday, MdClose } from "react-icons/md";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useFetchUsersByType from "../../../hooks/Profile/useFetchUsersByType";
import useGoogleCalendar from "../../../hooks/Profile/useGoogleCalendar";
import useScheduledCallsForUser from "../../../hooks/Profile/useScheduledCallsForUser";
import toast from "react-hot-toast";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Modal,
  Button,
  ProgressBar,
  Form,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";

import { Box, Tooltip } from "@mui/material";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { useEntrepreneurDetails } from "../../../hooks/Entrepreneur/useEntrepreneurDetails";
import { LinkedIn } from "@mui/icons-material";
import Layout from "../../../components/SEO/Layout";

const SingleMentor = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [interviewDate, setInterviewDate] = useState(dayjs());
  const [interviewTime, setInterviewTime] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [editable, setEditable] = useState(true);
  const [callsModalOpen, setCallsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const currentUser = auth.currentUser;
  
  const { uid } = useParams();
  const { loading: profileLoading, userData: profileData } =
    useEntrepreneurDetails(uid);

  useEffect(() => {
    if(profileData){
      // console.log(profileData);
      if(profileData.type !== "entrepreneur"){
        toast.error("Entrepreneur not found")
        navigate("/homescreen/")
      }
    }
  }, [profileData]);

  const {
    signIn,
    createEvent,
    deleteEvent,
    loading: scheduleLoading,
    isInitialized,
  } = useGoogleCalendar();
  // const {
  //   calls,
  //   loading: callsLoading,
  //   error: callsError,
  // } = useScheduledCallsForUser(currentUser?.uid);
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

        👤 Host: ${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.email
          })
        👥 Recipient: ${profileData?.firstName} ${profileData?.lastName} (${profileData?.email
          })

        📅 Date: ${interviewDate.format("D MMM YYYY")}
        ⏰ Time: ${interviewTime.format("h:mm A")}
        ⏳ Duration: 30 minutes
        📝 Description: ${description || "N/A"}

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

  const handleService = (item) => {
    const serializableItem = {
      serviceName: item.serviceName,
      serviceDescription: item.serviceDescription,
      serviceDuration: item.serviceDuration,
      serviceDurationType: item.serviceDurationType,
      servicePrice: item.servicePrice,
    };
    navigate("/service", { state: { item: serializableItem } });
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkedIcon = () => {
    setIsBookmarkedIcon(!isBookmarkedIcon);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const openScheduledCallsModal = () => {
    setCallsModalOpen(true);
  };

  const closeScheduledCallsModal = () => {
    setCallsModalOpen(false);
  };

  /**
   * Handle deletion of a scheduled call
   * @param {string} eventId - Google Calendar Event ID
   * @param {string} callDocId - Firestore Document ID
   */
  const handleDeleteEvent = async (eventId, callDocId) => {
    try {
      await deleteEvent(eventId, callDocId);
      // Optionally, remove the deleted call from the local state
      // This depends on how you manage your state (e.g., using hooks)
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred while deleting the event.");
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

  const handleEdit = () => {
    if (profileData?.type) {
      const sanitized = JSON.parse(JSON.stringify(profileData));
      navigate("/entrepreneurdetails", { state: { profileData: sanitized } });
    } else {
      // navigate("/userdetail");
    }
  };

  return (
    <>
    <Layout 
      title={profileData?.firstName ? profileData.firstName : "Entrepreneur's Profile"} 
      keywords={"entrepreneur,user profile, account, settings, entrepreneurdetails, dashboard"} 
      description={`Profile page of ${profileData?.firstName}, view and manage account details.`} 
    />

    <div className="desktop-profile-container">
      {/* Profile details section */}
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
                <div className="mentor-img-sec"
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
                    <Skeleton
                      variant="circular"
                      width={150}
                      height={150}
                      animation="wave"
                    />
                  ) : (
                    <div className="size-[150px] ">
                      <img
                        src={profileData?.photo_url || "/default-profile.png"}
                        alt={`${profileData?.firstName} ${profileData?.lastName}`}
                        className="size-full  left-0 top-0 object-cover"
                        onError={(e) => (e.target.src = "/default-profile.png")}
                      />
                    </div>
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
                    <div className="flex flex-col justify-center items-center">
                      <div>Years of Experience: {profileData?.experience}</div>
                      <IconButton
                        className="size-[40px]"
                        sx={{color: "#0A66C2"}}
                        onClick={() => window.open(profileData.linkedinProfileUrl)}
                      >
                        <LinkedIn></LinkedIn>
                        
                      </IconButton>
                    </div>
                  )}

                  {profileLoading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ fontSize: "1rem", width: "100px", height: "20px" }}
                    />
                  ) : (
                    <p className="badge-type">{profileData.industry}</p>
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
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {profileData?.skills?.map((item) => {
                    return <Chip label={item.name}></Chip>;
                  })}
                </div>
                {!profileData?.skills && <span>No skill set available</span>}
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
          // profileData?.type !== "Intern" && (
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
              </div>

              <div className="consulting-btn !w-full !mb-0">
                {currentUser.uid === uid && (
                  <>
                    <button
                      className="chat-btn"
                      onClick={() => navigate("/createjob")}
                    >
                      Create job
                    </button>
                    <button onClick={() => navigate("/jobpostings")} className="chat-btn">View jobs</button>
                  </>
                )}
                {/* <button
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
                </button> */}
              </div>
            </div>

            {/* Modified "View Previous Calls" button as a badge-like style */}
          </div>
          // )
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
                  className="nav nav-pills single-mentor-tab overflow-hidden"
                  id="mentor-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="mentor-course-tab-btn"
                      data-bs-toggle="pill"
                      data-bs-target="#company-content"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Company Details
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="mentor-course-tab-btn"
                      data-bs-toggle="pill"
                      data-bs-target="#job-content"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      Job Postings
                    </button>
                  </li>
                </ul>
              )}

              <div className="tab-content" id="mentor-tab-content">
                {/* Company Details tab */}
                <div
                  className="tab-pane fade show active mt-0"
                  id="company-content"
                  role="tabpanel"
                >
                  {profileLoading ? (
                    <></>
                  ) : ( profileData &&
                    <>
                      <div
                        className="experience-sec"
                        key={`${profileData.companyDetails?.name}`}
                      >
                        <div className="size-[60px] rounded-full shrink-0 overflow-hidden mr-4 relative">
                          <img

                            src={profileData.companyDetails.logo}
                            alt="Company Logo"
                            className="absolute inset-0 w-full h-full object-cover"

                          />
                        </div>

                        <div className="experience-info">
                          <h4>{profileData.companyDetails?.name}</h4>
                          {/* <p>
                          {dayjs.unix(company?.startDate).format("D MMM YYYY")}{" "}
                          -{" "}
                          --
                          {company.endDate === "present"
                            ? "Now"
                            : dayjs.unix(company.endDate).format("D MMM YYYY")}
                        </p> */}
                          <h4 className="text-black/60">
                            {profileData.companyDetails?.description}
                          </h4>
                          {/* <h4>{dayjs(new Timestamp(profileData.companyDetails.startDate.seconds, profileData.companyDetails.startDate.nanoseconds).toDate()).format("D MMM YYYY")}</h4> */}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Projects Tab */}
                <div className="tab-pane fade" id="job-content" role="tabpanel">
                  {/* <Link to="/jobpostings">Your job postings</Link> */}
                  {profileData?.jobPostings?.map((job, index) => (
                    <div
                      className="experience-sec flex !items-start"
                      key={`project-${index}`}
                    >
                      <div className="size-[100px] shrink-0 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={job.image}
                          className="absolute size-[80px] object-cover"
                          alt=""
                        />
                      </div>
                      <div className="w-full h-full">
                        <div className="experience-info">
                          <h4>{job?.title}</h4>
                          <b>{job.companyName}</b>
                          <div>
                            <b>Skills:</b>
                            {job?.skills?.map((item, idx) => (
                              <span key={idx}>
                                {item}
                                {idx !== job.skills.length - 1 && ", "}
                              </span>
                            )) || "No tech stack available"}
                          </div>
                          <Accordion
                            sx={{
                              width: "100%",
                              borderRadius: "10px",
                              boxShadow: "none",
                            }}
                          >
                            <AccordionSummary>Description</AccordionSummary>
                            <AccordionDetails>
                              {job.description}
                            </AccordionDetails>
                          </Accordion>

                          <div className="desc-view-job-btn-container ml-auto">
                            {currentUser.uid != profileData.uid ? (
                              <>
                                <button onClick={() => navigate(`/jobs/${job.jobId}`)} className="desc-btn ml-auto">
                                  Apply
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    navigate(`/viewjob/${job.jobId}`)
                                  }
                                  className="desc-btn ml-auto"
                                >
                                  View Job
                                </button>
                              </>
                            )}
                          </div>
                          <div
                            id={`project-collapse-${job.jobId}`}
                            className="collapse"
                            aria-labelledby={`project-collapse-${index}`}
                          >
                            <div className="card card-body">
                              {job?.description || "No description available"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
      {/* <ScheduledCallsModal
        open={callsModalOpen}
        onClose={closeScheduledCallsModal}
        loading={callsLoading}
        calls={calls}
        error={callsError}
        onDeleteEvent={handleDeleteEvent}
      /> */}
    </div>
    </>
  );
};

export default SingleMentor;
