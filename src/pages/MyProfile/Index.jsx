// src/Components/Profile/MobileSingleMentor.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SkillSet from "./SkillSet";
import Acadamic from "./Acadamic";
import MainProfile from "./MainProfile";
import Skeleton from "@mui/material/Skeleton";
import { MdEdit, MdChat, MdCalendarToday, MdClose } from "react-icons/md";
import { FaClock, FaRegClock, FaRegFolderOpen } from "react-icons/fa";
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
import dayjs from "dayjs";
import {
  Box,
  Tooltip,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShareIcon from "@mui/icons-material/Share";
import toast from "react-hot-toast";
import useUserProfileData from "../../hooks/Profile/useUserProfileData";
import useFetchUsersByType from "../../hooks/Profile/useFetchUsersByType";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import useGoogleCalendar from "../../hooks/Profile/useGoogleCalendar";
import useScheduledCallsForUser from "../../hooks/Profile/useScheduledCallsForUser";
import ScheduledCallsModal from "../Desktop/Profile/ScheduledCallsModal";

/**
 * Utility functions
 */
function formatDateGeneric(value) {
  if (!value) return "N/A";
  if (typeof value === "string") {
    if (value.toLowerCase() === "present") {
      return "Present";
    }
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("D MMM YYYY") : value;
  }
  return "N/A";
}

function formatExperience(expValue) {
  const parsed = parseInt(expValue || "0", 10);
  if (parsed <= 0) return "Less than 1";
  return parsed.toString();
}

const MobileSingleMentor = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const role = useSelector((state) => state.role);

  // State declarations
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
  const [serviceOpen, setServiceOpen] = useState({});

  const toggleWorkDesc = (index) =>
    setWorkOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleProjectDesc = (index) =>
    setProjectOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleServiceDesc = (index) =>
    setServiceOpen((prev) => ({ ...prev, [index]: !prev[index] }));

  // Hooks for data fetching
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useFetchUsersByType("Developer");

  const { userData: currentUser } = useFetchUserData();

  const {
    signIn,
    createEvent,
    deleteEvent,
    loading: scheduleLoading,
    isInitialized,
  } = useGoogleCalendar();

  const {
    calls,
    loading: callsLoading,
    error: callsError,
  } = useScheduledCallsForUser(currentUser?.uid);

  // Editable state
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    if (currentUser && currentUser.uid === uid) setEditable(true);
    else setEditable(false);
  }, [currentUser, uid]);

  // Redirect if no profile type
  useEffect(() => {
    if (!profileLoading && (!profileData?.type || profileData?.type === "")) {
      navigate("/userdetail");
    }
  }, [profileLoading, profileData, navigate]);

  // Handle Edit
  const handleEdit = () => {
    if (profileData?.type) {
      const sanitized = JSON.parse(JSON.stringify(profileData));
      navigate("/userdetail", { state: { profileData: sanitized } });
    } else {
      navigate("/userdetail");
    }
  };

  // Scheduling call handlers
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

  // Handle Service Click
  const handleService = (item) => {
    const serializableItem = JSON.parse(JSON.stringify(item));
    navigate("/project", { state: { item: serializableItem } });
  };

  // Share Profile
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Profile link copied!"))
      .catch(() => toast.error("Failed to copy link."));
  };

  // Delete Event
  const handleDeleteEvent = async (eventId, callDocId) => {
    try {
      await deleteEvent(eventId, callDocId);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting event.");
    }
  };

  // Open/Close Scheduled Calls Modal
  const openScheduledCallsModal = () => setCallsModalOpen(true);
  const closeScheduledCallsModal = () => setCallsModalOpen(false);

  // Navigate Back
  const handleBackClick = () => {
    navigate(-1);
  };

  // Render fallback for errors
  if (profileError) {
    return (
      <section id="single-mentor-sec" style={{ padding: "20px" }}>
        <div className="container">
          <h2>An error occurred while loading the profile.</h2>
          <Button onClick={handleBackClick} variant="primary">
            Go Back
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="mobile-header" style={styles.header}>
        <IconButton onClick={handleBackClick}>
          <MdClose size={24} />
        </IconButton>
        {editable && (
          <IconButton onClick={handleEdit}>
            <MdEdit size={24} />
          </IconButton>
        )}
      </div>

      {/* Main Content Section */}
      <section id="single-mentor-sec" style={styles.container}>
        <div className="single-mentor-sec-wrap">
          {/* Profile Information */}
          {profileLoading ? (
            <Skeleton variant="rounded" width={"100%"} height={"300px"} />
          ) : (
            <MainProfile userdata={profileData} loading={profileLoading} />
          )}

          {/* Share Button */}
          <Box sx={{ textAlign: "right", marginTop: "10px" }}>
            <Tooltip title="Share Profile" arrow>
              <IconButton onClick={handleShare} color="primary">
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Consulting Section */}
          {profileLoading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"100px"}
              sx={{ marginTop: "20px" }}
            />
          ) : (
            <div style={styles.consultingContainer}>
              <div style={styles.consultingInfo}>
                {profileData?.consultingPrice && (
                  <span style={styles.consultingPrice}>
                    ₹{profileData.consultingPrice}/minute
                  </span>
                )}
                <div style={styles.badges}>
                  {profileData?.skillSet?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.skill}
                      size="small"
                      color="primary"
                      style={{ marginRight: "5px", marginBottom: "5px" }}
                    />
                  ))}
                </div>
              </div>
              {!editable && (
                <div style={styles.consultingButtons}>
                  <Button
                    onClick={() => navigate("/mychat")}
                    variant="outline-primary"
                    size="small"
                    style={{ marginRight: "10px" }}
                  >
                    <MdChat size={20} /> Chat
                  </Button>
                  <Button
                    onClick={() => setInterviewScheduled(true)}
                    variant="outline-success"
                    size="small"
                    disabled={!isInitialized}
                  >
                    <MdCalendarToday size={20} /> Meet
                  </Button>
                </div>
              )}
              <Button
                onClick={openScheduledCallsModal}
                variant="contained"
                startIcon={<FaRegClock size={16} />}
                size="small"
                style={{ marginTop: "10px" }}
              >
                Calls
              </Button>
            </div>
          )}

          {/* Skills Section */}
          {profileLoading ? (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"150px"}
              sx={{ marginTop: "20px" }}
            />
          ) : (
            <SkillSet profileData={profileData} />
          )}

          {/* Services Section */}
          {profileLoading ? (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"200px"}
              sx={{ marginTop: "20px" }}
            />
          ) : (
            <div style={styles.serviceContainer}>
              <h4>Services</h4>
              {profileData?.serviceDetails?.length ? (
                profileData.serviceDetails.map((item, index) => (
                  <Accordion key={index} style={styles.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                    >
                      <div style={styles.serviceHeader}>
                        <span>{item.serviceName}</span>
                        {profileData?.type?.toLowerCase() === "intern" ? (
                          <Chip
                            label={`Avail: ${item.availability}, ${
                              item.hoursPerDay
                            }h/day | ${formatDateGeneric(
                              item.startDate
                            )}, ${formatDateGeneric(item.endDate)}`}
                            size="small"
                            color="primary"
                          />
                        ) : (
                          <div style={styles.priceDuration}>
                            {item.serviceDuration && (
                              <span style={styles.serviceDuration}>
                                <FaClock /> {item.serviceDuration}{" "}
                                {item.serviceDurationType}
                              </span>
                            )}
                            {item.servicePrice && (
                              <span style={styles.servicePrice}>
                                ₹{item.servicePrice}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>
                        {item.serviceDescription || "No description available"}
                      </p>
                      <Button
                        onClick={() => handleService(item)}
                        variant="link"
                        size="small"
                      >
                        View Service
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <div style={styles.noDataContainer}>
                  <FaRegFolderOpen size={50} color="#ccc" />
                  <p>No services available</p>
                </div>
              )}
            </div>
          )}

          {/* Academic and Other Sections */}
          {profileLoading ? (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"350px"}
              sx={{ marginTop: "20px" }}
            />
          ) : (
            <Acadamic profileData={profileData} />
          )}

          {/* Work Experience, Education, Projects Tabs */}
          {profileLoading ? (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"300px"}
              sx={{ marginTop: "20px" }}
            />
          ) : (
            <div style={styles.tabSection}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="work-content"
                  id="work-header"
                >
                  <h5>Work Experience</h5>
                </AccordionSummary>
                <AccordionDetails>
                  {profileData?.workExperience?.length ? (
                    profileData.workExperience.map((work, index) => (
                      <div key={index} style={styles.experienceSec}>
                        <Image
                          src="https://cdn-icons-png.flaticon.com/512/10655/10655913.png"
                          alt="Company Logo"
                          roundedCircle
                          width={60}
                          height={60}
                          style={{ marginRight: "10px" }}
                        />
                        <div>
                          <h6>{work?.role}</h6>
                          <p>
                            {work?.companyName} |{" "}
                            {formatDateGeneric(work?.startDate)} -{" "}
                            {formatDateGeneric(work?.endDate)}
                          </p>
                          <Button
                            variant="link"
                            onClick={() => toggleWorkDesc(index)}
                            size="small"
                          >
                            {workOpen[index]
                              ? "Hide Description"
                              : "View Description"}
                          </Button>
                          {workOpen[index] && (
                            <p>
                              {work?.description || "No description available"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.noDataContainer}>
                      <FaRegFolderOpen size={50} color="#ccc" />
                      <p>No work experience found</p>
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="education-content"
                  id="education-header"
                >
                  <h5>Education</h5>
                </AccordionSummary>
                <AccordionDetails>
                  {profileData?.educationDetails?.length ? (
                    profileData.educationDetails.map((educ, index) => (
                      <div key={index} style={styles.experienceSec}>
                        <Image
                          src="https://cdn.vectorstock.com/i/1000x1000/14/68/education-color-icon-vector-29051468.jpg"
                          alt="Education Logo"
                          roundedCircle
                          width={60}
                          height={60}
                          style={{ marginRight: "10px" }}
                        />
                        <div>
                          <h6>{educ?.degree}</h6>
                          <p>Stream: {educ?.stream}</p>
                          <p>{educ?.collegename}</p>
                          <p>
                            {formatDateGeneric(educ?.startyear)} -{" "}
                            {formatDateGeneric(educ?.endyear)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.noDataContainer}>
                      <FaRegFolderOpen size={50} color="#ccc" />
                      <p>No education details found</p>
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="projects-content"
                  id="projects-header"
                >
                  <h5>Projects</h5>
                </AccordionSummary>
                <AccordionDetails>
                  {profileData?.projectDetails?.length ? (
                    profileData.projectDetails.map((project, index) => (
                      <div key={index} style={styles.experienceSec}>
                        <Image
                          src="https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg"
                          alt="Project Logo"
                          roundedCircle
                          width={60}
                          height={60}
                          style={{ marginRight: "10px" }}
                        />
                        <div>
                          <h6>{project?.projectName}</h6>
                          {project?.duration && <p>{project?.duration}</p>}
                          {project?.techstack &&
                            project?.techstack.length > 0 && (
                              <p>
                                <strong>Tech Stack:</strong>{" "}
                                {project.techstack.join(", ")}
                              </p>
                            )}
                          {project?.liveDemo && (
                            <a
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.liveLink}
                            >
                              Live Demo
                            </a>
                          )}
                          <Button
                            variant="link"
                            onClick={() => toggleProjectDesc(index)}
                            size="small"
                          >
                            {projectOpen[index]
                              ? "Hide Description"
                              : "View Description"}
                          </Button>
                          {projectOpen[index] && (
                            <p>
                              {project?.description ||
                                "No description available"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.noDataContainer}>
                      <FaRegFolderOpen size={50} color="#ccc" />
                      <p>No projects found</p>
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          )}
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
        <Modal.Header style={styles.modalHeader}>
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
        <Modal.Body style={styles.modalBody}>
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
                    {/* Date Picker Component */}
                    <Form.Group>
                      <Form.Control
                        type="date"
                        value={interviewDate.format("YYYY-MM-DD")}
                        onChange={(e) =>
                          handleDateChange(dayjs(e.target.value))
                        }
                      />
                    </Form.Group>
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <h5>Select Time</h5>
                    {/* Time Picker Component */}
                    <Form.Group>
                      <Form.Control
                        type="time"
                        value={interviewTime.format("HH:mm")}
                        onChange={(e) =>
                          handleTimeChange(dayjs(e.target.value, "HH:mm"))
                        }
                      />
                    </Form.Group>
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
                            width={60}
                            height={60}
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
                            width={60}
                            height={60}
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
        <Modal.Footer style={styles.modalFooter}>
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
                      size="sm"
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
                      size="sm"
                    >
                      Next
                    </Button>
                  )}
                  {currentStep === 4 && (
                    <Button
                      variant="success"
                      onClick={handleScheduleCall}
                      disabled={scheduleLoading}
                      size="sm"
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
    </>
  );
};

// Inline styles for simplicity. Consider using CSS or styled-components for better management.
const styles = {
  container: {
    padding: "10px",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  consultingContainer: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  consultingInfo: {
    marginBottom: "10px",
  },
  consultingPrice: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "5px",
  },
  consultingButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  serviceContainer: {
    marginTop: "20px",
  },
  accordion: {
    marginBottom: "10px",
  },
  serviceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  priceDuration: {
    display: "flex",
    gap: "10px",
  },
  serviceDuration: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  servicePrice: {
    fontWeight: "bold",
  },
  noDataContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  liveLink: {
    color: "#007bff",
    textDecoration: "none",
    display: "block",
    marginTop: "5px",
  },
  tabSection: {
    marginTop: "20px",
  },
  experienceSec: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "15px",
  },
  modalHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBody: {
    backgroundColor: "#fff",
  },
  modalFooter: {
    backgroundColor: "#fff",
  },
};

export default MobileSingleMentor;
