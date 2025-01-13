import { useState, useEffect, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";

export const useModalForm = (initialSkill) => {
  const [modalType, setModalType] = useState(null);
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [currentSkill, setCurrentSkill] = useState(initialSkill);
  const [skillsErrors, setSkillsErrors] = useState([{}]);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mainContentRef.current) {
        mainContentRef.current.removeAttribute("inert");
      }
    };
  }, [mainContentRef]);

  const openModal = (type, skillIndex = null) => {
    setModalType(type);
    if (skillIndex !== null) {
      setEditingSkillIndex(skillIndex);
      setCurrentSkill(skillsRequired[skillIndex]);
    } else {
      setEditingSkillIndex(null);
      setCurrentSkill(initialSkill);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSkillsErrors({});
    setCurrentSkill(initialSkill);
    setEditingSkillIndex(null);
  };

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

  const saveSkill = () => {
    if (validateSkill()) {
      if (editingSkillIndex !== null) {
        // Update existing skill
        const updatedSkills = [...skillsRequired];
        updatedSkills[editingSkillIndex] = currentSkill;
        setSkillsRequired(updatedSkills);
      } else {
        // Add new skill
        setSkillsRequired([...skillsRequired, currentSkill]);
      }
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
    editingSkillIndex
  };
};