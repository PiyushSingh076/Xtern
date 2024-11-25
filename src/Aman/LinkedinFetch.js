// import React, { useState } from "react";
// import useFetchLinkedInProfile from "../../hooks/Linkedin/useFetchLinkedInProfile";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Alert,
//   Avatar,
//   Grid,
//   Card,
//   CardContent,
//   Divider,
//   Tooltip,
//   CircularProgress,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Link,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// const LinkedInFetcher = ({ onFetchSuccess }) => {
//   const { fetchLinkedInProfile, loading, error, successMessage, linkedInData } =
//     useFetchLinkedInProfile();
//   const [profileUrl, setProfileUrl] = useState("");

//   // URL Validation Function
//   const validateLinkedInUrl = (url) => {
//     const regex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
//     return regex.test(url);
//   };

//   const handleFetch = async () => {
//     if (!profileUrl) {
//       alert("Please provide a LinkedIn Profile URL.");
//       return;
//     }
//     if (!validateLinkedInUrl(profileUrl)) {
//       alert("Please enter a valid LinkedIn Profile URL.");
//       return;
//     }
//     const data = await fetchLinkedInProfile(profileUrl);
//     if (data && onFetchSuccess) {
//       console.log("Fetched LinkedIn Data:", data); // Debugging
//       onFetchSuccess(data.linkedInData); // Passing the linkedInData directly
//     }
//   };

//   // Truncate text function
//   const truncate = (str, n) => {
//     return str.length > n ? str.substr(0, n - 1) + "..." : str;
//   };

//   // Helper function to format date
//   const formatDate = (dateObj) => {
//     if (!dateObj) return "Present";
//     const { year, month, day } = dateObj;
//     const date = new Date(year, month - 1, day);
//     return date.toLocaleDateString("default", {
//       month: "short",
//       year: "numeric",
//     });
//   };

//   return (
//     <Card sx={{ padding: 2, boxShadow: 2 }}>
//       {/* Fetcher Section */}
//       <Typography variant="h6" gutterBottom>
//         LinkedIn Profile
//       </Typography>
//       <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
//         <TextField
//           label="LinkedIn URL"
//           variant="outlined"
//           fullWidth
//           value={profileUrl}
//           onChange={(e) => setProfileUrl(e.target.value)}
//           size="small"
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleFetch}
//           disabled={loading}
//           startIcon={loading && <CircularProgress size={20} color="inherit" />}
//           size="small"
//         >
//           {loading ? "Fetching" : "Fetch"}
//         </Button>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       {successMessage && (
//         <Alert severity="success" sx={{ mb: 2 }}>
//           {successMessage}
//         </Alert>
//       )}

//       {/* Display Fetched Data */}
//       {linkedInData && (
//         <Box sx={{ mt: 2 }}>
//           {/* Banner and Profile Picture */}
//           <Card variant="outlined" sx={{ boxShadow: 1 }}>
//             {/* Banner Section */}
//             {linkedInData.background_cover_image_url && (
//               <Box
//                 component="img"
//                 src={linkedInData.background_cover_image_url}
//                 alt="Background Cover"
//                 sx={{
//                   width: "100%",
//                   height: { xs: "100px", sm: "150px" },
//                   objectFit: "cover",
//                   borderTopLeftRadius: 1,
//                   borderTopRightRadius: 1,
//                 }}
//               />
//             )}

//             <CardContent sx={{ padding: 3 }}>
//               <Grid container spacing={3}>
//                 {/* Profile Picture */}
//                 <Grid
//                   item
//                   xs={12}
//                   sm={3}
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                 >
//                   <Avatar
//                     src={linkedInData.profile_pic_url}
//                     alt={`${linkedInData.first_name} ${linkedInData.last_name}`}
//                     sx={{
//                       width: 120,
//                       height: 120,
//                       border: "2px solid #1976d2",
//                     }}
//                   />
//                 </Grid>

//                 {/* Personal Information */}
//                 <Grid item xs={12} sm={9}>
//                   <Typography variant="h5" fontWeight="bold">
//                     {linkedInData.first_name} {linkedInData.last_name}
//                   </Typography>
//                   <Typography
//                     variant="subtitle1"
//                     color="textSecondary"
//                     sx={{ mt: 1 }}
//                   >
//                     {linkedInData.headline || "No headline provided"}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     color="textSecondary"
//                     sx={{ mt: 1 }}
//                   >
//                     {linkedInData.occupation || "No occupation provided"}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="textSecondary"
//                     sx={{ mt: 1 }}
//                   >
//                     Followers: {linkedInData.follower_count || 0}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     color="textSecondary"
//                     sx={{ mt: 2 }}
//                   >
//                     {linkedInData.city}, {linkedInData.state},{" "}
//                     {linkedInData.country_full_name}
//                   </Typography>
//                 </Grid>
//               </Grid>

//               <Divider sx={{ my: 3 }} />

