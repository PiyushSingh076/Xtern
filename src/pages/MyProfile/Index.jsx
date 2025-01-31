// // src/Components/Profile/MobileSingleMentor.js

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import SkillSet from "./SkillSet";
// import Acadamic from "./Acadamic";
// import MainProfile from "./MainProfile";
// import Skeleton from "@mui/material/Skeleton";
// import { MdEdit, MdChat, MdCalendarToday, MdClose } from "react-icons/md";
// import { FaClock, FaRegClock, FaRegFolderOpen } from "react-icons/fa";
// import {
//   Modal,
//   Button,
//   Form,
//   Container,
//   Row,
//   Col,
//   Image,
//   ProgressBar,
// } from "react-bootstrap";
// import dayjs from "dayjs";
// import {
//   Box,
//   Tooltip,
//   IconButton,
//   Chip,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ShareIcon from "@mui/icons-material/Share";
// import toast from "react-hot-toast";
// import useUserProfileData from "../../hooks/Profile/useUserProfileData";
// import useFetchUsersByType from "../../hooks/Profile/useFetchUsersByType";
// import useFetchUserData from "../../hooks/Auth/useFetchUserData";
// import useGoogleCalendar from "../../hooks/Profile/useGoogleCalendar";
// import useScheduledCallsForUser from "../../hooks/Profile/useScheduledCallsForUser";
// import ScheduledCallsModal from "../Desktop/Profile/ScheduledCallsModal";

// /**
//  * Utility functions
//  */
// function formatDateGeneric(value) {
//   if (!value) return "N/A";
//   if (typeof value === "string") {
//     if (value.toLowerCase() === "present") {
//       return "Present";
//     }
//     const parsed = dayjs(value);
//     return parsed.isValid() ? parsed.format("D MMM YYYY") : value;
//   }
//   return "N/A";
// }

// function formatExperience(expValue) {
//   const parsed = parseInt(expValue || "0", 10);
//   if (parsed <= 0) return "Less than 1";
//   return parsed.toString();
// }

// const MobileSingleMentor = () => {
//   const navigate = useNavigate();
//   const { uid } = useParams();
//   const role = useSelector((state) => state.role);

//   // State declarations
//   const [interviewScheduled, setInterviewScheduled] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [interviewDate, setInterviewDate] = useState(dayjs());
//   const [interviewTime, setInterviewTime] = useState(dayjs());
//   const [description, setDescription] = useState("");
//   const [callsModalOpen, setCallsModalOpen] = useState(false);
//   const [meetLink, setMeetLink] = useState("");

//   // Toggling descriptions in Work & Projects
//   const [workOpen, setWorkOpen] = useState({});
//   const [projectOpen, setProjectOpen] = useState({});
//   const [serviceOpen, setServiceOpen] = useState({});

//   const toggleWorkDesc = (index) =>
//     setWorkOpen((prev) => ({ ...prev, [index]: !prev[index] }));
//   const toggleProjectDesc = (index) =>
//     setProjectOpen((prev) => ({ ...prev, [index]: !prev[index] }));
//   const toggleServiceDesc = (index) =>
//     setServiceOpen((prev) => ({ ...prev, [index]: !prev[index] }));

//   // Hooks for data fetching
//   const {
//     userData: profileData,
//     loading: profileLoading,
//     error: profileError,
//   } = useUserProfileData(uid);

//   const {
//     users,
//     loading: usersLoading,
//     error: usersError,
//   } = useFetchUsersByType("Developer");

//   const { userData: currentUser } = useFetchUserData();

//   const {
//     signIn,
//     createEvent,
//     deleteEvent,
//     loading: scheduleLoading,
//     isInitialized,
//   } = useGoogleCalendar();

//   const {
//     calls,
//     loading: callsLoading,
//     error: callsError,
//   } = useScheduledCallsForUser(currentUser?.uid);

//   // Editable state
//   const [editable, setEditable] = useState(false);
//   useEffect(() => {
//     if (currentUser && currentUser.uid === uid) setEditable(true);
//     else setEditable(false);
//   }, [currentUser, uid]);

//   // Redirect if no profile type
//   useEffect(() => {
//     if (!profileLoading && (!profileData?.type || profileData?.type === "")) {
//       navigate("/userdetail");
//     }
//   }, [profileLoading, profileData, navigate]);

//   // Handle Edit
//   const handleEdit = () => {
//     if (profileData?.type) {
//       const sanitized = JSON.parse(JSON.stringify(profileData));
//       navigate("/userdetail", { state: { profileData: sanitized } });
//     } else {
//       navigate("/userdetail");
//     }
//   };

