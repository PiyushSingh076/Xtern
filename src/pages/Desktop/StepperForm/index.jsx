import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Avatar,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { FiTrash } from "react-icons/fi";
import LinkedInLogo from "../../../assets/svg/linkedin.png";
import { State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { setDetail } from "../../../Store/Slice/UserDetail";
import { useNavigate , useLocation } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import LinkedInFetcher from "../../Teams/LinkedInFetcher";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AddPhotoAlternateIcon } from "@mui/icons-material";
import useSaveProfileData from "../../../hooks/Linkedin/useSaveProfileData";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import toast from "react-hot-toast";


export default function StepperForm() {

    // Form Detail Elements
  const [profileDatas , setProfileDatas] = useState()
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Xpert, setXpert] = useState();
  const [Experience, setExperience] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [Education, setEducation] = useState([]);
  const [Work, setWork] = useState([]);
  const [Skills, setSkills] = useState([]);
  const [value, setValue] = React.useState(2);
  const [Projects, setProjects] = useState([]);
  const [Services, setServices] = useState([]);
  const [ConsultingPrice, setConsultingPrice] = useState("");
  const [UserconsultingPrice, setUserconsultingPrice] = useState('');
  const [comission, setComission] = useState(0.2); 
  const [ConsultingDuration, setConsultingDuration] = useState("");
  const [ConsultingDurationType, setConsultingDurationType] = useState("");
  const [serviceData, setServiceData] = useState({});
  const [recommendations, setRecommendation] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveProfileData, loading } = useSaveProfileData();
  const { userData, loading: userDataLoading } = useFetchUserData();

  const uid = userData?.uid

  console.log(uid)




  console.log(Skills , 'skill')


    const location = useLocation();
  const { profileData } = location.state || {}; // Safely extract profileData

  console.log(profileData , 'edit')
  

 
  const dataRole = useSelector((state) => state.user);


 useEffect(() => {
  if (dataRole) {
    setXpert(dataRole.XpertType);
  }
}, [dataRole]);