//               {/* Summary */}
//               {linkedInData.summary && (
//                 <Box sx={{ mb: 4 }}>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom>
//                     Summary
//                   </Typography>
//                   <Typography variant="body1">
//                     {truncate(linkedInData.summary, 300)}
//                     {linkedInData.summary.length > 300 && (
//                       <Tooltip title={linkedInData.summary}>
//                         <Typography
//                           variant="body2"
//                           color="primary"
//                           component="span"
//                           sx={{ cursor: "pointer", ml: 0.5 }}
//                         >
//                           Read more
//                         </Typography>
//                       </Tooltip>
//                     )}
//                   </Typography>
//                 </Box>
//               )}

//               {/* Experiences */}
//               {linkedInData.experiences &&
//                 linkedInData.experiences.length > 0 && (
//                   <Accordion defaultExpanded>
//                     <AccordionSummary
//                       expandIcon={<ExpandMoreIcon />}
//                       aria-controls="experiences-content"
//                       id="experiences-header"
//                     >
//                       <Typography variant="h6">Experiences</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       {linkedInData.experiences.map((exp, index) => (
//                         <Box key={index} sx={{ mb: 3 }}>
//                           <Grid container spacing={2}>
//                             {/* Company Logo */}
//                             {exp.logo_url && (
//                               <Grid item xs={12} sm={2}>
//                                 <Avatar
//                                   src={exp.logo_url}
//                                   alt={exp.company}
//                                   variant="square"
//                                   sx={{ width: 60, height: 60 }}
//                                 />
//                               </Grid>
//                             )}

//                             {/* Experience Details */}
//                             <Grid item xs={12} sm={exp.logo_url ? 10 : 12}>
//                               <Typography variant="subtitle1" fontWeight="bold">
//                                 {exp.title} at {exp.company}
//                               </Typography>
//                               <Typography
//                                 variant="body2"
//                                 color="textSecondary"
//                                 sx={{ mt: 0.5 }}
//                               >
//                                 {formatDate(exp.starts_at)} -{" "}
//                                 {exp.ends_at
//                                   ? formatDate(exp.ends_at)
//                                   : "Present"}
//                               </Typography>
//                               {exp.location && (
//                                 <Typography
//                                   variant="body2"
//                                   color="textSecondary"
//                                   sx={{ mt: 0.5 }}
//                                 >
//                                   Location: {exp.location}
//                                 </Typography>
//                               )}
//                               {exp.description && (
//                                 <Typography variant="body1" sx={{ mt: 1 }}>
//                                   {exp.description}
//                                 </Typography>
//                               )}
//                             </Grid>
//                           </Grid>
//                         </Box>
//                       ))}
//                     </AccordionDetails>
//                   </Accordion>
//                 )}

//               {/* Education */}
//               {linkedInData.education && linkedInData.education.length > 0 && (
//                 <Accordion>
//                   <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="education-content"
//                     id="education-header"
//                   >
//                     <Typography variant="h6">Education</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     {linkedInData.education.map((edu, index) => (
//                       <Box key={index} sx={{ mb: 3 }}>
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           {edu.degree_name} in {edu.field_of_study}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           color="textSecondary"
//                           sx={{ mt: 0.5 }}
//                         >
//                           {edu.school}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           color="textSecondary"
//                           sx={{ mt: 0.5 }}
//                         >
//                           {formatDate(edu.starts_at)} -{" "}
//                           {edu.ends_at ? formatDate(edu.ends_at) : "Present"}
//                         </Typography>
//                         {edu.grade && (
//                           <Typography
//                             variant="body2"
//                             color="textSecondary"
//                             sx={{ mt: 0.5 }}
//                           >
//                             Grade: {edu.grade}
//                           </Typography>
//                         )}
//                         {edu.description && (
//                           <Typography variant="body1" sx={{ mt: 1 }}>
//                             {edu.description}
//                           </Typography>
//                         )}
//                       </Box>
//                     ))}
//                   </AccordionDetails>
//                 </Accordion>
//               )}

//               {/* Projects */}
//               {linkedInData.accomplishment_projects &&
//                 linkedInData.accomplishment_projects.length > 0 && (
//                   <Accordion>
//                     <AccordionSummary
//                       expandIcon={<ExpandMoreIcon />}
//                       aria-controls="projects-content"
//                       id="projects-header"
//                     >
//                       <Typography variant="h6">Projects</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       {linkedInData.accomplishment_projects.map(
//                         (proj, index) => (
//                           <Box key={index} sx={{ mb: 3 }}>
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               {proj.title}
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               color="textSecondary"
//                               sx={{ mt: 0.5 }}
//                             >
//                               {formatDate(proj.starts_at)} -{" "}
//                               {proj.ends_at
//                                 ? formatDate(proj.ends_at)
//                                 : "Present"}
//                             </Typography>
//                             {proj.url && (
//                               <Typography variant="body2" color="primary">
//                                 <Link
//                                   href={proj.url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   underline="hover"
//                                 >
//                                   Live Demo
//                                 </Link>
//                               </Typography>
//                             )}
//                             {proj.description && (
//                               <Typography variant="body1" sx={{ mt: 1 }}>
//                                 {proj.description}
//                               </Typography>
//                             )}
//                           </Box>
//                         )
//                       )}
//                     </AccordionDetails>
//                   </Accordion>
//                 )}