//   // Scheduling call handlers
//   const handleDateChange = (date) => {
//     setInterviewDate(date);
//     setCurrentStep(2);
//   };
//   const handleTimeChange = (time) => {
//     setInterviewTime(time);
//     setCurrentStep(3);
//   };
//   const handleDescriptionChange = (e) => {
//     setDescription(e.target.value);
//   };

//   const handleScheduleCall = async () => {
//     try {
//       if (!isInitialized) {
//         toast.error("Google Calendar not ready. Please try again.");
//         return;
//       }
//       await signIn();
//       const startDateTime = interviewDate
//         .hour(interviewTime.hour())
//         .minute(interviewTime.minute())
//         .second(0)
//         .toISOString();
//       const endDateTime = dayjs(startDateTime).add(30, "minute").toISOString();

//       const eventData = {
//         title: "XTERN Mentorship Call",
//         description: `
//           Mentorship Call with ${profileData?.firstName} ${
//           profileData?.lastName
//         }
//           Host: ${currentUser?.firstName} ${currentUser?.lastName}
//           Date: ${interviewDate.format("D MMM YYYY")}
//           Time: ${interviewTime.format("h:mm A")}
//           Description: ${description || "N/A"}
//           Meet Link: ${meetLink}
//         `,
//         startDateTime,
//         endDateTime,
//         attendees: [
//           { email: currentUser?.email },
//           { email: profileData?.email },
//         ],
//         callId: `call-${Date.now()}`,
//         hostUserId: currentUser?.uid,
//         recipientUserId: profileData?.uid,
//         callType: "video",
//         location: "Online",
//       };

//       const response = await createEvent(eventData);
//       if (response.success) {
//         setCurrentStep(1);
//         setInterviewDate(dayjs());
//         setInterviewTime(dayjs());
//         setDescription("");
//         setInterviewScheduled(false);
//         setMeetLink(response.meetLink);
//         window.open(response.eventLink, "_blank");
//         toast.success("Call scheduled and event opened.");
//       } else {
//         toast.error("Failed to schedule. Try again.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error scheduling call.");
//     }
//   };

//   // Handle Service Click
//   const handleService = (item) => {
//     const serializableItem = JSON.parse(JSON.stringify(item));
//     navigate("/service", { state: { item: serializableItem } });
//   };

//   // Share Profile
//   const handleShare = () => {
//     const url = window.location.href;
//     navigator.clipboard
//       .writeText(url)
//       .then(() => toast.success("Profile link copied!"))
//       .catch(() => toast.error("Failed to copy link."));
//   };

//   // Delete Event
//   const handleDeleteEvent = async (eventId, callDocId) => {
//     try {
//       await deleteEvent(eventId, callDocId);
//     } catch (err) {
//       console.error(err);
//       toast.error("Error deleting event.");
//     }
//   };

//   // Open/Close Scheduled Calls Modal
//   const openScheduledCallsModal = () => setCallsModalOpen(true);
//   const closeScheduledCallsModal = () => setCallsModalOpen(false);

//   // Navigate Back
//   const handleBackClick = () => {
//     navigate(-1);
//   };

//   // Render fallback for errors
//   if (profileError) {
//     return (
//       <section id="single-mentor-sec" style={{ padding: "20px" }}>
//         <div className="container">
//           <h2>An error occurred while loading the profile.</h2>
//           <Button onClick={handleBackClick} variant="primary">
//             Go Back
//           </Button>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       {/* Header Section */}
//       <div className="mobile-header" style={styles.header}>
//         <IconButton onClick={handleBackClick}>
//           <MdClose size={24} />
//         </IconButton>
//         {editable && (
//           <IconButton onClick={handleEdit}>
//             <MdEdit size={24} />
//           </IconButton>
//         )}
//       </div>

//       {/* Main Content Section */}
//       <section id="single-mentor-sec" style={styles.container}>
//         <div className="single-mentor-sec-wrap">
//           {/* Profile Information */}
//           {profileLoading ? (
//             <Skeleton variant="rounded" width={"100%"} height={"300px"} />
//           ) : (
//             <MainProfile userdata={profileData} loading={profileLoading} />
//           )}

//           {/* Share Button */}
//           <Box sx={{ textAlign: "right", marginTop: "10px" }}>
//             <Tooltip title="Share Profile" arrow>
//               <IconButton onClick={handleShare} color="primary">
//                 <ShareIcon />
//               </IconButton>
//             </Tooltip>
//           </Box>

