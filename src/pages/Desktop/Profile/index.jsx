// components/Profile/SingleMentor.js

// Imports
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
import { FaClock } from "react-icons/fa";
import { MdEdit, MdChat, MdPhone, MdCalendarToday } from "react-icons/md";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useFetchUsersByType from "../../../hooks/Profile/useFetchUsersByType";
import useGoogleCalendar from "../../../hooks/Profile/useGoogleCalendar";
import toast from "react-hot-toast";

// Import React-Bootstrap Components
import {
  Modal,
  Button,
  ProgressBar,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";

// Component definition
const SingleMentor = () => {
  // State declarations
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [interviewDate, setInterviewDate] = useState(dayjs()); // Default to today
  const [interviewTime, setInterviewTime] = useState(dayjs()); // Default to now
  const [description, setDescription] = useState("");
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();

  const { uid } = useParams();
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);
  console.log("profileData", profileData, profileError);

  const {
    error: usersError,
    loading: usersLoading,
    users,
  } = useFetchUsersByType("Developer");
  console.log(users, "Developers1");

  const { userData: currentUser } = useFetchUserData();

  const {
    signIn,
    createEvent,
    loading: scheduleLoading,
    isInitialized,
  } = useGoogleCalendar();

  // Redirect to user detail if profile type is missing
  useEffect(() => {
    if (
      !profileLoading &&
      (!profileData?.type || profileData?.type.trim() === "")
    ) {
      navigate("/userdetail");
    }
  }, [profileLoading, profileData, navigate]);

  // Set editable state based on current user
  useEffect(() => {
    if (currentUser && currentUser.uid === uid) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [currentUser, uid]);

  const registrationStatus = useRegisterUser(
    profileData,
    profileLoading,
    profileError
  );

  console.log("Registration Status:", registrationStatus);

  const badgeMapping = {
    Developer: ["Frontend", "Backend", "Full Stack", "Mobile Apps"],
    Designer: ["UI/UX", "Graphics", "Web Design", "Animation"],
    CloudDevOps: ["AWS", "Azure", "CI/CD", "Kubernetes"],
    ContentCreator: ["Blogs", "Videos", "Podcasts", "Social Media"],
    DigitalMarketing: ["SEO", "PPC", "Social Media", "Email Marketing"],
    Lawyer: ["Divorce", "Property Issue", "Employment Issue", "Other"],
    HR: ["Recruitment", "Payroll", "Training", "Employee Relations"],
    Accountant: ["Taxation", "Auditing", "Budgeting", "Financial Reports"],
    Intern: ["Learning", "Assisting", "Research", "Shadowing"],
  };

  // Rendering badges based on profession
  const professionBadges = badgeMapping[profileData?.type] || [];

  const sanitizeProfileData = (data) => {
    return JSON.parse(JSON.stringify(data)); // Removes non-serializable fields
  };

  const handleEdit = () => {
    if (profileData?.type) {
      const sanitizedData = sanitizeProfileData(profileData);
      navigate("/userdetail", { state: { profileData: sanitizedData } });
    } else {
      navigate("/userdetail");
    }
  };

  const internInfo = useSelector((state) => state.internInfo);
  console.log(internInfo);

  // Schedule interview functions

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
    // Removed setCurrentStep(4) to prevent unintended navigation
  };

  const handleScheduleCall = async () => {
    try {
      if (!isInitialized) {
        toast.error(
          "Google Calendar is not initialized yet. Please try again."
        );
        return;
      }

      await signIn(); // Authenticate user with Google

      const startDateTime = interviewDate
        .hour(interviewTime.hour())
        .minute(interviewTime.minute())
        .second(0)
        .toISOString();
      const endDateTime = dayjs(startDateTime).add(30, "minute").toISOString();

      const eventData = {
        title: "XTERN Mentorship Call",
        description: `
**XTERN Mentorship Call**

**Host:** ${currentUser?.firstName} ${currentUser?.lastName} (${
          currentUser?.email
        })
**Recipient:** ${profileData?.firstName} ${profileData?.lastName} (${
          profileData?.email
        })

**Date:** ${interviewDate.format("D MMM YYYY")}
**Time:** ${interviewTime.format("h:mm A")}
**Duration:** 30 minutes
**Description:** ${description || "N/A"}

Looking forward to our mentorship session!

Best Regards,
XTERN Team
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
        location: "Online", // Assuming it's a video call
      };

      const response = await createEvent(eventData);

      if (response.success) {
        setInterviewScheduled(false); // Close modal
        window.open(response.eventLink, "_blank"); // Open event in new tab
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

    navigate("/project", { state: { item: serializableItem } });
  };

  // Event handlers
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkedIcon = () => {
    setIsBookmarkedIcon(!isBookmarkedIcon);
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page in the history stack
  };

  return (
    <div className="desktop-profile-container">
      {/* Profile details section */}
      <section id="profile-details-section">
        <div className="profile-details">
          <div className="profile-details-wrap">
            {/* Profile image and basic info */}
            <div className="profile-details-first-wrap">
              {editable && (
                <button onClick={handleEdit} className="edit-btn">
                  <MdEdit />
                </button>
              )}

              <div className="profile-img-info-container">
                {/* Profile Image Section */}
                <div className="mentor-img-sec">
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
                      onError={(e) => (e.target.src = "/default-profile.png")} // Fallback image
                    />
                  )}
                </div>

                {/* Profile Details Section */}
                <div className="profile-details-details">
                  {/* Name */}
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

                  {/* Experience */}
                  {profileLoading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ fontSize: "1rem", width: "200px", height: "20px" }}
                    />
                  ) : (
                    <span>Year of Experience: {profileData?.experience}</span>
                  )}

                  {/* Profile Type */}
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

            {/* Skills section */}
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
                {profileData?.skillSet?.map((item) => {
                  // Convert rating (1 to 5) into percentage
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
                            color: "#007bff", // Matching blue theme
                          }}
                        >
                          {ratingPercentage}%
                        </div>
                        <div className="skill-bar">
                          <div
                            className="skill-bar-fill"
                            style={{
                              width: `${ratingPercentage}%`,
                              backgroundColor: "#007bff", // Matching blue theme
                              height: "5px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!profileData?.skillSet && <span>No skill set available</span>}
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
          profileData?.type !== "Intern" && (
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
                  <span className="service-name">Consulting Now</span>
                  <div className="issue-badge">
                    {professionBadges?.map((badge, index) => (
                      <div className="badge" key={index}>
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>

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
                    disabled={!isInitialized} // Disable if not initialized
                  >
                    <MdCalendarToday /> Meet
                  </button>
                </div>
                {!isInitialized && (
                  <span className="text-muted">
                    Initializing Google Calendar...
                  </span>
                )}
                <span className="consultant-price">
                  ₹
                  {profileData?.consultingPrice
                    ? profileData?.consultingPrice
                    : "Loading"}
                  {"/minute"}
                </span>
              </div>
            </div>
          )
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
            <div className="service-list">
              {profileData?.serviceDetails?.map((item) => (
                <div
                  onClick={() => handleService(item)}
                  className="service-item"
                  key={item.serviceName}
                >
                  <span className="service-name">{item.serviceName}</span>
                  <p>{item.serviceDescription.slice(0, 70) + "..."}</p>
                  <div className="price-duration-container">
                    <span className="service-duration">
                      <FaClock /> {item?.serviceDuration || "N/A"}{" "}
                      {item?.serviceDurationType || "N/A"}
                    </span>
                    <span className="service-price">₹{item.servicePrice}</span>
                  </div>
                </div>
              ))}
            </div>
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
                  {profileData?.workExperience?.map((work, index) => (
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
                          {dayjs
                            .unix(work?.startDate?.seconds)
                            .format("D MMM YYYY")}{" "}
                          -{" "}
                          {work.endDate === "present" || !work.endDate
                            ? "Present"
                            : work.endDate.seconds
                            ? dayjs
                                .unix(work.endDate.seconds)
                                .format("D MMM YYYY")
                            : "Not Available"}
                        </p>
                        <button
                          className="desc-btn"
                          data-bs-toggle="collapse"
                          data-bs-target={`#work-collapse-${index}`}
                          aria-expanded="false"
                          aria-controls={`work-collapse-${index}`}
                        >
                          View Description
                        </button>
                        <div
                          id={`work-collapse-${index}`}
                          className="collapse"
                          aria-labelledby={`work-collapse-${index}`}
                        >
                          <div className="card card-body">
                            {work?.description || "No description available"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Education Tab */}
                <div
                  className="tab-pane fade"
                  id="education-content"
                  role="tabpanel"
                >
                  {profileData?.educationDetails?.map((educ, index) => (
                    <div className="experience-sec" key={`educ-${index}`}>
                      <div className="work-logo-container">
                        <img
                          src="https://cdn.vectorstock.com/i/1000v/14/68/education-color-icon-vector-29051468.jpg"
                          className="educ-logo"
                          alt="Education Logo"
                        />
                      </div>
                      <div className="experience-info">
                        <h4>{educ?.degree}</h4>
                        <h6>Stream: {educ?.stream}</h6>
                        <p>{educ?.college}</p>
                        <p>
                          {dayjs
                            .unix(educ?.startDate?.seconds)
                            .format("D MMM YYYY")}{" "}
                          -{" "}
                          {educ.endDate === "present" || !educ.endDate
                            ? "Present"
                            : dayjs
                                .unix(educ?.endDate?.seconds)
                                .format("D MMM YYYY")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Projects Tab */}
                <div
                  className="tab-pane fade"
                  id="projects-content"
                  role="tabpanel"
                >
                  {profileData?.projectDetails?.map((project, index) => (
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
                        <div>
                          <b>Tech Stack:</b>{" "}
                          {project?.techstack?.map((item, idx) => (
                            <span key={idx}>
                              {item}
                              {idx !== project.techstack.length - 1 && ", "}
                            </span>
                          )) || "No tech stack available"}
                        </div>
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
                            data-bs-toggle="collapse"
                            data-bs-target={`#project-collapse-${index}`}
                            aria-expanded="false"
                            aria-controls={`project-collapse-${index}`}
                          >
                            View Description
                          </button>
                        </div>
                        <div
                          id={`project-collapse-${index}`}
                          className="collapse"
                          aria-labelledby={`project-collapse-${index}`}
                        >
                          <div className="card card-body">
                            {project?.description || "No description available"}
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
        size="lg" // Increase modal width
        backdrop="static" // Prevent closing by clicking outside
        keyboard={false} // Prevent closing with ESC key
        className="custom-modal" // Custom class for additional styling
      >
        <Modal.Header className="bg-primary text-white" closeButton>
          <Modal.Title>Schedule a Call</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <Container>
            <Row>
              <Col>
                <ProgressBar
                  now={(currentStep / 4) * 100}
                  label={`Step ${currentStep} of 4`}
                  className="mb-4"
                  variant="info" // Blue variant for progress bar
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
                    <p>
                      <strong>Date:</strong>{" "}
                      {interviewDate.format("D MMM YYYY")}
                    </p>
                    <p>
                      <strong>Time:</strong> {interviewTime.format("h:mm A")}
                    </p>
                    <p>
                      <strong>Description:</strong> {description || "N/A"}
                    </p>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="bg-white">
          <Container>
            <Row className="w-100">
              <Col className="d-flex justify-content-between">
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
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SingleMentor;