//               {/* Certifications */}
//               {linkedInData.certifications &&
//                 linkedInData.certifications.length > 0 && (
//                   <Accordion>
//                     <AccordionSummary
//                       expandIcon={<ExpandMoreIcon />}
//                       aria-controls="certifications-content"
//                       id="certifications-header"
//                     >
//                       <Typography variant="h6">Certifications</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       {linkedInData.certifications.map((cert, index) => (
//                         <Box key={index} sx={{ mb: 3 }}>
//                           <Typography variant="subtitle1" fontWeight="bold">
//                             {cert.name}
//                           </Typography>
//                           <Typography
//                             variant="body2"
//                             color="textSecondary"
//                             sx={{ mt: 0.5 }}
//                           >
//                             Authority: {cert.authority}
//                           </Typography>
//                           {cert.starts_at && (
//                             <Typography
//                               variant="body2"
//                               color="textSecondary"
//                               sx={{ mt: 0.5 }}
//                             >
//                               Date: {formatDate(cert.starts_at)}
//                             </Typography>
//                           )}
//                           {cert.url && (
//                             <Typography variant="body2" color="primary">
//                               <Link
//                                 href={cert.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 underline="hover"
//                               >
//                                 View Certificate
//                               </Link>
//                             </Typography>
//                           )}
//                         </Box>
//                       ))}
//                     </AccordionDetails>
//                   </Accordion>
//                 )}

//               {/* Additional Sections (e.g., Groups) */}
//               {linkedInData.groups && linkedInData.groups.length > 0 && (
//                 <Accordion>
//                   <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="groups-content"
//                     id="groups-header"
//                   >
//                     <Typography variant="h6">Groups</Typography>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     {linkedInData.groups.map((group, index) => (
//                       <Box key={index} sx={{ mb: 3 }}>
//                         <Grid container spacing={2} alignItems="center">
//                           {/* Group Logo */}
//                           {group.profile_pic_url && (
//                             <Grid item xs={12} sm={2}>
//                               <Avatar
//                                 src={group.profile_pic_url}
//                                 alt={group.name}
//                                 variant="square"
//                                 sx={{ width: 60, height: 60 }}
//                               />
//                             </Grid>
//                           )}

//                           {/* Group Details */}
//                           <Grid
//                             item
//                             xs={12}
//                             sm={group.profile_pic_url ? 10 : 12}
//                           >
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               {group.name}
//                             </Typography>
//                             {group.url && (
//                               <Typography variant="body2" color="primary">
//                                 <Link
//                                   href={group.url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   underline="hover"
//                                 >
//                                   Visit Group
//                                 </Link>
//                               </Typography>
//                             )}
//                           </Grid>
//                         </Grid>
//                       </Box>
//                     ))}
//                   </AccordionDetails>
//                 </Accordion>
//               )}

//               {/* Connections */}
//               <Box sx={{ mt: 4 }}>
//                 <Typography variant="h6" fontWeight="bold">
//                   Connections
//                 </Typography>
//                 <Typography variant="body1">
//                   {linkedInData.connections} Connections
//                 </Typography>
//               </Box>

//               {/* People Also Viewed */}
//               {/* {linkedInData.people_also_viewed &&
//                 linkedInData.people_also_viewed.length > 0 && (
//                   <Box sx={{ mt: 4 }}>
//                     <Typography variant="h6" fontWeight="bold" gutterBottom>
//                       People Also Viewed
//                     </Typography>
//                     <Grid container spacing={2}>
//                       {linkedInData.people_also_viewed.map((person, index) => (
//                         <Grid item xs={12} sm={6} md={4} key={index}>
//                           <Card variant="outlined" sx={{ padding: 2 }}>
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               {person.name}
//                             </Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               {person.summary || "No summary provided"}
//                             </Typography>
//                             {person.link && (
//                               <Typography variant="body2" color="primary">
//                                 <Link
//                                   href={person.link}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   underline="hover"
//                                 >
//                                   View Profile
//                                 </Link>
//                               </Typography>
//                             )}
//                           </Card>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </Box>
//                 )} */}
//             </CardContent>
//           </Card>
//         </Box>
//       )}
//     </Card>
//   );
// };

// export default LinkedInFetcher;

// //--------------------------------------------------------------------------------------------------------

// import React, { useState } from "react";
// import {
//   Box,
//   Grid,
//   Avatar,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Button,
//   Stepper,
//   Step,
//   StepLabel,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Card,
//   CardContent,
//   CardHeader,
//   Divider,
// } from "@mui/material";
// import { FiTrash } from "react-icons/fi";
// import { State, City } from "country-state-city";
// import { useDispatch } from "react-redux";
// import { setDetail } from "../../../Store/Slice/UserDetail";
// import { useNavigate } from "react-router-dom";
// import { ROUTES } from "../../../constants/routes";
// import LinkedInFetcher from "../../Teams/LinkedInFetcher";
// import CloseIcon from "@mui/icons-material/Close";
// import ClearIcon from "@mui/icons-material/Clear";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// export default function StepperForm() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Form Detail Elements
//   const [FirstName, setFirstName] = useState("");
//   const [LastName, setLastName] = useState("");
//   const [Xpert, setXpert] = useState("");
//   const [Experience, setExperience] = useState("");
//   const [profileImg, setProfileImg] = useState(null);
//   const [selectedState, setSelectedState] = useState("");
//   const [cities, setCities] = useState([]);
//   const [selectedCity, setSelectedCity] = useState("");
//   const [Education, setEducation] = useState([]);
//   const [Work, setWork] = useState([]);
//   const [Skills, setSkills] = useState([]);
//   const [Projects, setProjects] = useState([]);
//   const [Services, setServices] = useState([]);
//   const [ConsultingPrice, setConsultingPrice] = useState("");
//   const [ConsultingDuration, setConsultingDuration] = useState("");
//   const [ConsultingDurationType, setConsultingDurationType] = useState("");