//           {/* Consulting Section */}
//           {profileLoading ? (
//             <Skeleton
//               variant="rectangular"
//               width={"100%"}
//               height={"100px"}
//               sx={{ marginTop: "20px" }}
//             />
//           ) : (
//             <div style={styles.consultingContainer}>
//               <div style={styles.consultingInfo}>
//                 {profileData?.consultingPrice && (
//                   <span style={styles.consultingPrice}>
//                     ₹{profileData.consultingPrice}/minute
//                   </span>
//                 )}
//               </div>
//               {!editable && (
//                 <div style={styles.consultingButtons}>
//                   <Button
//                     onClick={() => navigate("/mychat")}
//                     variant="outline-primary"
//                     size="small"
//                     style={{ marginRight: "10px" }}
//                   >
//                     <MdChat size={20} /> Chat
//                   </Button>
//                   <Button
//                     onClick={() => setInterviewScheduled(true)}
//                     variant="outline-success"
//                     size="small"
//                     disabled={!isInitialized}
//                   >
//                     <MdCalendarToday size={20} /> Meet
//                   </Button>
//                 </div>
//               )}
//               <Button
//                 onClick={openScheduledCallsModal}
//                 variant="outline-primary"
//                 size="small"
//                 style={{ marginTop: "10px" }}
//               >
//                 <FaRegClock size={16} /> upcoming Meets
//               </Button>
//             </div>
//           )}

//           {/* Skills Section */}
//           {profileLoading ? (
//             <Skeleton
//               variant="rounded"
//               width={"100%"}
//               height={"150px"}
//               sx={{ marginTop: "20px" }}
//             />
//           ) : (
//             <SkillSet profileData={profileData} />
//           )}

//           {/* Academic and Other Sections */}
//           {profileLoading ? (
//             <Skeleton
//               variant="rounded"
//               width={"100%"}
//               height={"350px"}
//               sx={{ marginTop: "20px" }}
//             />
//           ) : (
//             <Acadamic profileData={profileData} />
//           )}
//         </div>
//       </section>

