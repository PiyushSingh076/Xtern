import React, { useState,useEffect,useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  Avatar,
  TextField,
  FormControl,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
  Stepper,
  Step,
  InputLabel,
  Select,
  MenuItem,
  StepLabel,
  Chip,
  Stack,
  Divider,
  CardHeader,
  
} from "@mui/material";
import {FiEdit, FiTrash} from "react-icons/fi";
import EditIcon from "@mui/icons-material/Edit"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import LinkedInLogo from "../../../assets/svg/linkedin.png";
import LinkedInFetcher from "../../Teams/LinkedInFetcher";
import { State, City } from "country-state-city";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setEntrepreneurDetails } from "../../../Store/Slice/EntrepreneurDetails";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useSaveEntrepreneurDetails from "../../../hooks/Auth/useSaveEntrepreneurDetailsFirebaseData";
import { storage } from "../../../firebaseConfig";
import { Update } from "@mui/icons-material";




export default function EntrepreneurProfileForm() {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgURL, setProfileImgURL] = useState("");
    const [errors, setErrors] = useState({});
    const[skillsRequired,setSkillsRequired]=useState([])
    const [companyDetails, setCompanyDetails] = useState({
      name: "",
      logo:{ url: "", fileName: "" },
      startDate: "",
      description: "",
    });
  const [uploadingLogo, setUploadingLogo] = useState(false); // Track logo upload progress
  const[uploading,setUploading]=useState(false)
 const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [isModalOpen,setIsModalOpen]=useState(false)
 const [linkedinProfile, setLinkedinProfile] = useState("");
  const [isLinkedInFetched,setIsLinkedInFetched]=useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const[currentSkill,setCurrentSkill]=useState({companyName:"",rating:0})
  const [isEditingCompany, setIsEditingCompany] = useState(false);


 
const navigate = useNavigate();
  const dispatch = useDispatch();
const location=useLocation()

const {userData}=useFetchUserData()

const {profileData}=location.state || {}

const [error, setError] = useState({
  firstName: false,
  lastName: false,
  state:false,
  city:false,
  companyDetails: false,

  experience: false,
  industry: false,

  skillsRequired: false,
  linkedinProfile: false, // Error state for LinkedIn
});

  const handleLinkedInEntrepreneurData = (data) => {
    if (data) {
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setProfileImg(data.profile_pic_url || "");

     
  
      setIndustry(data.industry || "");
      
    }
     if (data.state && data.city) {
            const stateObj = State.getStatesOfCountry("IN").find(
              (state) => state.name.toLowerCase() === data.state.toLowerCase()
            );
            if (stateObj) {
              setState(stateObj.isoCode);
              const stateCities = City.getCitiesOfState("IN", stateObj.isoCode);
              setCities(stateCities);
              const cityObj = stateCities.find(
                (city) => city.name.toLowerCase() === data.city.toLowerCase()
              );
              if (cityObj) {
                setCity(cityObj.name);
              }
            }
          }
    
  };

  const handleStateChange = (stateCode) => {
    setState(stateCode);
    const stateCities = City.getCitiesOfState("IN", stateCode);
    setCities(stateCities);
    setCity("");
  };

  const indiaStates = State.getAllStates().filter(
    (item) => item.countryCode === "IN"
  );

const{saveEntrepreneurDetails}=useSaveEntrepreneurDetails();

const mainContentRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mainContentRef.current) {
        mainContentRef.current.removeAttribute("inert");
      }
    };
  }, [mainContentRef]);

const openCompanyModal = () => {
  setIsCompanyModalOpen(true);
  setIsEditingCompany(companyDetails.name.trim() !== "")};

const closeCompanyModal = () => {
  setIsCompanyModalOpen(false);
  setIsEditingCompany(false);
  setErrors({});
};

const openSkillModal = (data = null, index = null) => {
  setIsSkillModalOpen(true);
  if (data) {
    setCurrentSkill(data);
    setEditIndex(index);
  } else {
    setCurrentSkill({ name: "", rating: 0 });
    setEditIndex(null);
  }
};

const closeSkillModal = () => {
  setIsSkillModalOpen(false);
  setErrors({});
  setCurrentSkill({ name: "", rating: 1 });
  setEditIndex(null);
};


