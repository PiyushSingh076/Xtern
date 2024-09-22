import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

const SkillSelectionScreen = () => {
  const [selectedSkills, setSelectedSkills] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch the current user's ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle skill selection toggling
  const handleChange = (skill) => {
    setSelectedSkills((prevSkills) => ({
      ...prevSkills,
      [skill]: !prevSkills[skill],
    }));
  };

  // Save selected skills to the database and navigate to the homescreen
  const handleNext = async () => {
    if (!userId) return;

    const skillSet = Object.keys(selectedSkills).filter(
      (skill) => selectedSkills[skill]
    );

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { skillSet });
      toast.success("Skills saved successfully!");
      navigate("/homescreen");
    } catch (error) {
      console.error("Error saving skills:", error);
      toast.error("Failed to save skills. Please try again.");
    }
  };

  // List of available skills
  const skillsList = [
    "JavaScript",
    "React",
    "Node.js",
    "CSS",
    "HTML",
    "Python",
    "Java",
    "C++",
    "Ruby",
    "PHP",
    "SQL",
    "TypeScript",
    "Git",
    "Docker",
    "Machine Learning",
    "Data Analysis",
    "Networking",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Cybersecurity",
    "Cooking",
    "Agriculture",
    "Adventure",
    "Comedy",
    "Theater",
    "3D",
    "Fashion",
    "Motion",
    "Digital",
  ];

  return (
    <>
      {/* Header start */}
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn">
              <Link to="/spendlearning">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_330_7385"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="white"></rect>
                  </mask>
                  <g mask="url(#mask0_330_7385)">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              </Link>
            </div>
            <div className="top-navbar-title">
              <p>Choose Skills</p>
            </div>
            <div className="skip-btn-goal">{/* Optional skip button */}</div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>
      {/* Header end */}

      {/* Skill selection section start */}
      <section id="interest-screen">
        <div className="container">
          <div className="furniture-fill-sec mt-32">
            <h1 className="d-none">Skill Selection</h1>
            <div className="goal-title">
              <p>Choose the skills you are familiar with</p>
            </div>
            <form
              className="select-interest mt-32"
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {skillsList.map((skill, index) => (
                <div
                  className="interest-sec"
                  key={skill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    id={`select-skill${index + 1}`}
                    name="select-skill"
                    checked={!!selectedSkills[skill]}
                    onChange={() => handleChange(skill)}
                  />
                  <label
                    className="custom-interest-lbl"
                    htmlFor={`select-skill${index + 1}`}
                    style={{ marginLeft: "5px" }}
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </form>
            <div className="inter-next-btn">
              <button type="button" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Skill selection section end */}
    </>
  );
};

export default SkillSelectionScreen;