//       {/* Scheduling Modal */}
//       <Modal
//         show={interviewScheduled}
//         onHide={() => {
//           setInterviewScheduled(false);
//           setCurrentStep(1);
//           setInterviewDate(dayjs());
//           setInterviewTime(dayjs());
//           setDescription("");
//         }}
//         centered
//         size="lg"
//         backdrop="static"
//         keyboard={false}
//         className="custom-modal"
//       >
//         <Modal.Header style={styles.modalHeader}>
//           <Modal.Title>Schedule a Call</Modal.Title>
//           <Button
//             variant="link"
//             onClick={() => {
//               setInterviewScheduled(false);
//               setCurrentStep(1);
//               setInterviewDate(dayjs());
//               setInterviewTime(dayjs());
//               setDescription("");
//             }}
//             style={{ color: "white", textDecoration: "none" }}
//           >
//             <MdClose size={24} />
//           </Button>
//         </Modal.Header>
//         <Modal.Body style={styles.modalBody}>
//           <Container>
//             <Row>
//               <Col>
//                 <ProgressBar
//                   now={(currentStep / 4) * 100}
//                   label={`Step ${currentStep} of 4`}
//                   className="mb-4"
//                   variant="info"
//                 />
//               </Col>
//             </Row>
//             <Row>
//               <Col>
//                 {currentStep === 1 && (
//                   <div>
//                     <h5>Select Date</h5>
//                     {/* Date Picker Component */}
//                     <Form.Group>
//                       <Form.Control
//                         type="date"
//                         value={interviewDate.format("YYYY-MM-DD")}
//                         onChange={(e) =>
//                           handleDateChange(dayjs(e.target.value))
//                         }
//                       />
//                     </Form.Group>
//                   </div>
//                 )}
//                 {currentStep === 2 && (
//                   <div>
//                     <h5>Select Time</h5>
//                     {/* Time Picker Component */}
//                     <Form.Group>
//                       <Form.Control
//                         type="time"
//                         value={interviewTime.format("HH:mm")}
//                         onChange={(e) =>
//                           handleTimeChange(dayjs(e.target.value, "HH:mm"))
//                         }
//                       />
//                     </Form.Group>
//                   </div>
//                 )}
//                 {currentStep === 3 && (
//                   <div>
//                     <h5>Add Description</h5>
//                     <Form>
//                       <Form.Group>
//                         <Form.Control
//                           as="textarea"
//                           rows={4}
//                           placeholder="Enter description..."
//                           value={description}
//                           onChange={handleDescriptionChange}
//                         />
//                       </Form.Group>
//                     </Form>
//                   </div>
//                 )}
//                 {currentStep === 4 && (
//                   <div>
//                     <h5>Confirm Details</h5>
//                     <Container>
//                       <Row className="mb-3">
//                         <Col
//                           xs={12}
//                           md={6}
//                           className="d-flex align-items-center"
//                         >
//                           <Image
//                             src={
//                               currentUser?.photo_url || "/default-profile.png"
//                             }
//                             roundedCircle
//                             width={60}
//                             height={60}
//                             alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
//                             className="me-3"
//                           />
//                           <div>
//                             <strong>
//                               {currentUser?.firstName} {currentUser?.lastName}
//                             </strong>
//                             <br />
//                             <a href={`mailto:${currentUser?.email}`}>
//                               {currentUser?.email}
//                             </a>
//                           </div>
//                         </Col>
//                         <Col
//                           xs={12}
//                           md={6}
//                           className="d-flex align-items-center"
//                         >
//                           <Image
//                             src={
//                               profileData?.photo_url || "/default-profile.png"
//                             }
//                             roundedCircle
//                             width={60}
//                             height={60}
//                             alt={`${profileData?.firstName} ${profileData?.lastName}`}
//                             className="me-3"
//                           />
//                           <div>
//                             <strong>
//                               {profileData?.firstName} {profileData?.lastName}
//                             </strong>
//                             <br />
//                             <a href={`mailto:${profileData?.email}`}>
//                               {profileData?.email}
//                             </a>
//                           </div>
//                         </Col>
//                       </Row>
//                       <Row>
//                         <Col>
//                           <p>
//                             <strong>Date:</strong>{" "}
//                             {interviewDate.format("D MMM YYYY")}
//                           </p>
//                           <p>
//                             <strong>Time:</strong>{" "}
//                             {interviewTime.format("h:mm A")}
//                           </p>
//                           <p>
//                             <strong>Description:</strong> {description || "N/A"}
//                           </p>
//                         </Col>
//                       </Row>
//                     </Container>
//                   </div>
//                 )}
//               </Col>
//             </Row>
//           </Container>
//         </Modal.Body>
//         <Modal.Footer style={styles.modalFooter}>
//           <Container>
//             <Row className="w-100">
//               <Col className="d-flex justify-content-between align-items-center">
//                 <Button
//                   variant="outline-secondary"
//                   onClick={() => {
//                     setInterviewScheduled(false);
//                     setCurrentStep(1);
//                     setInterviewDate(dayjs());
//                     setInterviewTime(dayjs());
//                     setDescription("");
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <div>
//                   {currentStep > 1 && (
//                     <Button
//                       variant="outline-primary"
//                       onClick={() => setCurrentStep(currentStep - 1)}
//                       className="me-2"
//                       size="sm"
//                     >
//                       Back
//                     </Button>
//                   )}
//                   {currentStep < 4 && (
//                     <Button
//                       variant="primary"
//                       onClick={() => setCurrentStep(currentStep + 1)}
//                       disabled={
//                         (currentStep === 1 && !interviewDate) ||
//                         (currentStep === 2 && !interviewTime)
//                       }
//                       size="sm"
//                     >
//                       Next
//                     </Button>
//                   )}
//                   {currentStep === 4 && (
//                     <Button
//                       variant="success"
//                       onClick={handleScheduleCall}
//                       disabled={scheduleLoading}
//                       size="sm"
//                     >
//                       {scheduleLoading ? "Scheduling..." : "Schedule Call"}
//                     </Button>
//                   )}
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         </Modal.Footer>
//       </Modal>

//       {/* Scheduled Calls Modal */}
//       <ScheduledCallsModal
//         open={callsModalOpen}
//         onClose={closeScheduledCallsModal}
//         loading={callsLoading}
//         calls={calls}
//         error={callsError}
//         onDeleteEvent={handleDeleteEvent}
//       />
//     </>
//   );
// };