//   // Flow control
//   const [activeStep, setActiveStep] = useState(0);
//   const steps = ["Profile", "Offering"];
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState("");
//   const [isLinkedInFetched, setIsLinkedInFetched] = useState(false); // Flag to check if LinkedIn data is fetched

//   // Handle Profile Image Upload
//   const handleProfileImage = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setProfileImg(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Clear Profile Image
//   const clearProfileImage = () => {
//     setProfileImg(null);
//   };

//   // Handle State Change
//   const handleStateChange = (stateCode) => {
//     setSelectedState(stateCode);
//     const stateCities = City.getCitiesOfState("IN", stateCode);
//     setCities(stateCities);
//     setSelectedCity("");
//   };

//   // Open Modal
//   const openModal = (type) => {
//     setModalType(type);
//     setIsModalOpen(true);
//   };

//   // Close Modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setModalType("");
//   };

//   // Save Detail
//   const saveDetail = (type, data) => {
//     switch (type.toLowerCase()) {
//       case "education":
//         setEducation([...Education, data]);
//         break;
//       case "work":
//         setWork([...Work, data]);
//         break;
//       case "skill":
//         setSkills([...Skills, data]);
//         break;
//       case "project":
//         setProjects([...Projects, data]);
//         break;
//       case "service":
//         setServices([...Services, data]);
//         break;
//       default:
//         console.error("Invalid type");
//     }
//   };

//   // Delete Detail
//   const deleteDetail = (type, index) => {
//     switch (type.toLowerCase()) {
//       case "education":
//         setEducation(Education.filter((_, i) => i !== index));
//         break;
//       case "work":
//         setWork(Work.filter((_, i) => i !== index));
//         break;
//       case "skill":
//         setSkills(Skills.filter((_, i) => i !== index));
//         break;
//       case "project":
//         setProjects(Projects.filter((_, i) => i !== index));
//         break;
//       case "service":
//         setServices(Services.filter((_, i) => i !== index));
//         break;
//       default:
//         console.error("Invalid type");
//     }
//   };

//   // Handle Form Submission
//   const handleSubmitInfo = () => {
//     if (
//       FirstName &&
//       LastName &&
//       Xpert &&
//       Experience &&
//       selectedState &&
//       profileImg &&
//       selectedCity
//     ) {
//       let data = {
//         firstName: FirstName,
//         lastName: LastName,
//         expertise: Xpert,
//         experience: Experience,
//         profileImage: profileImg,
//         state: selectedState,
//         city: selectedCity,
//         education: Education,
//         work: Work,
//         skills: Skills,
//         projects: Projects,
//         services: Services,
//         consultingPrice: ConsultingPrice,
//         consultingDuration: ConsultingDuration,
//         consultingDurationType: ConsultingDurationType,
//       };

//       dispatch(setDetail(data));
//       navigate(ROUTES.HOME_SCREEN);
//     } else {
//       // Display specific alerts
//       if (!FirstName) alert("First Name is required");
//       if (!LastName) alert("Last Name is required");
//       if (!Xpert) alert("Xpert Type is required");
//       if (!Experience) alert("Years of Experience is required");
//       if (!selectedState) alert("State is required");
//       if (!profileImg) alert("Profile Image is required");
//       if (!selectedCity) alert("City is required");
//     }
//   };

//   // Handle Modal Form Submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());
//     saveDetail(modalType, data);
//     closeModal();
//   };

//   // Fetch Indian States
//   const indiaStates = State.getAllStates().filter(
//     (item) => item.countryCode === "IN"
//   );

//   // Define Expertise Types and Degrees
//   const expertiseTypes = [
//     "Developer",
//     "Designer",
//     "Cloud Devops",
//     "Content Creator",
//     "Digital Marketing",
//     "Lawyer",
//     "HR",
//     "Accountant",
//   ];

//   const degrees = ["High-School", "Bachelor", "Master", "PhD"];

//   // Callback to handle LinkedIn data
//   const handleLinkedInData = (data) => {
//     console.log("Received LinkedIn Data:", data); // Debugging
//     if (data) {
//       // Auto-fill Profile Fields
//       setFirstName(data.first_name || "");
//       setLastName(data.last_name || "");
//       setXpert(data.occupation || "");
//       setExperience(calculateExperience(data.experiences) || "");
//       setProfileImg(data.profile_pic_url || "");
//       setIsLinkedInFetched(true); // Set flag to hide sections