const handleLogoUpload = async (file) => {
const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (!validExtensions.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG).");
      return;
    }
  if (!file.type.startsWith("image/")) {
    toast.error("Please upload a valid image file.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error("File size should not exceed 2MB.");
    return;
  }

  try {
    setUploadingLogo(true);
    const storageRef = ref(storage, `companyLogos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        setUploadingLogo(false);
        toast.error(`Upload failed: ${error.message}`);
      },
      async () => {
        const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
        setCompanyDetails((prev) => ({
          ...prev,
          logo: { url: fileURL, fileName: file.name },
        }));
        setUploadingLogo(false);
        toast.success("Logo uploaded successfully!");
      }
    );
  } catch (error) {
    setUploadingLogo(false);
    toast.error("Failed to upload logo.");
  }
};

const handleCompanyDialogSave = () => {
  if (
    companyDetails.name &&
    companyDetails.logo.url &&
    companyDetails.startDate &&
    companyDetails.description
  ) {
    toast.success(isEditing ? "Company details updated!" :"Company details saved!");
    closeCompanyModal();
   ;
  } else {
    toast.error("Please fill out all fields!");
  }
};


const validateSkill = () => {
  const newErrors = {};
  if (!currentSkill.name.trim()) newErrors.skillName = "Skill name is required.";
  if (currentSkill.rating < 1 || currentSkill.rating > 10) newErrors.skillRating = "Rating must be between 1 and 10.";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const saveSkill = () => {
  if (validateSkill()) {
    const updatedSkills = [...skillsRequired];
    if (editIndex !== null) {
      updatedSkills[editIndex] = currentSkill;
    } else {
      updatedSkills.push(currentSkill);
    }
    setSkillsRequired(updatedSkills);
    closeSkillModal();
  }
};

const deleteSkill = (index) => {
  const updatedSkills = [...skillsRequired];
  updatedSkills.splice(index, 1);
  setSkillsRequired(updatedSkills);
};


const handleDeleteConfirmation = () => {
  if (window.confirm("Are you sure you want to delete this company?")) {
    setCompanyDetails({ name: "", logo: { url: "", fileName: "" }, startDate: "", description: "" });
    toast.success("Company details deleted successfully.");
  }
};

  const handleProfileImage = async(file) => {
  
    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (!validExtensions.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG).");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error("File size should not exceed 2MB.");
      return;
    }
    
   
    try {
      setUploading(true);
      const storageRef = ref(storage, `profileImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            setUploading(false);
            toast.error(`Upload failed: ${error.message}`);
            reject(error);
          },
          async () => {
            const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProfileImgURL(fileURL);
            setUploading(false);
            toast.success("Profile image uploaded successfully!");
            resolve(fileURL);
          }
        );
      });
    } catch (error) {
      toast.error("Failed to upload profile image.");
      setUploading(false);
      throw error;
    }
  };


  const clearProfileImage = () => setProfileImg(null);

  const handleEntreneurSubmitInfo = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    // Validate profile image
    if(!profileImg) newErrors.profileImg="Profile Image is required"

    // Validate First Name
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    }
  
    // Validate Last Name
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    }
  
    // Validate State
    if (!state.trim()) {
      newErrors.state = "State is required.";
    }
  
    // Validate City
    if (!city.trim()) {
      newErrors.city = "City is required.";
    }
  
    // Validate Company Details
    if (!companyDetails.name.trim()) {
      newErrors.companyDetailsName = "Company Name is required.";
    }
    if (!companyDetails.logo.url) {
      newErrors.companyDetailsLogo = "Company Logo is required.";
    }
    if (!companyDetails.startDate.trim()) {
      newErrors.companyDetailsStartDate = "Company Start Date is required.";
    }
    if (!companyDetails.description.trim()) {
      newErrors.companyDetailsDescription = "Company Description is required.";
    }
  
    // Validate Experience
    if (!experience || isNaN(experience) || experience <= 0) {
      newErrors.experience = "Experience is required.";
    }
  
    // Validate Industry
    if (!industry.trim()) {
      newErrors.industry = "Industry is required.";
    }
  
    // Validate Skills Required
    if (!skillsRequired || skillsRequired.length === 0) {
      newErrors.skillsRequired = "At least one skill is required.";
    }
  
    // Validate LinkedIn Profile
    if (!linkedinProfile.trim()) {
      newErrors.linkedinProfile = "LinkedIn Profile is required.";
    } else if (!/^https?:\/\/[^\s]+$/.test(linkedinProfile)) {
      newErrors.linkedinProfile = "Enter a valid LinkedIn URL.";
    }
  
    // Set errors and check if the form is valid
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const entrepreneurData = {
          profileImage: {
            url: profileImgURL,
            fileName: profileImg?.name || "",
          },
          firstName,
          lastName,
          state,
          city,
          companyDetails,
          experience,
          industry,
          skillsRequired,
          linkedinProfile,
        };
  
        dispatch(setEntrepreneurDetails(entrepreneurData));
        const userId = await saveEntrepreneurDetails(entrepreneurData);
        toast.success("Profile saved successfully!");
        navigate(`/entrepreneur/${userId}`); // Adjust route as needed
      } catch (error) {
        toast.error(`Error saving profile: ${error.message || error}`);
        console.error(error);
      }
    } else {
      toast.error("Please fix the errors and try again.");
    }
  };
  


  return (
    <Box sx={{ width: "80wh", overflow: "auto", }}>
      <Stepper activeStep={0} alternativeLabel>
        <Step key="Entrepreneur Details">
          <StepLabel   sx={{
              "& .MuiStepLabel-label": {
                fontSize: "1.25rem",
                fontWeight: "bold",
                mb: 3,
              },
            }}>Entrepreneur Details</StepLabel>
        </Step>
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={(e) => {
                    if (e.target && e.target.files && e.target.files[0]) {
                    const file = e.target?.files[0];
                    setProfileImg(file);
                    handleProfileImage(file);
                  }}}
                
                />
                <label htmlFor="profile-image-upload">
                  <IconButton component="span">
                    <Avatar
                      src={profileImgURL || "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"}
                      sx={{ width: 120, height: 120 }}
                    />
                  </IconButton>
                </label>
                {profileImg && (
                  <IconButton
                    onClick={clearProfileImage}
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Click to upload
                </Typography>
                {errors.profileImg && (
    <Typography variant="caption" color="error">
      {errors.profileImg}
    </Typography>
  )}
              </Box>

              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{ mb: 3 }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                required
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                sx={{ mb: 3 }}
              />
              <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                                  <InputLabel id="experience-label">
                                    Years of Experience
                                  </InputLabel>
                                  {errors.experience && (
            <Typography variant="caption" color="error">
              {errors.experience}
            </Typography>
          )}
                                  <Select
                                    labelId="experience-label"
                                    value={experience}
                                    label="Years of Experience"
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
                    {errors.state && (
            <Typography variant="caption" color="error">
              {errors.state}
            </Typography>
          )}
                    <Select
                      labelId="state-label"
                      value={state}
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

                  <FormControl fullWidth required size="small">
                    <InputLabel id="city-label">City</InputLabel>
                    {errors.city && (
            <Typography variant="caption" color="error">
              {errors.city}
            </Typography>
          )}
                    <Select
                      labelId="city-label"
                      value={city}
                      label="City"
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!state}
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

        <Grid item xs={12} md={8}>
        {!profileData &&
        (<Box
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
              
              {!isLinkedInFetched && (
                <Box sx={{ mb: 2,mt:2 }}>
                  <LinkedInFetcher
                    close={setIsLinkedInFetched}
                    onFetchSuccess={handleLinkedInEntrepreneurData}
                  />
                </Box>
              )}
     
          <Card sx={{ mb: 2, boxShadow: 2 }}>
        <CardHeader
          title="Company Details"
          titleTypographyProps={{ variant: "h6" }}
          action={
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={openCompanyModal} // Opens the modal for company details
              size="small"
              sx={{ textTransform: "none" }}
            >
              Add Details
            </Button>
          }
          sx={{ padding: 2 }}
        />
        <Divider />

        <CardContent sx={{ padding: 2 }}>
          {companyDetails.name ? (<>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, m: 2 }}>
              <IconButton onClick={openCompanyModal}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeleteConfirmation} color="error">
                <FiTrash />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle1">
                <strong>{companyDetails.name}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Started on: {companyDetails.startDate}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {companyDetails.description}
              </Typography> 
           

            </Box>
            </>
          ) :  (
           ""
          )
}
{errors.companyDetails && (
    <Typography variant="caption" color="error">
      {errors.companyDetails}
    </Typography>
  )}
        </CardContent>

          </Card>
      <Card sx={{ mb: 2, boxShadow: 2 }}>
        <CardHeader
          title="Skills Required"
          titleTypographyProps={{ variant: "h6" }}
          action={
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => openSkillModal()} // Opens the modal for adding a skill
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
          {skillsRequired?.map((skill, index) => (<>
            <Box key={index} sx={{  mb: 3, position: "relative"}}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, m: 2 }}>
              <IconButton onClick={() => openSkillModal(skill, index)}><EditIcon /></IconButton>
              <IconButton onClick={() => deleteSkill(index)}><FiTrash color="red" /></IconButton>
           </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="subtitle1">
                  <strong>{skill.name}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rating: {skill.rating}
                </Typography>
              </Box>

            </Box>
     
            </>
          ))}
           {errors.skillsRequired && (
    <Typography variant="caption" color="error">
      {errors.skillsRequired}
    </Typography>
  )}
        </CardContent>
      </Card>
          <TextField
            label="Industry"
            variant="outlined"
            fullWidth
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            error={!!errors.industry}
            helperText={errors.industry}
            sx={{ mb: 3 }}
          />
     

          <TextField
            label="LinkedIn Profile"
            variant="outlined"
            fullWidth
            value={linkedinProfile}
            onChange={(e) => setLinkedinProfile(e.target.value)}
            sx={{ mb: 3 }}
            error={!!errors.industry}
            helperText={errors.industry}
          />