// // Inline styles for simplicity. Consider using CSS or styled-components for better management.
// const styles = {
//   container: {
//     padding: "10px",
//     backgroundColor: "#fff",
//     minHeight: "100vh",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "10px",
//     borderBottom: "1px solid #ddd",
//     position: "sticky",
//     top: 0,
//     backgroundColor: "#fff",
//     zIndex: 1000,
//   },
//   consultingContainer: {
//     marginTop: "20px",
//     padding: "10px",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//     backgroundColor: "#f9f9f9",
//   },
//   consultingInfo: {
//     marginBottom: "10px",
//   },
//   consultingPrice: {
//     fontWeight: "bold",
//     fontSize: "16px",
//   },
//   badges: {
//     display: "flex",
//     flexWrap: "wrap",
//     marginTop: "5px",
//   },
//   consultingButtons: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "10px",
//   },
//   serviceContainer: {
//     marginTop: "20px",
//   },
//   accordion: {
//     marginBottom: "10px",
//   },
//   serviceHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//   },
//   priceDuration: {
//     display: "flex",
//     gap: "10px",
//   },
//   serviceDuration: {
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//   },
//   servicePrice: {
//     fontWeight: "bold",
//   },
//   noDataContainer: {
//     textAlign: "center",
//     marginTop: "20px",
//   },
//   liveLink: {
//     color: "#007bff",
//     textDecoration: "none",
//     display: "block",
//     marginTop: "5px",
//   },
//   tabSection: {
//     marginTop: "20px",
//   },
//   experienceSec: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "10px",
//     marginBottom: "15px",
//   },
//   modalHeader: {
//     backgroundColor: "#007bff",
//     color: "#fff",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   modalBody: {
//     backgroundColor: "#fff",
//   },
//   modalFooter: {
//     backgroundColor: "#fff",
//   },
// };

// export default MobileSingleMentor;

// src/Components/Profile/MobileSingleMentor.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SkillSet from "./SkillSet";
import Acadamic from "./Acadamic";
import MainProfile from "./MainProfile";
import Skeleton from "@mui/material/Skeleton";
import { MdChat, MdCalendarToday, MdClose } from "react-icons/md";
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
  } = useScheduledCallsForUser(uid);

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
          Mentorship Call with ${profileData?.firstName} ${profileData?.lastName
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
      {/* Main Content Section */}
      <section id="single-mentor-sec" style={styles.container}>
        <div className="single-mentor-sec-wrap">
          {/* Profile Information */}
          {profileLoading ? (
            <Skeleton variant="rounded" width={"100%"} height={"300px"} />
          ) : (
            <MainProfile
              userdata={profileData}
              loading={profileLoading}
              handleEdit={handleEdit}
              handleShare={handleShare}
              editable={editable} // Pass editable state as a prop
            />
          )}

          {/* Consulting Section */}
          {profileLoading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"100px"}
              style={{ marginTop: "20px" }}
            />
          ) : (
            <div style={styles.consultingContainer}>
              <div style={styles.consultingInfo}>
                {profileData?.consultingPrice && (
                  <span style={styles.consultingPrice}>
                    ₹{profileData.consultingPrice}/minute
                  </span>
                )}
              </div>
              <div style={styles.consultingButtons}>
                {!editable && (
                  <Button
                    onClick={() => navigate("/mychat")}
                    variant="outline-primary"
                    size="small"
                    style={{ ...styles.consultingButton }}
                  >
                    <MdChat size={20} /> Chat
                  </Button>
                )}

                {/* Meet Button */}
                {!editable && (
                  <Button
                    onClick={() => setInterviewScheduled(true)}
                    variant="outline-success"
                    size="small"
                    style={{ ...styles.consultingButton }}
                    disabled={!isInitialized}
                  >
                    <MdCalendarToday size={20} /> Meet
                  </Button>
                )}

                {/* Upcoming Meets Button */}
                <Button
                  onClick={openScheduledCallsModal}
                  variant="outline-primary"
                  size="small"
                  style={{ ...styles.consultingButton }}
                >
                  <FaRegClock size={20}  /> Upcoming Meets
                </Button>
              </div>
            </div>
          )}

          {/* Skills Section */}
          {profileLoading ? (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"150px"}
              style={{ marginTop: "20px" }}
            />
          ) : (
            <SkillSet profileData={profileData} role={role} />
          )}

          {/* Academic and Other Sections */}
          {profileLoading ? (
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={"350px"}
              style={{ marginTop: "20px" }}
            />
          ) : (
            <Acadamic profileData={profileData} />
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
  consultingButtons: {
    display: "flex", // Flex container
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Distribute buttons evenly
    alignItems: "center", // Center items vertically
    gap: "10px", // Add space between buttons
    flexWrap: "wrap", // Allow buttons to wrap on small screens
    marginBottom: "10px",
  },
  consultingButton: {
    flex: "1 1 auto", // Allow buttons to grow/shrink as needed
    textAlign: "center",
    padding: "8px 12px", // Adjust padding for balanced spacing
    minWidth: "120px", // Maintain minimum width
    display: "flex", // Use flexbox for proper alignment
    alignItems: "center", // Center icon and text vertically
    justifyContent: "center", // Center content horizontally
    gap: "8px", // Add clear space between icon and text
    overflow: "hidden", // Prevent content overflow
    whiteSpace: "nowrap", // Prevent wrapping of text
    textOverflow: "ellipsis", // Show ellipsis if text overflows
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