//       // Mapping state and city
//       if (data.state && data.city) {
//         const stateObj = State.getStatesOfCountry("IN").find(
//           (state) => state.name.toLowerCase() === data.state.toLowerCase()
//         );
//         if (stateObj) {
//           setSelectedState(stateObj.isoCode);
//           const stateCities = City.getCitiesOfState("IN", stateObj.isoCode);
//           setCities(stateCities);
//           const cityObj = stateCities.find(
//             (city) => city.name.toLowerCase() === data.city.toLowerCase()
//           );
//           if (cityObj) {
//             setSelectedCity(cityObj.name);
//           }
//         }
//       }

//       // Prefilling Education
//       if (data.education && Array.isArray(data.education)) {
//         const eduData = data.education.map((edu) => ({
//           degree: edu.degree_name || "",
//           stream: edu.field_of_study || "",
//           college: edu.school || "",
//           startDate: formatDate(edu.starts_at),
//           endDate: edu.ends_at ? formatDate(edu.ends_at) : "Present",
//           cgpa: edu.grade || "",
//         }));
//         setEducation(eduData);
//       }

//       // Prefilling Work Experience
//       if (data.experiences && Array.isArray(data.experiences)) {
//         const workData = data.experiences.map((exp) => ({
//           position: exp.title || "",
//           company: exp.company || "",
//           startDate: formatDate(exp.starts_at),
//           endDate: exp.ends_at ? formatDate(exp.ends_at) : "Present",
//         }));
//         setWork(workData);
//       }

//       // Prefilling Projects
//       if (
//         data.accomplishment_projects &&
//         Array.isArray(data.accomplishment_projects)
//       ) {
//         const projectData = data.accomplishment_projects.map((proj) => ({
//           projectName: proj.title || "",
//           duration: `${formatDate(proj.starts_at)} - ${
//             proj.ends_at ? formatDate(proj.ends_at) : "Present"
//           }`,
//           liveLink: proj.url || "",
//           description: proj.description || "",
//         }));
//         setProjects(projectData);
//       }

//       // Prefilling Skills
//       if (data.skills && Array.isArray(data.skills)) {
//         const skillData = data.skills.map((skill) => ({
//           skill: skill.name || "",
//         }));
//         setSkills(skillData);
//       }
//     }
//   };

//   // Helper function to calculate total experience
//   const calculateExperience = (experiences) => {
//     if (!experiences || experiences.length === 0) return "";
//     const currentDate = new Date();
//     let totalMonths = 0;
//     experiences.forEach((exp) => {
//       const start = new Date(
//         exp.starts_at.year,
//         exp.starts_at.month - 1,
//         exp.starts_at.day
//       );
//       const end = exp.ends_at
//         ? new Date(exp.ends_at.year, exp.ends_at.month - 1, exp.ends_at.day)
//         : currentDate;
//       const months =
//         (end.getFullYear() - start.getFullYear()) * 12 +
//         (end.getMonth() - start.getMonth());
//       totalMonths += months;
//     });
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;
//     return `${years} ${years > 1 ? "Years" : "Year"} ${
//       months > 0 ? `${months} ${months > 1 ? "Months" : "Month"}` : ""
//     }`;
//   };

//   // Helper function to format date
//   const formatDate = (dateObj) => {
//     if (!dateObj) return "";
//     const { year, month, day } = dateObj;
//     const date = new Date(year, month - 1, day);
//     return date.toLocaleDateString("default", {
//       month: "short",
//       year: "numeric",
//     });
//   };

//   return (
//     <Box sx={{ width: "100%", padding: 4, overflow: "hidden" }}>
//       {/* Stepper Navigation */}
//       <Stepper activeStep={activeStep} alternativeLabel>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       {/* Form Content */}
//       <Box sx={{ height: "80vh", overflow: "auto" }}>
//         {activeStep === 0 && (
//           <Grid container spacing={4} alignItems="flex-start">
//             {/* Left Column - Profile Fields */}
//             <Grid
//               item
//               xs={12}
//               md={4}
//               sx={{
//                 position: { md: "sticky" }, // Apply sticky positioning on medium and larger screens
//               }}
//             >
//               <Card sx={{ padding: 3, boxShadow: 3, width: "100%" }}>
//                 <CardContent>
//                   {/* Profile Image */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       mb: 4,
//                       position: "relative",
//                     }}
//                   >
//                     <input
//                       accept="image/*"
//                       style={{ display: "none" }}
//                       id="profile-image-upload"
//                       type="file"
//                       onChange={handleProfileImage}
//                     />
//                     <label htmlFor="profile-image-upload">
//                       <IconButton component="span">
//                         <Avatar
//                           src={
//                             profileImg
//                               ? profileImg
//                               : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
//                           }
//                           sx={{ width: 120, height: 120 }} // Increased size
//                         />
//                       </IconButton>
//                     </label>
//                     {profileImg && (
//                       <IconButton
//                         aria-label="clear"
//                         onClick={clearProfileImage}
//                         sx={{
//                           position: "absolute",
//                           top: 0,
//                           right: 0,
//                           backgroundColor: "rgba(255,255,255,0.7)",
//                           "&:hover": {
//                             backgroundColor: "rgba(255,255,255,1)",
//                           },
//                         }}
//                         size="small"
//                       >
//                         <ClearIcon fontSize="small" />
//                       </IconButton>
//                     )}
//                     <Typography
//                       variant="caption"
//                       color="textSecondary"
//                       sx={{ mt: 1 }}
//                     >
//                       Click to upload
//                     </Typography>
//                   </Box>