console.log(Xpert , 'xpert')


  







  // Consulting Price Logic


  
  useEffect(() => {
    if (ConsultingPrice) {
      const price = parseFloat(ConsultingPrice);
      if (!isNaN(price)) {
        const reducedPrice = price - (price * comission); // Reducing commission
        setUserconsultingPrice(reducedPrice.toFixed(2)); // Set the reduced price
      }
    }
  }, [ConsultingPrice, comission]); // Dependency array includes both values

  // Flow control
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Profile", "Offering"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isLinkedInFetched, setIsLinkedInFetched] = useState(false); // Flag to check if LinkedIn data is fetched

  // Handle Profile Image Upload
  const handleProfileImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Clear Profile Image
  const clearProfileImage = () => {
    setProfileImg(null);
  };

  // Handle State Change
  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    const stateCities = City.getCitiesOfState("IN", stateCode);
    setCities(stateCities);
    setSelectedCity("");
  };

  // Open Modal
  const openModal = (type, data) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setServiceData({});
  };

  const expertiseTypes = [
    "Developer",
    "Designer",
    "Cloud Devops",
    "Content Creator",
    "Digital Marketing",
    "Lawyer",
    "HR",
    "Accountant",
  ];

  useEffect(() => {
    const recommendations = {
      Developer: [
        {
          title: "Web Development",
          description: "Build responsive and robust websites.",
        },
        {
          title: "App Development",
          description: "Create high-performance mobile applications.",
        },
        {
          title: "Backend Development",
          description: "Develop server-side applications and APIs.",
        },
        {
          title: "Database Management",
          description: "Design and maintain scalable databases.",
        },
      ],
      Designer: [
        {
          title: "Graphic Design",
          description: "Craft stunning visuals for branding.",
        },
        {
          title: "UI/UX Design",
          description: "Design user-friendly interfaces and experiences.",
        },
        {
          title: "Branding",
          description: "Develop brand identities and guidelines.",
        },
        {
          title: "Packaging Design",
          description: "Create attractive packaging designs for products.",
        },
      ],
      "Cloud Devops": [
        {
          title: "Cloud Setup",
          description: "Set up scalable cloud infrastructure.",
        },
        {
          title: "DevOps Automation",
          description: "Streamline CI/CD pipelines and processes.",
        },
        {
          title: "Server Management",
          description: "Manage and maintain cloud-based servers.",
        },
        {
          title: "Cloud Security",
          description: "Ensure secure and compliant cloud environments.",
        },
      ],
      "Content Creator": [
        {
          title: "Blog Writing",
          description: "Produce engaging and SEO-friendly articles.",
        },
        {
          title: "Video Production",
          description: "Create high-quality video content for platforms.",
        },
        {
          title: "Podcasting",
          description: "Create and produce engaging podcasts.",
        },
        {
          title: "Social Media Content",
          description: "Develop content for various social media platforms.",
        },
      ],
      "Digital Marketing": [
        {
          title: "SEO Optimization",
          description: "Improve website ranking on search engines.",
        },
        {
          title: "Social Media Campaigns",
          description: "Run targeted campaigns to grow audience.",
        },
        {
          title: "Email Marketing",
          description: "Create effective email campaigns to engage customers.",
        },
        {
          title: "Pay-Per-Click (PPC)",
          description: "Run paid search advertising campaigns for businesses.",
        },
      ],
      Lawyer: [
        {
          title: "Legal Advice",
          description: "Provide expert legal consultations.",
        },
        {
          title: "Contract Drafting",
          description: "Draft comprehensive legal agreements.",
        },
        {
          title: "Business Law",
          description: "Assist with business-related legal matters.",
        },
        {
          title: "Intellectual Property",
          description: "Help protect intellectual property rights.",
        },
        {
          title: "Family Law",
          description: "Assist with legal issues related to family matters.",
        },
        {
          title: "Criminal Defense",
          description: "Provide defense for individuals accused of crimes.",
        },
        {
          title: "Real Estate Law",
          description: "Assist with property and real estate legal matters.",
        },
        {
          title: "Employment Law",
          description: "Help resolve employment-related legal disputes.",
        },
        {
          title: "Immigration Law",
          description: "Provide legal services for immigration-related matters.",
        },
        {
          title: "Mergers & Acquisitions",
          description: "Assist with mergers, acquisitions, and corporate restructuring.",
        },
      ],
      HR: [
        {
          title: "Recruitment Services",
          description: "Find the right talent for your team.",
        },
        {
          title: "Employee Onboarding",
          description: "Streamline the onboarding process.",
        },
        {
          title: "Employee Training",
          description: "Develop training programs for employees.",
        },
        {
          title: "HR Consulting",
          description: "Provide HR strategy and compliance consulting.",
        },
      ],
      Accountant: [
        {
          title: "Tax Filing",
          description: "Ensure compliance with tax regulations.",
        },
        {
          title: "Financial Planning",
          description: "Help plan and manage your finances effectively.",
        },
        {
          title: "Bookkeeping",
          description: "Maintain accurate financial records.",
        },
        {
          title: "Investment Advisory",
          description: "Advise on personal and business investments.",
        },
      ],
      Default: [
        {
          title: "General Service",
          description: "Offer a range of customizable services.",
        },
      ],
   Intern : [
  {
    title: "Internship",
    description: "A temporary position offering hands-on experience, typically for students or recent graduates, to gain industry skills."
  },
  {
    title: "Full-Time",
    description: "A long-term, permanent employment position with fixed working hours and responsibilities."
  },
  {
    title: "Project-Basis",
    description: "A short-term contract role focused on completing specific projects or tasks within a set timeframe."
  }
]
    };
  
    // Set the recommendations based on XpertType
    setRecommendation(
      recommendations[Xpert] || recommendations.Default
    );
   
  }, [Xpert]);




  const handleRecommendationClick = (rec) => {
    const serviceData = {
      serviceName: rec.title,
      serviceDescription: rec.description,
      servicePrice: "",
    };
    setServiceData(serviceData);
    openModal("Service");
  };

  // Save Detail
  const saveDetail = (type, data) => {
    switch (type.toLowerCase()) {
      case "education":
        setEducation([...Education, data]);
        break;
      case "work":
        setWork([...Work, data]);
        break;
      case "skill":
        setSkills([...Skills, data]);
        break;
      case "project":
        setProjects([...Projects, data]);
        break;
      case "service":
        setServices([...Services, data]);
        break;
      default:
        console.error("Invalid type");
    }
  };

  // Delete Detail
  const deleteDetail = (type, index) => {
    switch (type.toLowerCase()) {
      case "education":
        setEducation(Education.filter((_, i) => i !== index));
        break;
      case "work":
        setWork(Work.filter((_, i) => i !== index));
        break;
      case "skill":
        setSkills(Skills.filter((_, i) => i !== index));
        break;
      case "project":
        setProjects(Projects.filter((_, i) => i !== index));
        break;
      case "service":
        setServices(Services.filter((_, i) => i !== index));
        break;
      default:
        console.error("Invalid type");
    }
  };
  // Handle form submission
  const handleSubmitInfo = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate required fields
    if (
      FirstName &&
      LastName &&
      dataRole.XpertType &&
      Experience &&
      selectedState &&
      profileImg &&
      selectedCity
    ) {
      const data = {
        profileImage: profileImg,
        firstName: FirstName,
        lastName: LastName,
        experience: Experience,
        type: dataRole.XpertType,
        state: selectedState,
        city: selectedCity,
        education: Education,
        work: Work,
        skills: Skills,
        projects: Projects,
        services: Services,
        consultingPrice: ConsultingPrice,
        consultingDuration: ConsultingDuration,
        consultingDurationType: ConsultingDurationType,
      };

      console.log("Form Data:", data);

      // Dispatch to Redux store (if necessary)
      dispatch(setDetail(data));

      try {
        // Save to Firestore
        await saveProfileData(data);
        // Show success toast // Replace with your actual route
      } catch (error) {
        // Show error toast
        toast.error(`Error saving data: ${error.message || error}`);
        console.log(error);
      }
    } else {
      // Display specific toast alerts
      if (!FirstName) toast.error("First Name is required");
      if (!LastName) toast.error("Last Name is required");
      if (!Xpert) toast.error("Xpert Type is required");
      if (!Experience) toast.error("Years of Experience is required");
      if (!selectedState) toast.error("State is required");
      if (!profileImg) toast.error("Profile Image is required");
      if (!selectedCity) toast.error("City is required");
    }
  };

  // Handle Modal Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Check if an image is uploaded
    const imageFile = formData.get("projectImage");
    const Fdata = Object.fromEntries(formData.entries());

    // Include image file or Base64 string in the data object
    if (imageFile && imageFile instanceof File) {
      // If you want to convert it to Base64 (optional)
      const reader = new FileReader();
      reader.onload = () => {
        Fdata.projectImage = reader.result; // Base64 string of the image
        saveDetail(modalType, Fdata);
      };
      reader.readAsDataURL(imageFile); // Convert to Base64
    } else {
      saveDetail(modalType, Fdata);
    }

    console.log(Fdata, "Submitted Data");
    closeModal();
  };

  // Fetch Indian States
  const indiaStates = State.getAllStates().filter(
    (item) => item.countryCode === "IN"
  );

  // Define Expertise Types and Degrees

  const degrees = ["High-School", "Bachelor", "Master", "PhD"];


    
   


    // Edit Pre-filled

    useEffect(()=>{
  if (profileData) {
    setFirstName(profileData?.firstName || "");
    setLastName(profileData?.lastName || "");
    setXpert(profileData?.type || "");
    setExperience(userData?.experience || '0');
    setProfileImg(profileData?.photo_url || "");
    setIsLinkedInFetched(true); 
    setSelectedCity(profileData?.city)
    setSelectedState(profileData?.state)
    setConsultingPrice(profileData?.consultingPrice)
    setConsultingDurationType(profileData?.consultingDurationType)
    setConsultingDuration(profileData?.consultingDuration)


    console.log(selectedCity , 'city')
    console.log(selectedState , 'state')


    if (profileData?.educationDetails && Array.isArray(profileData?.educationDetails)) {
      const eduData = profileData?.educationDetails.map((edu) => ({
        degree: edu.degree || "",
        stream: edu.stream || "",
        college: edu.college || "",
        startDate: formatDate(edu.startDate),
        endDate: edu.ends_at ? formatDate(edu.endDate) : "Present",
        cgpa: edu.cpga || "",
      }));
      setEducation(eduData);
      console.log(Education)
    }

    if (profileData?.workExperience && Array.isArray(profileData?.workExperience)) {
      const workData = profileData?.workExperience.map((exp) => ({
        position: exp.role || "",
        company: exp.companyName || "",
        startDate: formatDate(exp.startDate.seconds),
        endDate: exp.ends_at ? formatDate(exp.endDate.seconds) : "Present",
      }));
      setWork(workData);
      console.log(Work)
    }

    if (profileData?.skillSet && Array.isArray(profileData?.skillSet)) {
      const skillData = profileData?.skillSet.map((skill) => ({
        skill: skill.skill || "",
        skillRating: skill.skillRating || "",


      }));
      setSkills(skillData);
    }

    if (profileData?.projectDetails && Array.isArray(profileData?.projectDetails)) {
      const projectData = profileData?.projectDetails.map((proj) => ({
        projectName: proj.projectName || "",
        duration: `${formatDate(proj.startDate)} - ${
          proj.ends_at ? formatDate(proj.endDate) : "Present"
        }`,
        liveLink: proj.liveDemo || "",
        description: proj.description || "",
      }));
      setProjects(projectData);
    }

    if (profileData?.serviceDetails && Array.isArray(profileData?.serviceDetails)) {
      const projectData = profileData?.serviceDetails.map((service) => ({
        serviceName: service.serviceName || "",
        serviceDescription: service.serviceDescription || '',
        servicePrice: service.servicePrice || '',
        serviceDuration: service.serviceDuration || '',
        serviceDurationType: service.serviceDurationType || '',
      }));
      setServices(projectData);
    }
  }
}, [profileData, isLinkedInFetched])
     

    



      






  // Callback to handle LinkedIn data
  const handleLinkedInData = (data) => {
    console.log("Received LinkedIn Data:", data); // Debugging



    if (data) {
      // Auto-fill Profile Fields
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setXpert(data.occupation || "");
      setExperience(calculateExperience(data.experiences) || "");
      setProfileImg(data.profile_pic_url || "");
      setIsLinkedInFetched(true); // Set flag to hide sections

      // Mapping state and city
      if (data.state && data.city) {
        const stateObj = State.getStatesOfCountry("IN").find(
          (state) => state.name.toLowerCase() === data.state.toLowerCase()
        );
        if (stateObj) {
          setSelectedState(stateObj.isoCode);
          const stateCities = City.getCitiesOfState("IN", stateObj.isoCode);
          setCities(stateCities);
          const cityObj = stateCities.find(
            (city) => city.name.toLowerCase() === data.city.toLowerCase()
          );
          if (cityObj) {
            setSelectedCity(cityObj.name);
          }
        }
      }

      // Prefilling Education
      if (data.education && Array.isArray(data.education)) {
        const eduData = data.education.map((edu) => ({
          degree: edu.degree_name || "",
          stream: edu.field_of_study || "",
          college: edu.school || "",
          startDate: formatDate(edu.starts_at),
          endDate: edu.ends_at ? formatDate(edu.ends_at) : "Present",
          cgpa: edu.grade || "",
        }));
        setEducation(eduData);
      }

      // Prefilling Work Experience
      if (data.experiences && Array.isArray(data.experiences)) {
        const workData = data.experiences.map((exp) => ({
          position: exp.title || "",
          company: exp.company || "",
          startDate: formatDate(exp.starts_at),
          endDate: exp.ends_at ? formatDate(exp.ends_at) : "Present",
        }));
        setWork(workData);
      }

      // Prefilling Projects
      if (
        data.accomplishment_projects &&
        Array.isArray(data.accomplishment_projects)
      ) {
        const projectData = data.accomplishment_projects.map((proj) => ({
          projectName: proj.title || "",
          duration: `${formatDate(proj.starts_at)} - ${
            proj.ends_at ? formatDate(proj.ends_at) : "Present"
          }`,
          liveLink: proj.url || "",
          description: proj.description || "",
        }));
        setProjects(projectData);
      }

      // Prefilling Skills
      if (data.skills && Array.isArray(data.skills)) {
        const skillData = data.skills.map((skill) => ({
          skill: skill.name || "",
        }));
        setSkills(skillData);
      }
    }
  };

  // Helper function to calculate total experience
  const calculateExperience = (experiences) => {
    if (!experiences || experiences.length === 0) return "";
    const currentDate = new Date();
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(
        exp.starts_at.year,
        exp.starts_at.month - 1,
        exp.starts_at.day
      );
      const end = exp.ends_at
        ? new Date(exp.ends_at.year, exp.ends_at.month - 1, exp.ends_at.day)
        : currentDate;
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += months;
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years} ${years > 1 ? "Years" : "Year"} ${
      months > 0 ? `${months} ${months > 1 ? "Months" : "Month"}` : ""
    }`;
  };

  // Helper function to format date
  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const { year, month, day } = dateObj;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ width: "100%", padding: 4, overflow: "hidden" }}>
      {/* Stepper Navigation */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Form Content */}
      <Box sx={{ height: "80vh", overflow: "auto" }}>
        {activeStep === 0 && (
          <Grid container spacing={4} alignItems="flex-start">
            {/* Left Column - Profile Fields */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                position: { md: "sticky" }, // Apply sticky positioning on medium and larger screens
              }}
            >
              <Card sx={{ padding: 3, boxShadow: 3, width: "100%" }}>
                <CardContent>
                  {/* Profile Image */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 4,
                      position: "relative",
                    }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleProfileImage}
                    />
                    <label htmlFor="profile-image-upload">
                      <IconButton component="span">
                        <Avatar
                          src={
                            profileImg
                              ? profileImg
                              : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
                          }
                          sx={{ width: 120, height: 120 }} // Increased size
                        />
                      </IconButton>
                    </label>
                    {profileImg && (
                      <IconButton
                        aria-label="clear"
                        onClick={clearProfileImage}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,1)",
                          },
                        }}
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Click to upload
                    </Typography>
                  </Box>

                  {/* First Name */}
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    size="small"
                    sx={{ mb: 3 }}
                  />

                  {/* Last Name */}
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={LastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    size="small"
                    sx={{ mb: 3 }}
                  />

                  {/* Expertise Type */}
                  {/* <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="expertise-label">Xpert Type</InputLabel>
                    <Select
                      labelId="expertise-label"
                      value={Xpert}
                      label="Xpert Type"
                      onChange={(e) => setXpert(e.target.value)}
                    >
                      {expertiseTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}

                  {/* Years of Experience */}
                  <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="experience-label">
                      Years of Experience
                    </InputLabel>
                    <Select
                      labelId="experience-label"
                      value={Experience}
                      label="Years of Experience"
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <MenuItem value=">1">{'less than 1'}</MenuItem>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  {/* State */}
                  <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      value={selectedState}
                      label="State"
                      onChange={(e) => handleStateChange(e.target.value)}
                    >
                      {indiaStates.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* City */}
                  <FormControl fullWidth required size="small">
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                      labelId="city-label"
                      value={selectedCity}
                      label="City"
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedState}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.id} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - LinkedInFetcher and Details Sections */}
            <Grid
              sx={{
                marginTop: "10px",
              }}
              item
              xs={12}
              md={8}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  height: "50px",
                  marginBottom: "20px",
                }}
              >
                <div
                  onClick={() => setIsLinkedInFetched(false)}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={LinkedInLogo}
                    alt="LinkedIn Logo"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <span>Import Linkedin Profile</span>
                </div>
              </Box>

              {/* LinkedInFetcher */}
              {!isLinkedInFetched && (
                <Box sx={{ mb: 2 }}>
                  <LinkedInFetcher
                    close={setIsLinkedInFetched}
                    onFetchSuccess={handleLinkedInData}
                  />
                </Box>
              )}

              {/* Conditionally Render Sections Only If Not Fetched via LinkedIn */}

              <>

              <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Skills"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Skill")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Skill
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Skills.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 3,
                          position: "relative",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("skill", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Typography variant="body1">
                          {item.skill.charAt(0).toUpperCase() +
                            item.skill.slice(1)}
                        </Typography>
                        <Rating
                          name="half-rating-read"
                          defaultValue={item.skillRating || 0}
                          size="small"
                          readOnly
                          sx={{ color: "#3498db" }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Education Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Education"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Education")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Education
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Education.map((item, index) => (
                      <Box key={index} sx={{ mb: 3, position: "relative" }}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("education", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                          }}
                        >
                          <Box>
                            {/* <img src={item.projectImage} alt="image" width={'140px'} /> */}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              <strong>{item.degree}</strong> in {item.stream}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.college}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.startDate} - {item.endDate}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              CGPA: {item.cgpa}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills Section */}
               

                {/* Work Experience Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Work Experience"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Work")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Experience
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Work.map((item, index) => (
                      <Box key={index} sx={{ mb: 3, position: "relative" }}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("work", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                          }}
                        >
                          <Box>
                            {/* <img src={item.projectImage} alt="image" width={'140px'} /> */}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              <strong>{item.position}</strong> at {item.company}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.startDate} - {item.endDate}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Projects/Assignments Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Projects/Assignments"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Project")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Project
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Projects.map((item, index) => (
                      <Box key={index} sx={{ mb: 3, position: "relative" }}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("project", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "20px",
                            }}
                          >
                            {/* <img src={item.projectImage} alt="image" width={'140px'} /> */}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              <strong>{item.projectName}</strong>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.duration}
                            </Typography>
                            {item.liveLink && (
                              <Typography variant="body2" color="primary">
                                <a
                                  href={item.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: "none" }}
                                >
                                  Live Link
                                </a>
                              </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </>
            </Grid>

            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveStep(1)}
                  size="large"
                >
                  Next Step
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={4}>
            {/* Left Column - Profile Summary */}
            <Grid item xs={12} md={4}>
              <Card sx={{ padding: 3, boxShadow: 3, width: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={
                        profileImg
                          ? profileImg
                          : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
                      }
                      sx={{ width: 120, height: 120 }} // Increased size
                    />
                    <Typography variant="h6" sx={{ mt: 3 }}>
                      {FirstName} {LastName}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      {Xpert}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {Experience} {Experience === 1 ? "Year" : "Years"} of
                      Experience
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mt: 2 }}
                    >
                      {selectedCity},{" "}
                      {
                        State.getStateByCodeAndCountry(selectedState, "IN")
                          ?.name
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Offering Details */}
            <Grid item xs={12} md={8}>
              {/* Consulting Charges Section */}
    {Xpert != 'Intern'  &&   <Card sx={{ mb: 4, boxShadow: 2, width: "100%" }}>
                <CardHeader
                  title="Consulting Charges"
                  titleTypographyProps={{ variant: "h6" }}
                  sx={{ padding: 2 }}
                />
                <Divider />
 
                <CardContent sx={{ padding: 2 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Price (₹)"
                        variant="outlined"
                        fullWidth
                        
                        onChange={(e) => {
                          const inputPrice = parseFloat(e.target.value);
                          if (!isNaN(inputPrice)) {
                            setConsultingPrice(inputPrice); 
                          }
                        }}
                        required
                        size="small"
                      />
                    </Grid>
                 
                    <Grid item xs={12} sm={4}>
                       <Typography>Per Minute</Typography>
                    </Grid>
                  </Grid>

                  <CardContent>
  {ConsultingPrice !== '' && ConsultingPrice !== 0 && (
    <Typography variant="body1">
      Your Recieved: ₹{UserconsultingPrice}
  
    </Typography>
  
  )}



  {ConsultingPrice !== '' && ConsultingPrice !== 0 && (
    <p style={{ fontSize: '8px', color: '#009DED' }}>
      20% will be deducted as Platform charge
    </p>
  )}
</CardContent>
                </CardContent>
              </Card>}

              {/* Services Section */}
              <Card sx={{ mb: 4, boxShadow: 2, width: "100%" }}>
                <CardHeader
                  title="Services"
                  titleTypographyProps={{ variant: "h6" }}
                  action={
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => openModal("Service")}
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      Add Service
                    </Button>
                  }
                  sx={{ padding: 2 }}
                />
                <Divider />
                <CardContent sx={{ padding: 2 }}>
                  {Services.map((item, index) => (
                    <Box key={index} sx={{ mb: 3, position: "relative" }}>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => deleteDetail("service", index)}
                      >
                        <FiTrash color="red" size={16} />
                      </IconButton>
                      <Typography variant="subtitle1">
                        <strong>{item.serviceName}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.serviceDescription}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price: ₹{item.servicePrice}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendation Section */}
           <Card sx={{ mb: 4, boxShadow: 2, width: "100%" }}>
                <CardHeader
                  title="Services Recommendations"
                  titleTypographyProps={{ variant: "h6" }}
                  sx={{ padding: 2 }}
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    {recommendations.map((rec, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          sx={{
                            boxShadow: 1,
                            cursor: "pointer",
                            ":hover": { boxShadow: 3 },
                            padding: 2,
                          }}
                          onClick={() => handleRecommendationClick(rec)}
                        >
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>{rec.title}</strong>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {rec.description}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setActiveStep(0)}
                  size="large"
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitInfo}
                  size="large"
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* You can add more steps here if needed */}
      </Box>

      {/* Modal Component */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3, // Slightly more rounded
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Add {modalType}
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {modalType === "Education" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    onClick={() => document.getElementById("add-logo").click()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dotted #ccc",
                      padding: 2,
                      height: "100px",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#ccc" }}>
                      Add logo
                    </Typography>
                  </Box>
                  <input
                    id="add-logo"
                    type="file"
                    accept="image/*"
                    name="projectImage"
                    onChange={(e) => console.log(e.target.files[0])}
                    style={{ marginBottom: 20, display: "none" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Degree"
                    name="degree"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Stream"
                    name="stream"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="College"
                    name="college"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="CGPA"
                    name="cgpa"
                    type="number"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      step: 0.1,
                    }}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            {modalType === "Skill" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <TextField
                  sx={{ width: "60%" }}
                  label="Skill Name"
                  name="skill"
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                />
                <Box
                  sx={{
                    height: "42px",
                  }}
                >
                  <Typography
                    sx={{
                      marginLeft: "2px",
                      color: "#1876D2",
                      fontSize: "14px",
                    }}
                    component="legend"
                  >
                    Self-Rating
                  </Typography>
                  <Rating
                    size="large"
                    name="skill-rating"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    sx={{
                      fontSize: "3rem",
                      color: "#3498db",
                      "& .MuiRating-iconFilled": {
                        color: "#3498db",
                      },
                      "& .MuiRating-iconHover": {
                        color: "#2e6da4",
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            {modalType === "Work" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    onClick={() => document.getElementById("add-logo").click()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dotted #ccc",
                      padding: 2,
                      height: "100px",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#ccc" }}>
                      Add logo
                    </Typography>
                  </Box>
                  <input
                    id="add-logo"
                    type="file"
                    accept="image/*"
                    name="projectImage"
                    onChange={(e) => console.log(e.target.files[0])}
                    style={{ marginBottom: 20, display: "none" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Position"
                    name="position"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Company"
                    name="company"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            {modalType === "Project" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    onClick={() => document.getElementById("add-logo").click()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dotted #ccc",
                      padding: 2,
                      height: "100px",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#ccc" }}>
                      Select Image
                    </Typography>
                  </Box>
                  <input
                    id="add-logo"
                    type="file"
                    accept="image/*"
                    name="projectImage"
                    onChange={(e) => console.log(e.target.files[0])}
                    style={{ marginBottom: 20, display: "none" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Project Name"
                    name="projectName"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Duration"
                    name="duration"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Live Link"
                    name="liveLink"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            {modalType === "Service" && (
          <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Service Name"
              name="serviceName"
              variant="outlined"
              fullWidth
              required
              size="small"
              value={serviceData.serviceName}
              onChange={(e) =>
                setServiceData({
                  ...serviceData,
                  serviceName: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Service Description"
              name="serviceDescription"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              required
              size="small"
              value={serviceData.serviceDescription}
              onChange={(e) =>
                setServiceData({
                  ...serviceData,
                  serviceDescription: e.target.value,
                })
              }
            />
          </Grid>
          <Grid container spacing={3} item xs={12}>
            <Grid item xs={4}>
              <TextField
                label="Service Price (₹)"
                name="servicePrice"
                type="number"
                variant="outlined"
                fullWidth
                required
                size="small"
                value={serviceData.servicePrice}
                onChange={(e) =>
                  setServiceData({
                    ...serviceData,
                    servicePrice: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>

           <Grid item xs={4}>
              <TextField
                label="Timeline"
                name="duration"
                type="number"
                variant="outlined"
                fullWidth
                required
                size="small"
                value={serviceData.duration}
                onChange={(e) =>
                  setServiceData({
                    ...serviceData,
                    duration: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
           <TextField
  label="Timeline Type"
  name="durationType"
  select
  variant="outlined"
  fullWidth
  required
  size="small"
  value={serviceData.durationType || 'day'}
  onChange={(e) =>
    setServiceData({
      ...serviceData,
      durationType: e.target.value,
    })
  }
>
  <MenuItem value="day">Day</MenuItem>
  <MenuItem value="week">Week</MenuItem>
  <MenuItem value="month">Month</MenuItem>
</TextField>
            </Grid>


        </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeModal}
              color="secondary"
              variant="outlined"
              size="large"
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              type="submit" // Changed from onClick to type="submit" for better form handling
              size="large"
              disabled={loading} // Disable the button when loading is true
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              } // Optional: Add spinner before text
            >
              {
                profileData?.firstName ? "Edit" : "Submit"
              }
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
