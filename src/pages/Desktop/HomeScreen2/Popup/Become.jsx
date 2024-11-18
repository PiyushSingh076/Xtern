import React, { useState } from "react";
import close from "../../../../assets/svg/cancel-icon.svg";
import types from "../../../../assets/svg/type.jpg";
import skill from "../../../../assets/svg/domain.jpg";
import available from "../../../../assets/svg/to.jpg";
import student from "../../../../assets/svg/student.jpg";
import Welcome from "../../../../assets/svg/welcome.jpg";
import SignIn from "../../../SignIn";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";
import EyeiconFill from "../../../../assets/svg/eye-off-fill.svg";
import Eyeicon from "../../../../assets/svg/eye-fill.svg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import SignInWithSocial from "../../../../components/SignInWithSocial";

export default function Become({ setShow }) {
  const [Role, setRole] = useState(null);
  const [SkillsetArray, setSkillsetArray] = useState([]);
  const [AvailablityTo, setAvailablityTo] = useState(null);
  const [AvailablityFrom, setAvailablityFrom] = useState(null);
  const [studyingStatus, setStudyingStatus] = useState(null);
  const [graduationYear, setGraduationYear] = useState(null);

  const IsLogin =
    Role &&
    SkillsetArray &&
    AvailablityFrom &&
    AvailablityTo &&
    studyingStatus &&
    graduationYear;

  const roles = [
    "Developer",
    "Digital marketer",
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "DevOps Engineer",
    "Cyber Security Specialist",
    "Artificial Intelligence Engineer",
    "Full Stack Developer",
    "Human Resources",
  ];

  const [skillset, setSkillset] = useState("");
  const [ratindDone, setRatingDone] = useState(false);
  const [rating, setRating] = useState("");

  const [programmingLanguages, setProgrammingLanguages] = useState([
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Swift",
    "Ruby",
    "PHP",
    "Go",
    "Rust",
    "Kotlin",
    "TypeScript",
    "Scala",
    "Perl",
    "Haskell",
    "MATLAB",
    "SQL",
    "Visual Basic",
    "Delphi",
    "Pascal",
  ]);

  const handleAddSkill = () => {
    if (skillset && rating) {
      const newSkill = { skillset, rating };
      setSkillsetArray([...SkillsetArray, newSkill]);
      setSkillset("");
      setRating("");
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleNextRating = () => {
    if (SkillsetArray.length <= 2) {
      alert("Add atleast 3 skills");
    } else {
      setRatingDone(true);
    }
  };

  // Login Logic

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.preferredLanguage && userData.typeUser) {
            navigate(ROUTES.PREFERRED_ROLE);
          } else {
            navigate(ROUTES.PREFERRED_ROLE);
          }
        } else {
          console.error("No such user profile!");
        }
      } else {
        console.error("User is null after sign-in!");
        // Handle the case where the user is not properly signed in
      }
    } catch (err) {
      setError(err.message); // Handle errors, such as incorrect credentials
    }
  };

  const [loading, setLoading] = useState(true);

  return (
    <div className="pop-card">
      <img onClick={() => setShow(false)} src={close} className="close-icon" />
      <div className="pop-image-container">
        <span>Become Xpert</span>

        {!Role && <img src={types} className="vector-image" width={"90%"} />}
        {Role && !ratindDone && (
          <img className="vector-image" src={skill} width={"90%"} />
        )}
        {Role && ratindDone && AvailablityTo == null && (
          <img className="vector-image" src={available} width={"100%"} />
        )}
        {Role &&
          ratindDone &&
          AvailablityFrom &&
          AvailablityTo &&
          !graduationYear && (
            <img className="vector-image" src={student} width={"90%"} />
          )}
        {Role &&
          ratindDone &&
          AvailablityFrom &&
          AvailablityTo &&
          graduationYear && (
            <img className="vector-image" src={Welcome} width={"90%"} />
          )}
      </div>
      <div className="xpert-info-input">
        {!Role && (
          <div className="info-input-section">
            <div className="info-input-header">
              <h2>You are Xpert in:</h2>
            </div>
            <div className="xpert-roles-options">
              <div className="lang-sec">
                {roles.map((items) => (
                  <div>
                    <input
                      type="radio"
                      id={items}
                      name="role"
                      value={items}
                      onChange={handleRoleChange}
                    />
                    <label className="custom-radio-sel-lang" htmlFor={items}>
                      {items}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {Role && !ratindDone && (
          <div className="des-select-skill-sec">
            <span className="select-lang">Your SkillSet:</span>

            <div className="skill-card-container">
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

                <select
                  className="select-option-input-rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Rating</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <button className="add-btn" onClick={handleAddSkill}>
                  Add
                </button>
              </div>
              {SkillsetArray.map((skills, index) => (
                <div className="des-skill-card" key={index}>
                  <span>
                    <b>{skills.skillset}</b> ({skills.rating})
                  </span>
                </div>
              ))}
            </div>

            <button className="next-btn" onClick={handleNextRating}>
              Next
            </button>
          </div>
        )}

        {ratindDone && AvailablityFrom == null && (
          <div className="available-date-conrainer">
            <span className="select-lang">Availablity - From</span>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                  <DemoItem>
                    <Box sx={{ width: "100%", height: "400px" }}>
                      {" "}
                      {/* Adjust width as needed */}
                      <DateCalendar
                        value={AvailablityFrom}
                        onChange={(newValue) => setAvailablityFrom(newValue)}
                      />
                    </Box>
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        )}

        {AvailablityFrom != null && AvailablityTo == null && (
          <div className="available-date-conrainer">
            <span className="select-lang">Availablity - To</span>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                  <DemoItem>
                    <Box sx={{ width: "100%", height: "400px" }}>
                      {" "}
                      {/* Adjust width as needed */}
                      <DateCalendar
                        value={AvailablityTo}
                        onChange={(newValue) => setAvailablityTo(newValue)}
                      />
                    </Box>
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        )}

        {AvailablityTo && (!graduationYear || !studyingStatus) && (
          <div className="xpert-basic-info-container">
            <span className="select-lang">Basic Information:</span>
            <div className="basic-info-options">
              <div>
                <label htmlFor="studying-status">Still studying:</label>
                <select
                  className="xpert-studying"
                  id="studying-status"
                  onChange={(e) => setStudyingStatus(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label>Graduation Year:</label>
                <select onChange={(e) => setGraduationYear(e.target.value)}>
                  <option value="">Select</option>
                  {[2024, 2023, 2022, 2021].map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {IsLogin && (
          <div className="auth-container">
            <div className="container">
              <div className="sign-in-login">
                <h1 className="login-txt">Login To Your Account</h1>
              </div>
              <div className="sign-in-login-form mt-24">
                <form onSubmit={handleSignIn}>
                  <div className="form-details-sign-in">
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_330_7186"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="white" />
                        </mask>
                        <g mask="url(#mask0_330_7186)">
                          <path
                            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 7L12 13L21 7"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="Email"
                      placeholder="Email"
                      className="sign-in-custom-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-details-sign-in mt-12">
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_330_7136"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                        >
                          <rect width="24" height="24" fill="white" />
                        </mask>
                        <g mask="url(#mask0_330_7136)">
                          <path
                            d="M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </span>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      placeholder="Password"
                      className="sign-in-custom-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <img
                      src={isPasswordVisible ? Eyeicon : EyeiconFill}
                      alt="Password Visibility Toggle"
                      className="password-toggle-icon"
                      id="eye"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  {error && <p className="error-message">{error}</p>}
                  <div className="sign-in-btn mt-32 ">
                    <button type="submit">Sign In</button>
                  </div>
                </form>
              </div>
              <div className="remember-section">
                <div className="footer-checkbox-sec">
                  <input
                    className="footer-checkbox-input"
                    id="footer-checkbox"
                    type="checkbox"
                  />
                  <label htmlFor="footer-checkbox" className="footer-chec-txt">
                    Remember Me
                  </label>
                </div>
                <div className="forget-btn">
                  <Link to="/forgetpassword">Forget password?</Link>
                </div>
              </div>
              <div className="or-section mt-32">
                <p>or continue with</p>
              </div>
              <SignInWithSocial />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