//                   {/* First Name */}
//                   <TextField
//                     label="First Name"
//                     variant="outlined"
//                     fullWidth
//                     value={FirstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     required
//                     size="small"
//                     sx={{ mb: 3 }}
//                   />

//                   {/* Last Name */}
//                   <TextField
//                     label="Last Name"
//                     variant="outlined"
//                     fullWidth
//                     value={LastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                     required
//                     size="small"
//                     sx={{ mb: 3 }}
//                   />

//                   {/* Expertise Type */}
//                   <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
//                     <InputLabel id="expertise-label">Xpert Type</InputLabel>
//                     <Select
//                       labelId="expertise-label"
//                       value={Xpert}
//                       label="Xpert Type"
//                       onChange={(e) => setXpert(e.target.value)}
//                     >
//                       {expertiseTypes.map((type) => (
//                         <MenuItem key={type} value={type}>
//                           {type}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   {/* Years of Experience */}
//                   <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
//                     <InputLabel id="experience-label">
//                       Years of Experience
//                     </InputLabel>
//                     <Select
//                       labelId="experience-label"
//                       value={Experience}
//                       label="Years of Experience"
//                       onChange={(e) => setExperience(e.target.value)}
//                     >
//                       {Array.from({ length: 20 }, (_, i) => i + 1).map(
//                         (year) => (
//                           <MenuItem key={year} value={year}>
//                             {year}
//                           </MenuItem>
//                         )
//                       )}
//                     </Select>
//                   </FormControl>

//                   {/* State */}
//                   <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
//                     <InputLabel id="state-label">State</InputLabel>
//                     <Select
//                       labelId="state-label"
//                       value={selectedState}
//                       label="State"
//                       onChange={(e) => handleStateChange(e.target.value)}
//                     >
//                       {indiaStates.map((state) => (
//                         <MenuItem key={state.isoCode} value={state.isoCode}>
//                           {state.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   {/* City */}
//                   <FormControl fullWidth required size="small">
//                     <InputLabel id="city-label">City</InputLabel>
//                     <Select
//                       labelId="city-label"
//                       value={selectedCity}
//                       label="City"
//                       onChange={(e) => setSelectedCity(e.target.value)}
//                       disabled={!selectedState}
//                     >
//                       {cities.map((city) => (
//                         <MenuItem key={city.id} value={city.name}>
//                           {city.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Right Column - LinkedInFetcher and Details Sections */}
//             <Grid item xs={12} md={8}>
//               {/* LinkedInFetcher */}
//               <Box sx={{ mb: 2 }}>
//                 <LinkedInFetcher onFetchSuccess={handleLinkedInData} />
//               </Box>

//               {/* Conditionally Render Sections Only If Not Fetched via LinkedIn */}
//               {!isLinkedInFetched && (
//                 <>
//                   {/* Education Section */}
//                   <Card sx={{ mb: 2, boxShadow: 2 }}>
//                     <CardHeader
//                       title="Education"
//                       titleTypographyProps={{ variant: "h6" }}
//                       action={
//                         <Button
//                           variant="contained"
//                           startIcon={<AddCircleOutlineIcon />}
//                           onClick={() => openModal("Education")}
//                           size="small"
//                           sx={{ textTransform: "none" }}
//                         >
//                           Add Education
//                         </Button>
//                       }
//                       sx={{ padding: 2 }}
//                     />
//                     <Divider />
//                     <CardContent sx={{ padding: 2 }}>
//                       {Education.map((item, index) => (
//                         <Box key={index} sx={{ mb: 3, position: "relative" }}>
//                           <IconButton
//                             aria-label="delete"
//                             size="small"
//                             sx={{ position: "absolute", top: 0, right: 0 }}
//                             onClick={() => deleteDetail("education", index)}
//                           >
//                             <FiTrash color="red" size={16} />
//                           </IconButton>
//                           <Typography variant="subtitle1">
//                             <strong>{item.degree}</strong> in {item.stream}
//                           </Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {item.college}
//                           </Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {item.startDate} - {item.endDate}
//                           </Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             CGPA: {item.cgpa}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </CardContent>
//                   </Card>

//                   {/* Skills Section */}
//                   <Card sx={{ mb: 2, boxShadow: 2 }}>
//                     <CardHeader
//                       title="Skills"
//                       titleTypographyProps={{ variant: "h6" }}
//                       action={
//                         <Button
//                           variant="contained"
//                           startIcon={<AddCircleOutlineIcon />}
//                           onClick={() => openModal("Skill")}
//                           size="small"
//                           sx={{ textTransform: "none" }}
//                         >
//                           Add Skill
//                         </Button>
//                       }
//                       sx={{ padding: 2 }}
//                     />
//                     <Divider />
//                     <CardContent sx={{ padding: 2 }}>
//                       {Skills.map((item, index) => (
//                         <Box key={index} sx={{ mb: 3, position: "relative" }}>
//                           <IconButton
//                             aria-label="delete"
//                             size="small"
//                             sx={{ position: "absolute", top: 0, right: 0 }}
//                             onClick={() => deleteDetail("skill", index)}
//                           >
//                             <FiTrash color="red" size={16} />
//                           </IconButton>
//                           <Typography variant="body1">{item.skill}</Typography>
//                         </Box>
//                       ))}
//                     </CardContent>
//                   </Card>

