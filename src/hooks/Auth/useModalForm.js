import { useState, useEffect, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Adjust to your Firebase config path

export const useModalForm = (initialSkill) => {
  const [modalType, setModalType] = useState(null);
  
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [currentSkill, setCurrentSkill] = useState(initialSkill);
const[skillsErrors,setSkillsErrors]=useState([{}])
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
    setSkillsErrors({});
   
    setCurrentSkill(initialSkill);
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
    setSkillsErrors(newErrors);
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
  
    skillsRequired,
    setSkillsRequired,
    currentSkill,
    setCurrentSkill,
   
    saveSkill,
   skillsErrors,
  setSkillsErrors,
  }
}