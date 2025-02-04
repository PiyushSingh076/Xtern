import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Prefference.css";

export default function PreferredService() {
  const navigate = useNavigate();
  const [potential, setPotential] = useState(null);
  const [skillset, setSkillset] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [skillsetArray, setSkillsetArray] = useState([]);
  const [availability, setAvailability] = useState({ from: "", to: "" });
  const [totalYearsExperience, setTotalYearsExperience] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [error, setError] = useState("");

  const programmingLanguages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Ruby",
    "Kotlin",
    "Swift",
    "PHP",
    "C#",
    "Go",
    "Rust",
    "TypeScript",
    "Dart",
    "R",
    "Perl",
    "Scala",
    "Elixir",
    "Haskell",
    "Lua",
    "Objective-C",
  ];

  const handleRoleChange = (event) => {
    setPotential(event.target.value);
  };

  const handleAddSkill = () => {
    if (skillset && yearsOfExperience) {
      const skillExists = skillsetArray.some(
        (skill) => skill.skillset.toLowerCase() === skillset.toLowerCase()
      );
      if (skillExists) {
        setError("This skill has already been added.");
      } else {
        setSkillsetArray((prevArray) => [
          ...prevArray,
          { skillset, yearsOfExperience },
        ]);
        setSkillset("");
        setYearsOfExperience("");
        setError("");
      }
    } else {
      setError("Please select both a skillset and years of experience.");
    }
  };

  const handleSubmit = () => {
    if (!potential) {
      setError("Please select your expertise area.");
      return;
    }

    if (skillsetArray.length < 2) {
      setError("Please add at least two skills.");
      return;
    }

    if (!availability.from || !availability.to) {
      setError("Please select both start and end dates for availability.");
      return;
    }

    if (!totalYearsExperience) {
      setError("Please enter your total years of experience.");
      return;
    }

    if (!currentRole) {
      setError("Please enter your current role.");
      return;
    }

    // Here you would typically send this data to a backend or store it
    const mentorInfo = {
      mentorType: potential,
      skillSet: skillsetArray,
      availability: availability,
      totalYearsExperience: totalYearsExperience,
      currentRole: currentRole,
    };

    alert("Mentor Info Submitted");
    navigate("/profile");
  };

  return (
    <div className="des-preffered-intern-container">
      <span className="hey-txt">
        Hey, <span style={{ color: "#3374AE" }}>Mentor</span>
      </span>

      <span className="select-lang">Your expertise in:</span>

      <div className="lang-sec">
        {[
          "Software Development",
          "Data Science",
          "Product Management",
          "UX/UI Design",
          "Marketing",
        ].map((role) => (
          <React.Fragment key={role}>
            <input
              type="radio"
              id={role.toLowerCase().replace(" ", "-")}
              name="role"
              value={role}
              onChange={handleRoleChange}
              checked={potential === role}
            />
            <label
              className="custom-radio-sel-lang"
              htmlFor={role.toLowerCase().replace(" ", "-")}
            >
              {role}
            </label>
          </React.Fragment>
        ))}
      </div>

      <div className="des-select-skill-sec">
        <span className="select-lang">Your SkillSet:</span>

        <div className="skill-card-container">
          {skillsetArray.map((skills, index) => (
            <div className="des-skill-card" key={index}>
              <span>
                <b>{skills.skillset}</b> ({skills.yearsOfExperience} years)
              </span>
            </div>
          ))}
        </div>

        <div className="select-option-container">
          <select
            className="select-option-input-skill"
            value={skillset}
            onChange={(e) => setSkillset(e.target.value)}
          >
            <option value="">Skillset</option>
            {programmingLanguages.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            style={{ width: "200px" }}
            className="select-option-input-skill"
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            placeholder="Years of Experience"
          />

          <button className="add-btn" onClick={handleAddSkill}>
            Add
          </button>
        </div>
      </div>

      <div className="des-basic-info-container">
        <span className="select-lang">Professional Information:</span>
        <div className="des-basic-info-options">
          <div className="des-basic-option">
            <span htmlFor="">Total Years of Experience:</span>
            <input
              className="select-option-input-skill"
              id="total-years-experience"
              type="number"
              placeholder="Total Years of Experience"
              value={totalYearsExperience}
              onChange={(e) => setTotalYearsExperience(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      <button className="select-btn" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}
