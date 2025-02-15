import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SkillSet from "./SkillSet";
import Acadamic from "./Acadamic";
import MainProfile from "./MainProfile";
import Skeleton from "@mui/material/Skeleton";
import {MdEdit, MdChat, MdCalendarToday, MdClose } from "react-icons/md";
import { FaRegClock, FaRegFolderOpen } from "react-icons/fa";
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
import toast from "react-hot-toast";
import useUserProfileData from "../../hooks/Profile/useUserProfileData";
import useFetchUsersByType from "../../hooks/Profile/useFetchUsersByType";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import useGoogleCalendar from "../../hooks/Profile/useGoogleCalendar";
import useScheduledCallsForUser from "../../hooks/Profile/useScheduledCallsForUser";
import ScheduledCallsModal from "../Desktop/Profile/ScheduledCallsModal";
import { useEntrepreneurDetails } from "../../hooks/Entrepreneur/useEntrepreneurDetails";

const EntrepreneurMobile = () => {
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

  // Hooks for data fetching
  const {
    loading: profileLoading,
    userData: profileData,
    error: profileError,
  } = useEntrepreneurDetails(uid);

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

  // const {
  //   calls,
  //   loading: callsLoading,
  //   error: callsError,
  // } = useScheduledCallsForUser(currentUser?.uid);

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
      navigate("/entrepreneurdetails", { state: { profileData: sanitized } });
    } else {
      navigate("/entrepreneurdetails");
    }
  };

  // Handle Share
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Profile link copied!"))
      .catch(() => toast.error("Failed to copy link."));
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
    navigate("/service", { state: { item: serializableItem } });
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

  useLayoutEffect(() => {
    if (profileData) {
      if (profileData.type !== "entrepreneur") {
        toast.error("Profile does not exist");
        navigate("/homescreen");
      }
    }
  }, [profileData]);

  // Navigate Back
  const handleBackClick = () => {
    navigate(-1);
  };
  if (!profileData) {
    return <></>;
  }
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
      {/* Main Content Section */}
      <section id="single-mentor-sec" style={styles.container}>
        <div className="single-mentor-sec-wrap">
            
          {/* Profile Information */}
          {profileLoading ? (
            <Skeleton variant="rounded" width={"100%"} height={"300px"} />
          ) : (
            <>
              <MainProfile
                userdata={profileData}
                loading={profileLoading}
                handleEdit={handleEdit}
                handleShare={handleShare}
                editable={editable}
              />
              <div className="w-full flex flex-wrap gap-1">
                {profileData?.skills?.map((skill, index) => {
                  return (
                    <Chip
                      key={index + "entrepreneur-skills"}
                      label={skill.name}
                    ></Chip>
                  );
                })}
              </div>
            </>
          )}

          <div className="w-full flex justify-end mt-4 gap-1">
            <Button onClick={() => navigate("/createjob")}>Create job</Button>
            <Button onClick={() => navigate("/jobpostings")}>View jobs</Button>
          </div>

          {/* Academic and Other Sections */}
          {profileLoading ? (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"350px"}
              style={{ marginTop: "20px" }}
            />
          ) : (
            <>
              <div className="single-mentor-third-sec mt-4">
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
                        ) : (
                          profileData && (
                            <>
                              <div
                                className="experience-sec"
                                key={`${profileData?.companyDetails?.name}`}
                              >
                                <div className="size-[60px] rounded-full shrink-0 overflow-hidden mr-4 relative">
                                  <img
                                    src={profileData?.companyDetails?.logo}
                                    alt="Company Logo"
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>

                                <div className="experience-info">
                                  <h4>{profileData?.companyDetails?.name}</h4>
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
                          )
                        )}
                      </div>

                      {/* Projects Tab */}
                      <div
                        className="tab-pane fade"
                        id="job-content"
                        role="tabpanel"
                      >
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
                                  <AccordionSummary>
                                    Description
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {job.description}
                                  </AccordionDetails>
                                </Accordion>

                                <div className="desc-view-job-btn-container ml-auto">
                                  {currentUser.uid != profileData.uid ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          navigate(`/jobs/${job.jobId}`)
                                        }
                                        className="desc-btn ml-auto"
                                      >
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
                                    {job?.description ||
                                      "No description available"}
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
            </>
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
                          <div className="relative size-[60px] flex items-center justify-center">
                            <img
                              src={
                                profileData?.photo_url || "/default-profile.png"
                              }
                              className="size-full absolute object-cover"
                              alt=""
                            />{" "}
                          </div>
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
  consultingButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
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

export default EntrepreneurMobile;
