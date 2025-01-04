import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PrefferedServiceMentor() {
  const navigate = useNavigate();
  const [expertise, setExpertise] = useState(null);
  const [skillset, setSkillset] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [SkillsetArray, setSkillsetArray] = useState([]);
  const [availability, setAvailability] = useState({ from: "", to: "" });
  const [currentlyEmployed, setCurrentlyEmployed] = useState("");
  const [company, setCompany] = useState("");

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

  const handleExpertiseChange = (event) => {
    setExpertise(event.target.value);
  };

  const handleAddSkill = () => {
    if (skillset && yearsOfExperience) {
      const skillExists = SkillsetArray.some(
        (skill) => skill.skillset.toLowerCase() === skillset.toLowerCase()
      );
      if (skillExists) {
        alert("This skill has already been added.");
      } else {
        setSkillsetArray((prevArray) => [
          ...prevArray,
          { skillset, yearsOfExperience },
        ]);
        setSkillset("");
        setYearsOfExperience("");
      }
    }
  };

  const handleSubmit = () => {
    if (SkillsetArray.length < 2) {
      alert("Please add at least two skills.");
      return;
    }

    alert("Mentor Info Submitted");
    navigate("/profile");
  };

  return (
    <div className="preffered-role-container">
      <span className="hey-txt">
        Hey, <span style={{ color: "#3374AE" }}>Mentor</span>
      </span>

      <div className="select-lang-sec">
        <span className="select-lang">Your area of expertise:</span>
      </div>

      <div className="lang-sec">
        <input
          type="radio"
          id="software-development"
          name="expertise"
          value="Software Development"
          onChange={handleExpertiseChange}
          checked={expertise === "Software Development"}
        />
        <label className="custom-radio-sel-lang" htmlFor="software-development">
          Software Development
        </label>

        <input
          type="radio"
          id="product-management"
          name="expertise"
          value="Product Management"
          onChange={handleExpertiseChange}
          checked={expertise === "Product Management"}
        />
        <label className="custom-radio-sel-lang" htmlFor="product-management">
          Product Management
        </label>

        <input
          type="radio"
          id="data-science"
          name="expertise"
          value="Data Science"
          onChange={handleExpertiseChange}
          checked={expertise === "Data Science"}
        />
        <label className="custom-radio-sel-lang" htmlFor="data-science">
          Data Science
        </label>

        <input
          type="radio"
          id="ux-design"
          name="expertise"
          value="UX Design"
          onChange={handleExpertiseChange}
          checked={expertise === "UX Design"}
        />
        <label className="custom-radio-sel-lang" htmlFor="ux-design">
          UX Design
        </label>

        <input
          type="radio"
          id="marketing"
          name="expertise"
          value="Marketing"
          onChange={handleExpertiseChange}
          checked={expertise === "Marketing"}
        />
        <label className="custom-radio-sel-lang" htmlFor="marketing">
          Marketing
        </label>
      </div>

      <div className="select-skill-sec">
        <span className="select-lang">Your SkillSet:</span>

        <div className="skill-card-container">
          {SkillsetArray.map((skills, index) => (
            <div className="skill-card" key={index}>
              <span>
                <b>{skills.skillset}</b> ({skills.yearsOfExperience} years)
              </span>
            </div>
          ))}
        </div>

        <div className="select-option-container">
          <select
            style={{ width: "150px" }}
            className="select-option-input-skill"
            value={skillset}
            onChange={(e) => setSkillset(e.target.value)}
          >
            <option value="">Skillset</option>
            {programmingLanguages.map((items, index) => (
              <option key={index} value={items}>
                {items}
              </option>
            ))}
          </select>

          <input
            style={{ width: "70px" }}
            type="number"
            className="select-option-input-rating"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            placeholder="Years"
            min="0"
          />

          <button className="add-btn" onClick={handleAddSkill}>
            Add
          </button>
        </div>
      </div>

      <div className="basic-info-container">
        <span className="select-lang">Basic Information:</span>
        <div className="basic-info-options">
          <div>
            <label htmlFor="employment-status">Total Work Experience:</label>
            <select
              id="employment-status"
              onChange={(e) => setCurrentlyEmployed(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((items, index) => (
                <option key={index} value={items}>
                  {items}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button className="select-btn" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}
