// src/Components/Admin/Profile/StepperForm.jsx

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
  Chip,
  Rating,
} from "@mui/material";
import { FiTrash, FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setDetail } from "../../../Store/Slice/UserDetail";
import { useNavigate, useLocation } from "react-router-dom";
import { State, City } from "country-state-city";
import LinkedInFetcher from "../../Teams/LinkedInFetcher";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import XpertRole from "../Prefference/XpertRole";
import LinkedInLogo from "../../../assets/svg/linkedin.png";
import useSaveProfileData from "../../../hooks/Linkedin/useSaveProfileData";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import toast from "react-hot-toast";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
// import XpertRole from "../Prefference/XpertRole";
import SummaryStep from "./SummaryStep";
import useAuthState from "../../../hooks/Authentication/useAuthState";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { RichEditor } from "../../../components/RichEditor";

/**
 * Some roles (astrologist, lawyer) have "consulting charges"
 */
const consultingChargesConfig = {
  astrologist: true,
  lawyer: true,
};

/** For LinkedIn experiences date calculations */
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

  return `${years} ${years > 1 ? "Years" : "Year"} ${months > 0 ? `${months} ${months > 1 ? "Months" : "Month"}` : ""
    }`;
};

export default function StepperForm() {
  const [saving, setSaving] = useState(false);

  // Basic personal data
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const { setRefreshCount } = useAuthState();
  const [Xpert, setXpert] = useState("");
  const [Experience, setExperience] = useState(""); // Usually a string or number
  const [profileImg, setProfileImg] = useState(null);

  // Location
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Arrays for user details
  const [Education, setEducation] = useState([]);
  const [Work, setWork] = useState([]);
  const [Skills, setSkills] = useState([]);
  const [Projects, setProjects] = useState([]);
  const [Services, setServices] = useState([]);

  // Consulting
  const [ConsultingPrice, setConsultingPrice] = useState("");
  const [UserconsultingPrice, setUserconsultingPrice] = useState("");
  const [comission] = useState(0.2);
  const [ConsultingDuration, setConsultingDuration] = useState("");
  const [ConsultingDurationType, setConsultingDurationType] = useState("");

  const [serviceData, setServiceData] = useState({});
  const [recommendations, setRecommendation] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Xpert Type", "Profile", "Offering", "Summary"];
  const [isStep2Complete, setIsStep2Complete] = useState(false);

  // For LinkedIn fetch
  const [isLinkedInFetched, setIsLinkedInFetched] = useState(false);

  // For editing items in modals

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Single object that holds form data for the modal
  const [modalFormData, setModalFormData] = useState({});

  const [loadingg, setLoadingg] = useState(false);

  // Redux / Navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveProfileData, loading } = useSaveProfileData();
  const { userData } = useFetchUserData();
  const { refreshUser } = useAuth();
  // If user clicked "edit" with existing profile
  const location = useLocation();
  const { profileData } = location.state || {};

  // Xpert from Redux
  const dataRole = useSelector((state) => state.user);

  // If there's a global XpertType, use it
  useEffect(() => {
    if (dataRole && dataRole.XpertType) {
      setXpert(dataRole.XpertType);
    }
  }, [dataRole]);

  // If user has a consulting price, compute net after commission
  useEffect(() => {
    if (ConsultingPrice) {
      const price = parseFloat(ConsultingPrice);
      if (!isNaN(price)) {
        const net = price - price * comission;
        setUserconsultingPrice(net.toFixed(2));
      } else {
        setUserconsultingPrice("");
      }
    } else {
      setUserconsultingPrice("");
    }
  }, [ConsultingPrice, comission]);

  // If there's a profileData, jump to step 1
  useEffect(() => {
    if (profileData) {
      setActiveStep(1);
    }
  }, [profileData]);

  // States in India
  const indiaStates = State.getAllStates().filter(
    (item) => item.countryCode === "IN"
  );

  // Changing the state -> load city list
  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    const stateCities = City.getCitiesOfState("IN", stateCode);
    setCities(stateCities);
    setSelectedCity("");
  };

  const Badges = [
    { name: "Top Rated", color: "success" },
    { name: "Certified Expert", color: "warning" },
  ];

  useEffect(() => {
    const recommendationsConfig = {
      developer: [
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
      designer: [
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
      "cloud devops": [
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
      "content creator": [
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
      "digital marketing": [
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
      lawyer: [
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
          description:
            "Provide legal services for immigration-related matters.",
        },
        {
          title: "Mergers & Acquisitions",
          description:
            "Assist with mergers, acquisitions, and corporate restructuring.",
        },
      ],
      hr: [
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
      accountant: [
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
      astrologist: [
        {
          title: "Personal Astrology",
          description: "Provide personalized astrological readings.",
        },
        {
          title: "Business Astrology",
          description: "Offer astrological insights for business decisions.",
        },
        {
          title: "Horoscope Creation",
          description: "Create detailed horoscopes for clients.",
        },
        {
          title: "Astrological Counseling",
          description: "Provide guidance based on astrological analysis.",
        },
      ],
      default: [
        {
          title: "General Service",
          description: "Offer a range of customizable services.",
        },
      ],
      intern: [
        {
          title: "Internship",
          description:
            "A temporary position offering hands-on experience, typically for students or recent graduates, to gain industry skills.",
        },
        {
          title: "Full-Time",
          description:
            "A long-term, permanent employment position with fixed working hours and responsibilities.",
        },
        {
          title: "Project-Basis",
          description:
            "A short-term contract role focused on completing specific projects or tasks within a set timeframe.",
        },
      ],
    };

    if (Xpert && typeof Xpert === "string") {
      setRecommendation(
        recommendationsConfig[Xpert.toLowerCase()] ||
        recommendationsConfig.default
      );
    } else {
      setRecommendation(recommendationsConfig.default);
    }
  }, [Xpert]);

  // const handleRecommendationClick = (rec) => {
  //   const serviceData = {
  //     serviceName: rec.title,
  //     serviceDescription: rec.description,
  //     servicePrice: "",
  //     duration: "",
  //     durationType: "",
  //     // Add intern-specific fields if Xpert is intern
  //     ...(Xpert.toLowerCase() === "intern" && {
  //       startDate: "",
  //       endDate: "",
  //       availability: "full time",
  //       hoursPerDay: "",
  //     }),
  //   };
  //   setServiceData(serviceData);
  //   openModal("Service");
  // };

  // const saveDetail = (type, data) => {
  //   switch (type.toLowerCase()) {
  //     case "education":
  //       setEducation([...Education, data]);
  //       break;
  //     case "work":
  //       setWork([...Work, data]);
  //       break;
  //     case "skill":
  //       setSkills([...Skills, data]);
  //       break;
  //     case "project":
  //       setProjects([...Projects, data]);
  //       break;
  //     case "service":
  //       setServices([...Services, data]);
  //       break;
  //     default:
  //       console.error("Invalid type");
  //   }
  // };

  // const deleteDetail = (type, index) => {
  //   switch (type.toLowerCase()) {
  //     case "education":
  //       setEducation(Education.filter((_, i) => i !== index));
  //       break;
  //     case "work":
  //       setWork(Work.filter((_, i) => i !== index));
  //       break;
  //     case "skill":
  //       setSkills(Skills.filter((_, i) => i !== index));
  //       break;
  //     case "project":
  //       setProjects(Projects.filter((_, i) => i !== index));
  //       break;
  //     case "service":
  //       setServices(Services.filter((_, i) => i !== index));
  //       break;
  //     default:
  //       console.error("Invalid type");
  //   }
  // }
  // Profile image
  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const clearProfileImage = () => {
    setProfileImg(null);
  };

  // Step Navigation
  const handleStepClick = (step) => {
    // Validation logic
    if (step === 3 && !isStep2Complete) {
      toast.error(
        "Please submit your profile data before proceeding to the Summary."
      );
      return;
    }

    // Allow navigation to other steps
    setActiveStep(step);
  };

  // If we already had a user profile (editing), load it
  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || "");
      setLastName(profileData.lastName || "");
      setXpert(profileData.Type || profileData.type || "");
      setExperience(profileData.experience || "0");
      setProfileImg(profileData.photo_url || "");
      setIsLinkedInFetched(true);

      if (profileData.state) {
        setSelectedState(profileData.state);
        const stateCities = City.getCitiesOfState("IN", profileData.state);
        setCities(stateCities);
        if (profileData.city) {
          setSelectedCity(profileData.city);
        }
      }

      setConsultingPrice(profileData.consultingPrice || "");
      setConsultingDurationType(profileData.consultingDurationType || "");
      setConsultingDuration(profileData.consultingDuration || "");

      // Education
      if (
        profileData.educationDetails &&
        Array.isArray(profileData.educationDetails)
      ) {
        const eduData = profileData.educationDetails.map((edu) => ({
          degree: edu.degree || "",
          stream: edu.stream || "",
          college: edu.collegename || "",
          startDate: edu.startyear ? edu.startyear?.split("T")[0] : "",
          endDate:
            edu.endyear && !edu.ends_at ? edu.endyear?.split("T")[0] : "", // or "Present" if you want
          cgpa: edu.cgpa || "",
        }));
        setEducation(eduData);
      }

      // Work
      if (
        profileData.workExperience &&
        Array.isArray(profileData.workExperience)
      ) {
        const workData = profileData.workExperience.map((exp) => ({
          position: exp.role || "",
          company: exp.companyName || "",
          startDate: exp.startDate ? exp.startDate?.split("T")[0] : "",
          endDate:
            exp.endDate && !exp.ends_at ? exp.endDate?.split("T")[0] : "",
          description: exp.description || "",
        }));
        setWork(workData);
      }

      // Skills
      if (profileData.skillSet && Array.isArray(profileData.skillSet)) {
        const sData = profileData.skillSet.map((skill) => ({
          skill: skill.skill || "",
          skillRating: skill.skillRating || 0,
        }));
        setSkills(sData);
      }

      // Projects
      if (
        profileData.projectDetails &&
        Array.isArray(profileData.projectDetails)
      ) {
        const projData = profileData.projectDetails.map((proj) => ({
          projectName: proj.projectName || "",

          duration: proj.duration || "",

          liveLink: proj.liveDemo || "",
          description: proj.description || "",
        }));
        setProjects(projData);
      }

      // Services
      if (
        profileData.serviceDetails &&
        Array.isArray(profileData.serviceDetails)
      ) {
        const servData = profileData.serviceDetails.map((service) => ({
          serviceName: service.serviceName || "",
          serviceDescription: service.serviceDescription || "",
          servicePrice: service.servicePrice || "",
          duration: service.serviceDuration || "",
          durationType: service.serviceDurationType || "",
          startDate: service.startDate ? service.startDate?.split("T")[0] : "",
          endDate: service.endDate ? service.endDate?.split("T")[0] : "",
          availability: service.availability || "",
          hoursPerDay: service.hoursPerDay || "",
          serviceVideo: service.serviceVideo || "",
          images: service.images || "",
        }));
        setServices(servData);
      }
    }
  }, [profileData]);

  // If user sets the consulting price, compute net after 20%
  useEffect(() => {
    if (ConsultingPrice) {
      const val = parseFloat(ConsultingPrice);
      if (!isNaN(val)) {
        setUserconsultingPrice((val - val * 0.2).toFixed(2));
      } else {
        setUserconsultingPrice("");
      }
    } else {
      setUserconsultingPrice("");
    }
  }, [ConsultingPrice]);

  // LinkedIn data
  const handleLinkedInData = (data) => {
    if (data) {
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setExperience(calculateExperience(data.experiences) || "");
      setProfileImg(data.profile_pic_url || "");
      setIsLinkedInFetched(true);

      if (data.state && data.city) {
        const stObj = State.getStatesOfCountry("IN").find(
          (st) => st.name.toLowerCase() === data.state.toLowerCase()
        );
        if (stObj) {
          setSelectedState(stObj.isoCode);
          const stCities = City.getCitiesOfState("IN", stObj.isoCode);
          setCities(stCities);
          const cityObj = stCities.find(
            (ct) => ct.name.toLowerCase() === data.city.toLowerCase()
          );
          if (cityObj) {
            setSelectedCity(cityObj.name);
          }
        }
      }

      // Education
      if (data.education && Array.isArray(data.education)) {
        const eData = data.education.map((edu) => ({
          degree: edu.degree_name || "",
          stream: edu.field_of_study || "",
          college: edu.school || "",
          startDate: edu.starts_at
            ? new Date(
              edu.starts_at.year,
              edu.starts_at.month - 1,
              edu.starts_at.day
            )
              .toISOString()
              ?.split("T")[0]
            : "",
          endDate: edu.ends_at
            ? new Date(edu.ends_at.year, edu.ends_at.month - 1, edu.ends_at.day)
              .toISOString()
              ?.split("T")[0]
            : "",
          cgpa: edu.grade || "",
        }));
        setEducation(eData);
      }

      // Work
      if (data.experiences && Array.isArray(data.experiences)) {
        const wData = data.experiences.map((exp) => ({
          position: exp.title || "",
          company: exp.company || "",
          startDate: exp.starts_at
            ? new Date(
              exp.starts_at.year,
              exp.starts_at.month - 1,
              exp.starts_at.day
            )
              .toISOString()
              ?.split("T")[0]
            : "",
          endDate: exp.ends_at
            ? new Date(exp.ends_at.year, exp.ends_at.month - 1, exp.ends_at.day)
              .toISOString()
              ?.split("T")[0]
            : "",
          description: exp.description || "",
        }));
        setWork(wData);
      }

      // Projects
      if (
        data.accomplishment_projects &&
        Array.isArray(data.accomplishment_projects)
      ) {
        const pData = data.accomplishment_projects.map((proj) => ({
          projectName: proj.title || "",

          duration: "", // We'll store actual dates in the future

          liveLink: proj.url || "",
          description: proj.description || "",
        }));
        setProjects(pData);
      }

      // Skills
      if (data.skills && Array.isArray(data.skills)) {
        const sData = data.skills.map((skill) => ({
          skill: skill.name || "",
          skillRating: 0,
        }));
        setSkills(sData);
      }
    }
  };

  // If role is one that supports consulting
  const isConsultingChargesEnabled = () => {
    if (!Xpert || typeof Xpert !== "string") return false;
    const lower = Xpert.toLowerCase().trim();
    return consultingChargesConfig[lower] || false;
  };

  // Open modal to add or edit item
  const openModal = (type, index = null, itemData = {}) => {
    setModalType(type);
    setIsModalOpen(true);
    setEditIndex(index);
    console.log(itemData);

    if (itemData && Object.keys(itemData).length > 0) {
      // Prefill modalFormData based on the type
      if (type.toLowerCase() === "skill") {
        setModalFormData({
          skill: itemData.skill || "",
          skillRating: itemData.skillRating || 0,
        });
      } else if (type.toLowerCase() === "education") {
        setModalFormData({
          degree: itemData.degree || "",
          stream: itemData.stream || "",
          college: itemData.college || "",
          startDate: itemData.startDate || "",
          endDate: itemData.endDate || "",
          cgpa: itemData.cgpa || "",
        });
      } else if (type.toLowerCase() === "work") {
        setModalFormData({
          position: itemData.position || "",
          company: itemData.company || "",
          startDate: itemData.startDate || "",
          endDate: itemData.endDate || "",
          description: itemData.description || "",
        });
      } else if (type.toLowerCase() === "project") {
        setModalFormData({
          projectName: itemData.projectName || "",
          duration: itemData.duration || "",
          liveLink: itemData.liveLink || "",
          description: itemData.description || "",
        });
      } else if (type.toLowerCase() === "service") {
        setModalFormData({
          serviceName: itemData.serviceName || "",
          serviceDescription: itemData.serviceDescription || "",
          servicePrice: itemData.servicePrice || "",
          duration: itemData.duration || "",
          durationType: itemData.durationType || "",
          startDate: itemData.startDate || "",
          endDate: itemData.endDate || "",
          availability: itemData.availability || "",
          hoursPerDay: itemData.hoursPerDay || "",
          serviceVideo: itemData.serviceVideo || null,
          images: itemData.images || [],
        });
      }
    } else {
      setModalFormData({});
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setEditIndex(null);
    setModalFormData({});
  };

  // Add or update item in local arrays
  const saveDetail = async (type, dataObj, index) => {
    setSaving(true);
    const lower = type.toLowerCase();
    if (lower === "education") {
      if (index !== null) {
        const newArr = [...Education];
        newArr[index] = dataObj;
        setEducation(newArr);
      } else {
        setEducation([...Education, dataObj]);
      }
    } else if (lower === "work") {
      if (index !== null) {
        const newArr = [...Work];
        newArr[index] = dataObj;
        setWork(newArr);
      } else {
        setWork([...Work, dataObj]);
      }
    } else if (lower === "skill") {
      if (index !== null) {
        const newArr = [...Skills];
        newArr[index] = dataObj;
        setSkills(newArr);
      } else {
        setSkills([...Skills, dataObj]);
      }
    } else if (lower === "project") {
      if (index !== null) {
        const newArr = [...Projects];
        newArr[index] = dataObj;
        setProjects(newArr);
      } else {
        setProjects([...Projects, dataObj]);
      }
    } else if (lower === "service") {
      try {
        console.log("dataObj", dataObj);
        let videoUrl = dataObj.serviceVideo;;
        // Handle video upload only if it's a new file
        if (dataObj.serviceVideo instanceof File) {
          const storageRef = ref(
            storage,
            `videos/${Date.now()}_${dataObj.serviceVideo.name}`
          );
          await uploadBytes(storageRef, dataObj.serviceVideo);
          videoUrl = await getDownloadURL(storageRef);
          console.log("Video URL:", videoUrl);
        }

        const imageUrls = await Promise.all(
          dataObj.images.map(async (image) => {
            // If it's a File object, upload to storage
            if (image instanceof File) {
              const storageRef = ref(
                storage,
                `images/${Date.now()}_${image.name}`
              );
              await uploadBytes(storageRef, image);
              return await getDownloadURL(storageRef);
            }
            // If it's already a string URL, return as is
            if (typeof image === 'string') {
              return image;
            }
            // If it's an object with file and preview, upload the file
            if (image.file instanceof File) {
              const storageRef = ref(
                storage,
                `images/${Date.now()}_${image.file.name}`
              );
              await uploadBytes(storageRef, image.file);
              return await getDownloadURL(storageRef);
            }
            return null;
          })
        );

        // Filter out any null values
        const filteredImageUrls = imageUrls.filter(url => url !== null);


        console.log("Image URLs:", imageUrls);
        const serviceData = {
          ...dataObj,
          serviceVideo: videoUrl,
          images: imageUrls,
        };

        console.log("serviceData", serviceData);
        if (index !== null) {
          const newArr = [...Services];
          newArr[index] = serviceData;
          setServices(newArr);
        } else {
          setServices([...Services, serviceData]);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
        toast.error("Failed to save service details");
      }
    }
    setSaving(false);
  };

  // Modify image preview and upload in the component
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - modalFormData.images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setModalFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...filesToAdd.map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }))
      ],
    }));
  };

  // Delete item
  const deleteDetail = (type, index) => {
    const lower = type.toLowerCase();
    if (lower === "education") {
      setEducation(Education.filter((_, i) => i !== index));
    } else if (lower === "work") {
      setWork(Work.filter((_, i) => i !== index));
    } else if (lower === "skill") {
      setSkills(Skills.filter((_, i) => i !== index));
    } else if (lower === "project") {
      setProjects(Projects.filter((_, i) => i !== index));
    } else if (lower === "service") {
      setServices(Services.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    console.log("Active Step changed to:", activeStep);
  }, [activeStep]);

  // Final Submit of the entire form
  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setLoadingg(true);

    const missingFields = [];
    if (!FirstName) missingFields.push("First Name");
    if (!LastName) missingFields.push("Last Name");
    if (!Xpert) missingFields.push("Xpert Type");
    if (!Experience) missingFields.push("Years of Experience");
    if (!selectedState) missingFields.push("State");
    if (!profileImg) missingFields.push("Profile Image");
    if (!selectedCity) missingFields.push("City");

    if (missingFields.length > 0) {
      missingFields.forEach((f) => toast.error(`${f} is required`));
      setLoadingg(false);
      return;
    }
    console.log("Services", Services);
    // Gather data
    const data = {
      profileImage: profileImg,
      firstName: FirstName,
      lastName: LastName,
      experience: Experience,
      type: Xpert,
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

    console.log("Before setting step:", activeStep);

    try {
      dispatch(setDetail(data));
      await saveProfileData(data);

      setIsStep2Complete(true);
      setActiveStep(3);
      setTimeout(() => {
        refreshUser();
      }, 200);
      console.log("After setting step:", 3); // Debug log
    } catch (err) {
      toast.error(`Error saving data: ${err.message}`);
      console.log(err);
    } finally {
      setLoadingg(false);
    }
  };

  // Submit the modal form
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    await saveDetail(modalType, modalFormData, editIndex);
    closeModal();
  };

  // Load recommended services based on Xpert role
  useEffect(() => {
    const recommendationsConfig = {
      developer: [
        { title: "Web Development", description: "Build websites." },
        { title: "App Development", description: "Mobile apps." },
        { title: "Backend Development", description: "Server-side apps." },
        { title: "Database Management", description: "Scalable databases." },
      ],
      designer: [
        { title: "Graphic Design", description: "Stunning visuals." },
        { title: "UI/UX Design", description: "User-friendly interfaces." },
        { title: "Branding", description: "Brand identities." },
        { title: "Packaging Design", description: "Attractive packaging." },
      ],
      intern: [
        {
          title: "Internship",
          description: "Hands-on experience for students/fresh graduates.",
        },
        {
          title: "Full-Time",
          description: "Permanent role with fixed hours & responsibilities.",
        },
        {
          title: "Part-Time",
          description: "Short-term contract with specific tasks.",
        },
      ],
      yoga: [
        {
          title: "Personalized Yoga Sessions",
          description:
            "Tailored yoga practices for physical and mental well-being.",
        },
        {
          title: "Group Yoga Classes",
          description: "Interactive yoga sessions with groups for motivation.",
        },
        {
          title: "Corporate Wellness Programs",
          description:
            "Yoga sessions designed for workplace stress management.",
        },
        {
          title: "Meditation & Mindfulness",
          description: "Guided practices for relaxation and mental clarity.",
        },
      ],
      dietician: [
        {
          title: "Nutritional Counseling",
          description: "Personalized diet plans to meet your health goals.",
        },
        {
          title: "Weight Management",
          description: "Diet plans tailored for healthy weight gain or loss.",
        },
        {
          title: "Meal Planning",
          description:
            "Weekly meal preparation strategies for busy lifestyles.",
        },
        {
          title: "Clinical Nutrition",
          description: "Specialized diets for medical conditions and recovery.",
        },
      ],
      default: [
        {
          title: "General Service",
          description: "A range of customizable services.",
        },
      ],
      // Add other roles like "cloud devops", "lawyer", etc. as needed
    };

    if (Xpert && typeof Xpert === "string") {
      setRecommendation(
        recommendationsConfig[Xpert.toLowerCase()] ||
        recommendationsConfig.default
      );
    } else {
      setRecommendation(recommendationsConfig.default);
    }
  }, [Xpert]);

  // If user clicks on recommended item
  const handleRecommendationClick = (rec) => {
    const newServiceData = {
      serviceName: rec.title,
      serviceDescription: rec.description,
      servicePrice: "",
      duration: "",
      durationType: "",
      startDate: "",
      endDate: "",
      availability: "",
      hoursPerDay: "",
    };
    openModal("Service", null, newServiceData);
  };

  return (
    <Box sx={{ width: "100%", padding: 4, overflow: "hidden" }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel nonLinear>
        {steps.map((label, index) => {
          const displayLabel =
            index === 0 && Xpert ? (
              <>
                {label} <span style={{ color: "blue" }}>({Xpert})</span>
              </>
            ) : (
              label
            );
          return (
            <Step key={label}>
              <StepLabel
                onClick={() => handleStepClick(index)}
                sx={{ cursor: "pointer" }}
              >
                {displayLabel}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === 0 && Xpert && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Chip label={Xpert} color="primary" />
        </Box>
      )}

      {activeStep === 0 && <XpertRole next={() => setActiveStep(1)} />}

      <Box sx={{ height: "90vh", overflow: "auto", padding: 1 }}>
        {activeStep === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
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
                          sx={{ width: 120, height: 120 }}
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

                  {/* Basic Info */}
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

                  <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="experience-label">Experience</InputLabel>
                    <Select
                      labelId="experience-label"
                      value={Experience}
                      label="Experience"
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <MenuItem value="Less than 1">Less than 1</MenuItem>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      value={selectedState}
                      label="State"
                      onChange={(e) => handleStateChange(e.target.value)}
                    >
                      {indiaStates.map((st) => (
                        <MenuItem key={st.isoCode} value={st.isoCode}>
                          {st.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

            {/* Right side */}
            <Grid item xs={12} md={8}>
              {!profileData && (
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
                      alignItems: "center",
                      gap: "10px",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <img
                      src={LinkedInLogo}
                      alt="LinkedIn Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <span>Import LinkedIn Profile</span>
                  </div>
                </Box>
              )}

              {!isLinkedInFetched && !profileData && (
                <Box sx={{ mb: 2 }}>
                  <LinkedInFetcher
                    close={setIsLinkedInFetched}
                    onFetchSuccess={handleLinkedInData}
                  />
                </Box>
              )}

              {/* Skills */}
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
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 30 }}
                        onClick={() => openModal("Skill", index, item)}
                      >
                        <FiEdit color="blue" size={16} />
                      </IconButton>
                      <IconButton
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
                        name={`skill-rating-${index}`}
                        value={item.skillRating || 0}
                        size="small"
                        readOnly
                        sx={{ color: "#3498db" }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
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
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 30 }}
                        onClick={() => openModal("Education", index, item)}
                      >
                        <FiEdit color="blue" size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => deleteDetail("education", index)}
                      >
                        <FiTrash color="red" size={16} />
                      </IconButton>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: {
                              xs: "0.8rem", // Smaller font size for extra-small screens (mobile)
                              sm: "1rem",   // Default font size for small screens and above
                            },
                          }}
                        >
                          <strong>{item.degree}</strong> in {item.stream}
                        </Typography>

                        <Typography variant="body2">{item.college}</Typography>
                        <Typography variant="body2">
                          {item.startDate} - {item.endDate || "Present"}
                        </Typography>
                        <Typography variant="body2">
                          CGPA: {item.cgpa}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Work */}
              <Card sx={{ mb: 2, boxShadow: 2 }}>
                <CardHeader
                  title="Work Experience"
                  titleTypographyProps={{
                    variant: "h6",
                    sx: {
                      fontSize: {
                        xs: "1rem", // Smaller font size for mobile
                        sm: "1.25rem", // Default font size for small screens and above
                      },
                    },
                  }}
                  action={
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => openModal("Work")}
                      size="small"
                      sx={{
                        fontSize: {
                          xs: "0.6rem", // Smaller font size for mobile
                          sm: "1rem", // Default font size for small screens and above
                        },
                        padding: {
                          xs: "6px 12px", // Smaller padding for mobile
                          sm: "8px 16px", // Default padding for small screens and above
                        },
                      }}
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
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 30 }}
                        onClick={() => openModal("Work", index, item)}
                      >
                        <FiEdit color="blue" size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => deleteDetail("work", index)}
                      >
                        <FiTrash color="red" size={16} />
                      </IconButton>
                      <Box>
                        <Typography variant="subtitle1">
                          <strong>{item.position}</strong> at {item.company}
                        </Typography>
                        <Typography variant="body2">
                          {item.startDate} - {item.endDate || "Present"}
                        </Typography>
                        {item.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card sx={{ mb: 2, boxShadow: 2 }}>
                <CardHeader
                  title="Projects/Assignments"
                  titleTypographyProps={{
                    variant: "h6",
                    sx: {
                      fontSize: {
                        xs: "1rem", // Smaller font size for mobile
                        sm: "1.25rem", // Default font size for small screens and above
                      },
                    },
                  }}
                  action={
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => openModal("Project")}
                      size="small"
                      sx={{
                        fontSize: {
                          xs: "0.6rem", // Smaller font size for mobile
                          sm: "1rem", // Default font size for small screens and above
                        },
                        padding: {
                          xs: "6px 12px", // Smaller padding for mobile
                          sm: "8px 16px", // Default padding for small screens and above
                        },
                      }}
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
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 30 }}
                        onClick={() => openModal("Project", index, item)}
                      >
                        <FiEdit color="blue" size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => deleteDetail("project", index)}
                      >
                        <FiTrash color="red" size={16} />
                      </IconButton>
                      <Box>
                        <Typography variant="subtitle1">
                          <strong>{item.projectName}</strong>
                        </Typography>
                        {/* If you want to show the date range:
                          <Typography variant="body2">
                            {item.startDate} - {item.endDate || "Present"}
                          </Typography> */}
                        <Typography variant="body2">{item.duration}</Typography>
                        {item.liveLink && (
                          <Typography variant="body2" color="primary">
                            <a
                              href={item.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Live Link
                            </a>
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Step Navigation */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                  mb: 3,
                }}
              >
                {activeStep === 1 && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(0)}
                      size="large"
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(2)}
                      size="large"
                    >
                      Next Step
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Step 2: Offering */}
        {activeStep === 2 && (
          <Grid container spacing={4}>
            {/* Profile summary on left */}
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
                      sx={{ width: 120, height: 120 }}
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
                      {Experience} {Experience === "1" ? "Year" : "Years"} of
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

            {/* Right side: Consulting & Services */}
            <Grid item xs={12} md={8}>
              {/* Consulting Price if needed */}
              {isConsultingChargesEnabled() && (
                <Card sx={{ mb: 4, boxShadow: 2 }}>
                  <CardHeader
                    title="Consulting Charges"
                    titleTypographyProps={{ variant: "h6" }}
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Price (₹)"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setConsultingPrice(!isNaN(val) ? val : "");
                          }}
                          required
                          size="small"
                          value={ConsultingPrice || ""}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography>Per Minute</Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      {ConsultingPrice !== "" && ConsultingPrice !== 0 && (
                        <Typography variant="body1">
                          Your Received: ₹{UserconsultingPrice}
                        </Typography>
                      )}
                      {ConsultingPrice !== "" && ConsultingPrice !== 0 && (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "8px", color: "#009DED" }}
                        >
                          20% will be deducted as Platform charge
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Services */}
              <Card sx={{ mb: 4, boxShadow: 2 }}>
                <CardHeader
                  title={
                    Xpert.toLowerCase() === "intern"
                      ? "Recommendations"
                      : "Services Recommendations"
                  }
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
                            p: 2,
                            height: "100%",
                          }}
                          onClick={() => handleRecommendationClick(rec)}
                        >
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>{rec.title}</strong>
                          </Typography>
                          {/* If you want to show the description:
                              <Typography variant="body2">
                                {rec.description}
                              </Typography> */}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Services list */}
              <Card sx={{ mb: 4, boxShadow: 2 }}>
                <CardHeader
                  title="Services"
                  titleTypographyProps={{ variant: "h6" }}
                  action={
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => openModal("Service")}
                      size="small"
                    >
                      Add Service
                    </Button>
                  }
                  sx={{ padding: 2 }}
                />
                <Divider />
                <CardContent>
                  {Services.map((item, index) => (
                    <Box key={index} sx={{ mb: 3, position: "relative" }}>
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 30 }}
                        onClick={() => openModal("Service", index, item)}
                      >
                        <FiEdit color="blue" size={16} />
                      </IconButton>
                      <IconButton
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
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.serviceDescription,
                          }}
                        ></div>
                      </Typography>
                      {Xpert.toLowerCase() === "intern" ? (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            Internship Start Date: {item.startDate || "Not Set"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Internship End Date: {item.endDate || "Not Set"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Availability:{" "}
                            {item.availability
                              ? item.availability.replace(/^\w/, (c) =>
                                c.toUpperCase()
                              )
                              : "N/A"}
                          </Typography>
                          {item.availability === "part time" && (
                            <Typography variant="body2" color="textSecondary">
                              Hours Per Day: {item.hoursPerDay || "N/A"}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            Price: ₹{item.servicePrice}
                          </Typography>
                          {item.duration && item.durationType && (
                            <Typography variant="body2" color="textSecondary">
                              Timeline: {item.duration} {item.durationType}
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setActiveStep(1)}
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
                  disabled={loading}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {activeStep === 3 && (
          <>
            <SummaryStep
              FirstName={FirstName}
              LastName={LastName}
              Xpert={Xpert}
              Experience={Experience}
              profileImg={profileImg}
              selectedCity={selectedCity}
              selectedState={selectedState}
              Education={Education}
              Work={Work}
              Skills={Skills}
              Projects={Projects}
              Services={Services}
              ConsultingPrice={ConsultingPrice}
              Badges={Badges} // Add badges as a prop
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: activeStep === 2 ? "space-between" : "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setActiveStep(2)}
                size="large"
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/profile/${userData?.uid}`)}
                size="large"
              >
                Profile
              </Button>
            </Box>
          </>
        )}

        <Dialog
          disableEnforceFocus
          open={isModalOpen}
          onClose={closeModal}
          fullWidth
          maxWidth="sm"
          className="!z-[120]"
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {editIndex !== null ? `Edit ${modalType}` : `Add ${modalType}`}
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
          <form onSubmit={handleModalSubmit}>
            <DialogContent dividers>
              {/* Education Form */}
              {modalType === "Education" && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Degree"
                      name="degree"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      value={modalFormData.degree || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          degree: e.target.value,
                        }))
                      }
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
                      value={modalFormData.stream || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          stream: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="College"
                      name="college"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      value={modalFormData.college || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          college: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Date"
                      name="startDate"
                      type="date"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={modalFormData.startDate || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date"
                      name="endDate"
                      type="date"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={modalFormData.endDate || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="CGPA"
                      name="cgpa"
                      type="number"
                      variant="outlined"
                      fullWidth
                      inputProps={{ step: 0.1 }}
                      required
                      size="small"
                      value={modalFormData.cgpa || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          cgpa: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              )}

              {/* Skill Form */}
              {modalType === "Skill" && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Skill Name"
                      name="skill"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      value={modalFormData.skill || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          skill: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: "14px" }}>
                      Self-Rating
                    </Typography>
                    <Rating
                      size="large"
                      name="skillRating"
                      value={modalFormData.skillRating || 0}
                      onChange={(event, newValue) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          skillRating: newValue,
                        }))
                      }
                      sx={{
                        fontSize: "3rem",
                        color: "#3498db",
                        "& .MuiRating-iconFilled": { color: "#3498db" },
                        "& .MuiRating-iconHover": { color: "#2e6da4" },
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Work Form */}
              {modalType === "Work" && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Position"
                      name="position"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      value={modalFormData.position || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
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
                      value={modalFormData.company || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Date"
                      name="startDate"
                      type="date"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={modalFormData.startDate || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date"
                      name="endDate"
                      type="date"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={modalFormData.endDate || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
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
                      size="small"
                      value={modalFormData.description || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              )}

              {/* Project Form */}
              {modalType === "Project" && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Project Name"
                      name="projectName"
                      variant="outlined"
                      fullWidth
                      required
                      size="small"
                      value={modalFormData.projectName || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          projectName: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  {/* If you want start/end date fields, you can add them here. */}
                  <Grid item xs={12}>
                    <TextField
                      label="Duration eg 2 Months"
                      name="duration"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={modalFormData.duration || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Live Link"
                      name="liveLink"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={modalFormData.liveLink || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          liveLink: e.target.value,
                        }))
                      }
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
                      value={modalFormData.description || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              )}

              {/* Service Form */}
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
                      value={modalFormData.serviceName || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          serviceName: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* TODO: back <TextField
                      label="Service Description"
                      name="serviceDescription"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      required
                      size="small"
                      value={modalFormData.serviceDescription || ""}
                      onChange={(e) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          serviceDescription: e.target.value,
                        }))
                      }
                    /> */}
                    <RichEditor
                      onChange={(content) =>
                        setModalFormData((prev) => ({
                          ...prev,
                          serviceDescription: content,
                        }))
                      }
                      value={modalFormData.serviceDescription || ""}
                      placeholder="Service Description"
                    ></RichEditor>
                  </Grid>

                  {Xpert.toLowerCase() === "intern" ? (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          label="Internship Start Date"
                          name="startDate"
                          type="date"
                          variant="outlined"
                          fullWidth
                          required
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          value={modalFormData.startDate || ""}
                          onChange={(e) =>
                            setModalFormData((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Internship End Date"
                          name="endDate"
                          type="date"
                          variant="outlined"
                          fullWidth
                          required
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          value={modalFormData.endDate || ""}
                          onChange={(e) =>
                            setModalFormData((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth required size="small">
                          <InputLabel id="availability-label">
                            Availability
                          </InputLabel>
                          <Select
                            labelId="availability-label"
                            label="Availability"
                            value={modalFormData.availability || ""}
                            onChange={(e) =>
                              setModalFormData((prev) => ({
                                ...prev,
                                availability: e.target.value,
                              }))
                            }
                          >
                            <MenuItem value="full time">Full Time</MenuItem>
                            <MenuItem value="part time">Part Time</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      {modalFormData.availability === "part time" && (
                        <Grid item xs={6}>
                          <TextField
                            label="Hours Per Day"
                            name="hoursPerDay"
                            type="number"
                            variant="outlined"
                            fullWidth
                            required
                            size="small"
                            value={modalFormData.hoursPerDay || ""}
                            onChange={(e) =>
                              setModalFormData((prev) => ({
                                ...prev,
                                hoursPerDay: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                      )}
                    </>
                  ) : (
                    <>
                      <Grid item xs={4}>
                        <TextField
                          label="Service Price (₹)"
                          name="servicePrice"
                          type="number"
                          variant="outlined"
                          fullWidth
                          required
                          size="small"
                          value={modalFormData.servicePrice || ""}
                          onChange={(e) =>
                            setModalFormData((prev) => ({
                              ...prev,
                              servicePrice: e.target.value,
                            }))
                          }
                        />
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
                          value={modalFormData.duration || ""}
                          onChange={(e) =>
                            setModalFormData((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth required size="small">
                          <InputLabel id="duration-type-label">
                            Timeline Type
                          </InputLabel>
                          <Select
                            labelId="duration-type-label"
                            label="Timeline Type"
                            value={modalFormData.durationType || ""}
                            onChange={(e) =>
                              setModalFormData((prev) => ({
                                ...prev,
                                durationType: e.target.value,
                              }))
                            }
                          >
                            <MenuItem value="day">Day</MenuItem>
                            <MenuItem value="week">Week</MenuItem>
                            <MenuItem value="month">Month</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* video upload */}

                      <div className="flex flex-col items-center justify-center w-full h-full mt-10">
                        {!modalFormData.serviceVideo && (
                          <label
                            htmlFor="video-upload"
                            className="border-2 border-dashed border-gray-400 rounded-lg w-72 h-24 flex items-center justify-center cursor-pointer"
                          >
                            <div className="flex flex-col items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span className="text-gray-500 mt-2">
                                Upload Video
                              </span>
                            </div>
                            <input
                              id="video-upload"
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) =>
                                setModalFormData((prev) => ({
                                  ...prev,
                                  serviceVideo: e.target.files[0],
                                }))
                              }
                            />
                          </label>
                        )}

                        {/* video preview */}
                        {modalFormData.serviceVideo && (
                          <div className="relative mx-auto  w-[290px] h-[200px] border rounded-lg overflow-hidden sm:w-[340px]">
                            <video
                              src={
                                modalFormData.serviceVideo instanceof File
                                  ? URL.createObjectURL(
                                    modalFormData.serviceVideo
                                  )
                                  : modalFormData.serviceVideo
                              }
                              controls
                              className="w-full h-full"
                            />
                            <button
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              onClick={() =>
                                setModalFormData((prev) => ({
                                  ...prev,
                                  serviceVideo: null,
                                }))
                              }
                            >
                              ×
                            </button>
                          </div>
                        )}

                        {/* upload images */}

                        <Grid item xs={12}>
                          {/* Display "Upload Images" button if there are less than 4 images */}
                          {modalFormData.images.length < 4 && (
                            <label
                              htmlFor="image-upload"
                              className="border-2 border-dashed border-gray-400 rounded-lg w-full h-24 flex items-center justify-center cursor-pointer mt-6 mb-3 px-20"
                            >
                              <div className="flex flex-col items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                <span className="text-gray-500 mt-2">
                                  Upload Images Max-4
                                </span>
                              </div>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>
                          )}
                        </Grid>

                        {/* Display images and allow removal */}
                        {modalFormData.images.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {modalFormData.images.map((imageItem, index) => (
                              <div
                                key={index}
                                className="relative w-24 h-24 border rounded-lg overflow-hidden"
                              >
                                <img
                                  src={
                                    typeof imageItem === 'object' && imageItem.preview
                                      ? imageItem.preview
                                      : (typeof imageItem === 'string'
                                        ? imageItem
                                        : URL.createObjectURL(imageItem))
                                  }
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                  onClick={() =>
                                    setModalFormData((prev) => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== index),
                                    }))
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
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
                type="submit"
                size="large"
                disabled={saving}
                startIcon={
                  saving && <CircularProgress size={20} color="inherit" />
                }
              >
                {saving ? "Submitting..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
}
