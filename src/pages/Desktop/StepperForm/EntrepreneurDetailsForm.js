import React, { useState, useEffect, useRef } from "react";
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { FiTrash } from "react-icons/fi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useImageUpload from "../../../hooks/Auth/useImageUpload";
import ClearIcon from "@mui/icons-material/Clear";
import LinkedInLogo from "../../../assets/svg/linkedin.png";
import LinkedInFetcher from "../../Teams/LinkedInFetcher";
import { State, City } from "country-state-city";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useModalForm } from "../../../hooks/Auth/useModalForm";
import { setEntrepreneurDetails } from "../../../Store/Slice/EntrepreneurDetails";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useSaveEntrepreneurDetails from "../../../hooks/Auth/useSaveEntrepreneurDetailsFirebaseData";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { storage } from "../../../firebaseConfig";
import { FlashOnOutlined } from "@mui/icons-material";


export default function EntrepreneurProfileForm() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [tempProfileImg, setTempProfileImg] = useState(null);  // For temporary storage during upload
  const [errors, setErrors] = useState({});
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    logo: { file: null, fileName: "", preview: '' },
    startDate: "",
    description: "",
  });
  const [uploadingLogo, setUploadingLogo] = useState(false); // Track logo upload progress
  const [uploading, setUploading] = useState(false)
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [isLinkedInFetched, setIsLinkedInFetched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()

  const { userData } = useFetchUserData()

  const { profileData } = location.state || {}

  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    state: false,
    city: false,
    companyDetails: false,

    experience: false,
    industry: false,

    skillsRequired: false,
    linkedinProfile: false, // Error state for LinkedIn
  });

  // Add useEffect to populate form with existing data
  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || "");
      setLastName(profileData.lastName || "");
      setProfileImg(profileData.photo_url || null);
      setExperience(profileData.experience || "");
      setIndustry(profileData.industry || "");
      setState(profileData.location?.state || "");
      setCity(profileData.location?.city || "");
      setLinkedinProfile(profileData.linkedinProfileUrl || "");
      setSkillsRequired(profileData.skills || []);

      // Set company details
      setCompanyDetails({
        name: profileData.companyDetails?.name || "",
        logo: {
          url: profileData.companyDetails?.logo || "",
          fileName: "",
          preview: profileData.companyDetails?.logo || ""
        },
        startDate: profileData.companyDetails?.startDate || "",
        description: profileData.companyDetails?.description || "",
      });

      // Load cities for the selected state
      if (profileData.location?.state) {
        const stateCities = City.getCitiesOfState("IN", profileData.location.state);
        setCities(stateCities);
      }
    }
  }, [profileData]);


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

  const {
    projectImage,
    imagePreviewUrl,
    error: imageError,
    loading,
    handleImageUpload,
    clearImage,
    uploadImage,
  } = useImageUpload();

  const handleStateChange = (stateCode) => {
    setState(stateCode);
    const stateCities = City.getCitiesOfState("IN", stateCode);
    setCities(stateCities);
    setCity("");
  };

  const indiaStates = State.getAllStates().filter(
    (item) => item.countryCode === "IN"
  );

  const { saveEntrepreneurDetails } = useSaveEntrepreneurDetails();

  const {
    modalType,
    openModal,
    closeModal,
    skillsRequired,
    setSkillsRequired,
    currentSkill,
    setCurrentSkill,
    saveSkill,
    skillsErrors,
    setSkillsErrors,
    editingSkillIndex  // Add this
  } = useModalForm({ name: "", rating: 0 });

  // // Handle modal close
  // const closeModal = () => {
  //   setModalType(null);
  // };

  const handleLogoUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should not exceed 2MB.");
      return;
    }

    // Upload logo to Firebase Storage
    const storageRef = ref(storage, `companyLogos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadingLogo(true); // Show loading state
      },
      (error) => {
        toast.error("Error uploading logo.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCompanyDetails((prev) => ({
            ...prev,
            logo: {
              url: downloadURL, // Store the URL after upload
              fileName: file.name,
            },
          }));
          setUploadingLogo(false); // Hide loading state
        });
      }
    );
  };


  const handleCompanyDialogSave = async () => {
    try {
      if (companyDetails.logo.file) {
        console.log("Uploading logo:", companyDetails.logo.file); // Add your upload logic here
        // Simulate the upload to Firebase (or any backend)
        const fileURL = "fakeFileURL"; // Replace with actual file URL after upload
        setCompanyDetails((prev) => ({
          ...prev,
          logo: { url: fileURL, fileName: companyDetails.logo.fileName },
        }));
        toast.success("Logo uploaded successfully!");
      }

      // Save company details to the backend (this could be your API call)
      // console.log("Saving company details:", companyDetails);
      closeModal();
    } catch (error) {
      toast.error("Failed to save company details.");
    }
  };



  // isse direct upload ho rahi hai




  const clearProfileImage = () => setProfileImg(null);

  const handleEntreneurSubmitInfo = async (e) => {

    e.preventDefault();
    setIsSubmitting(true); // Set loading state to true

    try {
      let finalImageURL = profileImg;  // Start with current profile image

      // Only upload new image if one was selected
      if (projectImage) {
        const uploadedImageURL = await uploadImage();
        if (uploadedImageURL) {
          finalImageURL = uploadedImageURL;
        }
      }
      // console.log(imageURL)

      const missingFields = [];
      if (!firstName) missingFields.push("First Name");
      if (!lastName) missingFields.push("Last Name");
      if (!state) missingFields.push("State");
      if (!city) missingFields.push("City");
      if (!companyDetails) missingFields.push("Company Details");
      if (!experience) missingFields.push("Years in Experience");
      if (!industry) missingFields.push("Industry");

      if (missingFields.length === 0) {
        const entrepreneurData = {
          photo_url: finalImageURL, // Ensure profileImg is included here
          firstName,
          lastName,
          state,
          city,
          companyDetails,
          experience,
          industry,
          skillsRequired,
          linkedinProfile,
          // Add the user's ID if editing
          uid: profileData?.uid
        };

        dispatch(setEntrepreneurDetails(entrepreneurData));

        console.log("Entrepreneur Data:", entrepreneurData);

        try {
          const userId = await saveEntrepreneurDetails(entrepreneurData);
          toast.success(profileData ? "Profile updated successfully!" : "Profile saved successfully!");
          navigate(`/entrepreneur/${userId}`);
          navigate(`/entrepreneur/${userId}`);
        } catch (error) {
          toast.error(`Error saving profile: ${error.message || error}`);
          console.error(error);
        } finally {
          setIsSubmitting(false); // Set loading state to true
        }
      } else {
        missingFields.forEach((field) => toast.error(`${field} is required)`));
        setIsSubmitting(false); // Set loading state to true

      }
    } catch (error) {
      toast.error(`Error processing image: ${error.message}`);
      console.error(error);
    } finally {
      setIsSubmitting(false); // Set loading state to true
    }
  };



  return (
    <Box sx={{ width: "80wh", overflow: "auto", }}>
      <Stepper activeStep={0} alternativeLabel>
        <Step key="Entrepreneur Details">
          <StepLabel sx={{
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
                  onChange={handleImageUpload}

                />
                <label htmlFor="profile-image-upload">
                  <IconButton component="span">
                    <Avatar
                      src={
                        imagePreviewUrl || profileImg
                          ? imagePreviewUrl || profileImg
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
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Click to upload
                </Typography>
              </Box>

              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{ mb: 3 }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
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
            <Box sx={{ mb: 2, mt: 2 }}>
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
                  onClick={() => openModal("Company")} // Opens the modal for company details
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
              {companyDetails.name ? (
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
              ) : ""}
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
                  onClick={() => openModal("Skill")} // Opens the modal for adding a skill
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
              {skillsRequired.map((item, index) => (
                <Box key={index} sx={{ mb: 3, position: "relative" }}>
                  <Box sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: 'flex',
                    gap: 1
                  }}>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      onClick={() => openModal("Skill", index)}
                    >
                      <EditOutlinedIcon size={16} sx={{ color: 'blue' }} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => {
                        const updatedSkills = [...skillsRequired];
                        updatedSkills.splice(index, 1);
                        setSkillsRequired(updatedSkills);
                      }}
                    >
                      <FiTrash color="red" size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="subtitle1">
                      <strong>{item.name}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Rating: {item.rating}
                    </Typography>
                  </Box>
                </Box>
              ))}
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
          />

          {/* Dialog for Adding Skills */}
          <Dialog open={modalType === "Skill"} onClose={closeModal} fullWidth>
            <DialogTitle>
              {editingSkillIndex !== null ? "Edit Skill" : "Add Skill"}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
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
                    sx={{ mt: 2 }} // Add margin-top to create space
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
                      setCurrentSkill({ ...currentSkill, rating: e.target.value })
                    }
                    error={!!errors.skillRating}
                    helperText={errors.skillRating}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={saveSkill}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={closeModal}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          {/* Dialog for Company Details */}
          <Dialog open={modalType === "Company"} onClose={closeModal} fullWidth  sx={{ mt: 10 }} >
            <DialogTitle>Add Company Details</DialogTitle>
            <DialogContent>
              <TextField
                label="Company Name"
                fullWidth
                value={companyDetails.name}
                onChange={(e) =>
                  setCompanyDetails({ ...companyDetails, name: e.target.value })
                }
                sx={{ mb: 2, mt: 2 }}
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="logo-upload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  handleLogoUpload(file); // Save logo to state
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
              {companyDetails.logo.preview && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 mb-3">
                  <img
                    src={companyDetails.logo.preview}
                    alt="Company logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>
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
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCompanyDialogSave} variant="contained">
                Save
              </Button>
              <Button onClick={closeModal} variant="outlined">
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
              {isSubmitting ? "Submitting..." : "Submit"} {/* Show dynamic text */}            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}