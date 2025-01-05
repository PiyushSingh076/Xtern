import { useState, useEffect, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Adjust to your Firebase config path

export const useModalForm = (initialCompanyDetails, initialSkill) => {
  const [modalType, setModalType] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(initialCompanyDetails);
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [currentSkill, setCurrentSkill] = useState(initialSkill);
  const [errors, setErrors] = useState({});
  const [uploadingLogo, setUploadingLogo] = useState(false); // Track logo upload progress
  const mainContentRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mainContentRef.current) {
        mainContentRef.current.removeAttribute("inert");
      }
    };
  }, [mainContentRef]);

  // Open modal
  const openModal = (type) => setModalType(type);

  // Close modal
  const closeModal = () => {
    setModalType(null);
    setErrors({});
    setCompanyDetails(initialCompanyDetails);
    setCurrentSkill(initialSkill);
  };

  // Validate company details
  const validateCompanyDetails = () => {
    const newErrors = {};
    if (!companyDetails.name.trim()) {
      newErrors.name = "Company name is required.";
    }
    if (!companyDetails.startDate) {
      newErrors.startDate = "Start date is required.";
    }
    if (!companyDetails.description.trim()) {
      newErrors.description = "Description is required.";
    }
    if (!companyDetails.logo) {
      newErrors.logo = "Company logo is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload logo to Firebase
  const uploadLogo = async (logoFile) => {
    setUploadingLogo(true);
    const storageRef = ref(storage, `logos/${logoFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, logoFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          setUploadingLogo(false);
          reject(error);
        },
        async () => {
          const logoURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadingLogo(false);
          resolve({ logoURL, fileName: logoFile.name }); // Return URL and filename
        }
      );
    });
  };

  // Save company details with logo upload
  const saveCompanyDetails = async () => {
    if (validateCompanyDetails()) {
      try {
        let logoURL = companyDetails.logo;
        let logoFileName = null;

        if (companyDetails.logo instanceof File) {
          const uploadResult = await uploadLogo(companyDetails.logo); // Upload logo
          logoURL = uploadResult.logoURL;
          logoFileName = uploadResult.fileName;
        }

        console.log("Company details saved with logo:", {
          ...companyDetails,
          logo: logoURL,
          logoFileName,
        });

        // Reset the form and close modal
        closeModal();
      } catch (error) {
        console.error("Error uploading logo:", error);
        setErrors((prev) => ({ ...prev, logo: "Failed to upload logo." }));
      }
    }
  };

  // Validate skill
  const validateSkill = () => {
    const newErrors = {};
    if (!currentSkill.name.trim()) {
      newErrors.skillName = "Skill name is required.";
    }
    if (currentSkill.rating <= 0) {
      newErrors.skillRating = "Rating must be greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save skill
  const saveSkill = () => {
    if (validateSkill()) {
      setSkillsRequired([...skillsRequired, currentSkill]);
      closeModal();
    }
  };

  return {
    modalType,
    openModal,
    closeModal,
    companyDetails,
    setCompanyDetails,
    skillsRequired,
    setSkillsRequired,
    currentSkill,
    setCurrentSkill,
    saveCompanyDetails,
    saveSkill,
    errors,
    uploadingLogo,
  };
};