//                   {/* Work Experience Section */}
//                   <Card sx={{ mb: 2, boxShadow: 2 }}>
//                     <CardHeader
//                       title="Work Experience"
//                       titleTypographyProps={{ variant: "h6" }}
//                       action={
//                         <Button
//                           variant="contained"
//                           startIcon={<AddCircleOutlineIcon />}
//                           onClick={() => openModal("Work")}
//                           size="small"
//                           sx={{ textTransform: "none" }}
//                         >
//                           Add Experience
//                         </Button>
//                       }
//                       sx={{ padding: 2 }}
//                     />
//                     <Divider />
//                     <CardContent sx={{ padding: 2 }}>
//                       {Work.map((item, index) => (
//                         <Box key={index} sx={{ mb: 3, position: "relative" }}>
//                           <IconButton
//                             aria-label="delete"
//                             size="small"
//                             sx={{ position: "absolute", top: 0, right: 0 }}
//                             onClick={() => deleteDetail("work", index)}
//                           >
//                             <FiTrash color="red" size={16} />
//                           </IconButton>
//                           <Typography variant="subtitle1">
//                             <strong>{item.position}</strong> at {item.company}
//                           </Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {item.startDate} - {item.endDate}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </CardContent>
//                   </Card>

//                   {/* Projects/Assignments Section */}
//                   <Card sx={{ mb: 2, boxShadow: 2 }}>
//                     <CardHeader
//                       title="Projects/Assignments"
//                       titleTypographyProps={{ variant: "h6" }}
//                       action={
//                         <Button
//                           variant="contained"
//                           startIcon={<AddCircleOutlineIcon />}
//                           onClick={() => openModal("Project")}
//                           size="small"
//                           sx={{ textTransform: "none" }}
//                         >
//                           Add Project
//                         </Button>
//                       }
//                       sx={{ padding: 2 }}
//                     />
//                     <Divider />
//                     <CardContent sx={{ padding: 2 }}>
//                       {Projects.map((item, index) => (
//                         <Box key={index} sx={{ mb: 3, position: "relative" }}>
//                           <IconButton
//                             aria-label="delete"
//                             size="small"
//                             sx={{ position: "absolute", top: 0, right: 0 }}
//                             onClick={() => deleteDetail("project", index)}
//                           >
//                             <FiTrash color="red" size={16} />
//                           </IconButton>
//                           <Typography variant="subtitle1">
//                             <strong>{item.projectName}</strong>
//                           </Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {item.duration}
//                           </Typography>
//                           {item.liveLink && (
//                             <Typography variant="body2" color="primary">
//                               <a
//                                 href={item.liveLink}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 style={{ textDecoration: "none" }}
//                               >
//                                 Live Link
//                               </a>
//                             </Typography>
//                           )}
//                           <Typography variant="body2" color="textSecondary">
//                             {item.description}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//             </Grid>

//             {/* Navigation Buttons */}
//             <Grid item xs={12}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   mt: 2,
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => setActiveStep(1)}
//                   size="large"
//                 >
//                   Next Step
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         )}