{/* Dialog for Adding Skills */}
<Dialog sx={{mt:8}} open={isSkillModalOpen} onClose={closeSkillModal} fullWidth>
        <DialogTitle >{editIndex?.index !== null ? "Edit Skill" : "Add Skill"}</DialogTitle>
        <DialogContent >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField sx={{mt:3}}
                label="Skill Name"
                variant="outlined"
                fullWidth
                required
                value={currentSkill.name}
                onChange={(e) =>
                  setCurrentSkill({ ...currentSkill, name: e.target.value })
                }
                error={!!errors.skillName}
    helperText={errors.skillName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rating"
                type="number"
                variant="outlined"
                fullWidth
                required
                value={currentSkill.rating}
                onChange={(e) =>
                  setCurrentSkill({ ...currentSkill,rating: Math.max( Math.min(10, Number(e.target.value))) 
    })}
                error={!!errors.skillRating}
                helperText={errors.skillRating}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={saveSkill}>
          {editIndex !== null ? "Update" : "Save"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={closeSkillModal}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    {/* Dialog for Company Details */}
    <Dialog sx={{mt:8}} open={isCompanyModalOpen} onClose={closeCompanyModal} fullWidth>
        <DialogTitle>{isEditingCompany? "Edit Company Details": "Add Company Details"}</DialogTitle>
        <DialogContent >
          <TextField
            label="Company Name"
            fullWidth
            value={companyDetails.name}
            onChange={(e) =>
              setCompanyDetails({ ...companyDetails, name: e.target.value })
            }
            sx={{ mb: 2,mt:3 }}
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="logo-upload"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleLogoUpload(file);
             
            }}
          />
          <label htmlFor="logo-upload">
            <Button
              variant="contained"
              component="span"
              disabled={uploadingLogo}
              sx={{ mb: 2 }}
            >
              Upload Logo
            </Button>
          </label>
          {companyDetails?.logo?.fileName && (
            <Typography>{`Uploaded Logo: ${companyDetails?.logo?.fileName}`}</Typography>
          )}
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={companyDetails.startDate}
            onChange={(e) =>
              setCompanyDetails({ ...companyDetails, startDate: e.target.value })
            }
            sx={{ mb: 2 }}
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={companyDetails.description}
            onChange={(e) =>
              setCompanyDetails({ ...companyDetails, description: e.target.value })
            }
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCompanyDialogSave} variant="contained">
            {isEditingCompany? "Update": "Save"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={closeCompanyModal}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item={4} sx={{ m: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEntreneurSubmitInfo}
          disabled={Object.values(errors).includes(true)} // Disable button if any error exists
        >
          Submit
        </Button>
      </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}