//         {activeStep === 1 && (
//           <Grid container spacing={4}>
//             {/* Left Column - Profile Summary */}
//             <Grid item xs={12} md={4}>
//               <Card sx={{ padding: 3, boxShadow: 3, width: "100%" }}>
//                 <CardContent>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Avatar
//                       src={
//                         profileImg
//                           ? profileImg
//                           : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
//                       }
//                       sx={{ width: 120, height: 120 }} // Increased size
//                     />
//                     <Typography variant="h6" sx={{ mt: 3 }}>
//                       {FirstName} {LastName}
//                     </Typography>
//                     <Typography
//                       variant="body1"
//                       color="textSecondary"
//                       sx={{ mt: 1 }}
//                     >
//                       {Xpert}
//                     </Typography>
//                     <Typography variant="body1" color="textSecondary">
//                       {Experience} {Experience === 1 ? "Year" : "Years"} of
//                       Experience
//                     </Typography>
//                     <Typography
//                       variant="body1"
//                       color="textSecondary"
//                       sx={{ mt: 2 }}
//                     >
//                       {selectedCity},{" "}
//                       {
//                         State.getStateByCodeAndCountry(selectedState, "IN")
//                           ?.name
//                       }
//                     </Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Right Column - Offering Details */}
//             <Grid item xs={12} md={8}>
//               {/* Consulting Charges Section */}
//               <Card sx={{ mb: 4, boxShadow: 2, width: "100%" }}>
//                 <CardHeader
//                   title="Consulting Charges"
//                   titleTypographyProps={{ variant: "h6" }}
//                   sx={{ padding: 2 }}
//                 />
//                 <Divider />
//                 <CardContent sx={{ padding: 2 }}>
//                   <Grid container spacing={3} alignItems="center">
//                     <Grid item xs={12} sm={4}>
//                       <TextField
//                         label="Price (₹)"
//                         variant="outlined"
//                         fullWidth
//                         value={ConsultingPrice}
//                         onChange={(e) => setConsultingPrice(e.target.value)}
//                         required
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <TextField
//                         label="Duration"
//                         variant="outlined"
//                         fullWidth
//                         value={ConsultingDuration}
//                         onChange={(e) => setConsultingDuration(e.target.value)}
//                         required
//                         size="small"
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <FormControl fullWidth required size="small">
//                         <InputLabel id="duration-type-label">
//                           Duration Type
//                         </InputLabel>
//                         <Select
//                           labelId="duration-type-label"
//                           value={ConsultingDurationType}
//                           label="Duration Type"
//                           onChange={(e) =>
//                             setConsultingDurationType(e.target.value)
//                           }
//                         >
//                           <MenuItem value="per hour">Per Hour</MenuItem>
//                           <MenuItem value="per day">Per Day</MenuItem>
//                           <MenuItem value="per week">Per Week</MenuItem>
//                           <MenuItem value="per month">Per Month</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* Services Section */}
//               <Card sx={{ mb: 4, boxShadow: 2, width: "100%" }}>
//                 <CardHeader
//                   title="Services"
//                   titleTypographyProps={{ variant: "h6" }}
//                   action={
//                     <Button
//                       variant="contained"
//                       startIcon={<AddCircleOutlineIcon />}
//                       onClick={() => openModal("Service")}
//                       size="small"
//                       sx={{ textTransform: "none" }}
//                     >
//                       Add Service
//                     </Button>
//                   }
//                   sx={{ padding: 2 }}
//                 />
//                 <Divider />
//                 <CardContent sx={{ padding: 2 }}>
//                   {Services.map((item, index) => (
//                     <Box key={index} sx={{ mb: 3, position: "relative" }}>
//                       <IconButton
//                         aria-label="delete"
//                         size="small"
//                         sx={{ position: "absolute", top: 0, right: 0 }}
//                         onClick={() => deleteDetail("service", index)}
//                       >
//                         <FiTrash color="red" size={16} />
//                       </IconButton>
//                       <Typography variant="subtitle1">
//                         <strong>{item.serviceName}</strong>
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {item.serviceDescription}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         Price: ₹{item.servicePrice}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </CardContent>
//               </Card>

//               {/* Submit Button */}
//               <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => setActiveStep(0)}
//                   size="large"
//                   sx={{ mr: 2 }}
//                 >
//                   Back
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSubmitInfo}
//                   size="large"
//                 >
//                   Submit
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         )}

//         {/* You can add more steps here if needed */}
//       </Box>

//       {/* Modal Component */}
//       <Dialog
//         open={isModalOpen}
//         onClose={closeModal}
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{
//           sx: {
//             borderRadius: 3, // Slightly more rounded
//           },
//         }}
//       >
//         <DialogTitle sx={{ m: 0, p: 2 }}>
//           Add {modalType}
//           <IconButton
//             aria-label="close"
//             onClick={closeModal}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//             size="small"
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <form onSubmit={handleSubmit}>
//           <DialogContent dividers>
//             {modalType === "Education" && (
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Degree"
//                     name="degree"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Stream"
//                     name="stream"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="College"
//                     name="college"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Start Date"
//                     name="startDate"
//                     type="date"
//                     variant="outlined"
//                     fullWidth
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="End Date"
//                     name="endDate"
//                     type="date"
//                     variant="outlined"
//                     fullWidth
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="CGPA"
//                     name="cgpa"
//                     type="number"
//                     variant="outlined"
//                     fullWidth
//                     inputProps={{
//                       step: 0.1,
//                     }}
//                     required
//                     size="small"
//                   />
//                 </Grid>
//               </Grid>
//             )}

//             {modalType === "Skill" && (
//               <TextField
//                 label="Skill Name"
//                 name="skill"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 size="small"
//               />
//             )}

//             {modalType === "Work" && (
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Position"
//                     name="position"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Company"
//                     name="company"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Start Date"
//                     name="startDate"
//                     type="date"
//                     variant="outlined"
//                     fullWidth
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="End Date"
//                     name="endDate"
//                     type="date"
//                     variant="outlined"
//                     fullWidth
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     required
//                     size="small"
//                   />
//                 </Grid>
//               </Grid>
//             )}

//             {modalType === "Project" && (
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Project Name"
//                     name="projectName"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Duration"
//                     name="duration"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Live Link"
//                     name="liveLink"
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Description"
//                     name="description"
//                     variant="outlined"
//                     fullWidth
//                     multiline
//                     rows={3}
//                     required
//                     size="small"
//                   />
//                 </Grid>
//               </Grid>
//             )}

//             {modalType === "Service" && (
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Service Name"
//                     name="serviceName"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Service Description"
//                     name="serviceDescription"
//                     variant="outlined"
//                     fullWidth
//                     multiline
//                     rows={3}
//                     required
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Service Price (₹)"
//                     name="servicePrice"
//                     type="number"
//                     variant="outlined"
//                     fullWidth
//                     required
//                     size="small"
//                   />
//                 </Grid>
//               </Grid>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={closeModal}
//               color="secondary"
//               variant="outlined"
//               size="large"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               size="large"
//             >
//               Save
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </Box>
//   );
// }

