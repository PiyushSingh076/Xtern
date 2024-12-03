// Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Profile.css";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import "react-circular-progressbar/dist/styles.css";
import Skeleton from "@mui/material/Skeleton";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import useRegisterUser from "../../../hooks/Stream/client";
import { FaClock , FaPhone} from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { MdChat } from 'react-icons/md';



// Component definition
const SingleMentor = () => {
  // State declarations
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const [interviewDate, setInterviewDate] = useState(dayjs("2022-04-17"));
  const [DateContainer, setDateContainer] = useState(true);
  const [interviewtime, setInterviewTime] = useState(dayjs("2022-04-17T15:30"));
  const [TimeContainer, setTimecontainer] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const navigate = useNavigate();





  const { uid } = useParams();
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);
  console.log("profileData", profileData, profileError);

  const registrationStatus = useRegisterUser(profileData, profileLoading, profileError);

  console.log("Registration Status:", registrationStatus);


  const sanitizeProfileData = (data) => {
  return JSON.parse(JSON.stringify(data)); // Removes non-serializable fields
};

const handleEdit = () => {
  const sanitizedData = sanitizeProfileData(profileData);
  navigate('/userdetail', { state: { profileData: sanitizedData } });
};

  const internInfo = useSelector((state) => state.internInfo);
  console.log(internInfo);

  // Schedule interview functions

  const handledatechange = (date) => {
    setInterviewDate(date);
    setDateContainer(false);
    setTimecontainer(true);
  };

  const scheduled = () => {
    alert("Interview scheduled");
    setInterviewScheduled(false);
    setDateContainer(true);
    setTimecontainer(false);
  };

  // Event handlers
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkedIcon = () => {
    setIsBookmarkedIcon(!isBookmarkedIcon);
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page in the history stack
  };

  return (
  
    <div className="desktop-profile-container">

    
   
      {/* Profile details section */}
     <section id="profile-details-section">
  <div className="profile-details">
    <div className="profile-details-wrap">
      {/* Profile image and basic info */}
      <div className="profile-details-first-wrap">
       
  <button onClick={handleEdit} className="edit-btn">
    <MdEdit/>
  </button>

        <div className="profile-img-info-container">
          {/* Profile Image Section */}
          <div className="mentor-img-sec">
            {profileLoading ? (
              <Skeleton
                variant="circular"
                width={150}
                height={150}
                animation="wave"
              />
            ) : (
              <img
                src={profileData?.photo_url}
                alt={profileData?.firstName || "Profile Image"}
                width={150}
                height={150}
                onError={(e) => (e.target.src = "")} // Fallback image logic
              />
            )}
          </div>

          {/* Profile Details Section */}
          <div className="profile-details-details">
            {/* Name */}
            {profileLoading ? (
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "1.2rem", width: "150px", height: "30px" }}
              />
            ) : (
              <h4 style={{ marginTop: "10px" }}>
                {profileData?.firstName} {profileData?.lastName}
              </h4>
            )}

            {profileLoading ? (
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "1rem", width: "100px", height: "20px" }}
              />
            ) : (
              <span>
                {profileData?.city}, {profileData?.state}
              </span>
            )}

            {/* Experience */}
            {profileLoading ? (
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "1rem", width: "200px", height: "20px" }}
              />
            ) : (
              <span>Year of Experience: {profileData?.experience}</span>
            )}

            {/* Profile Type */}
            {profileLoading ? (
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "1rem", width: "100px", height: "20px" }}
              />
            ) : (
              <p>{profileData?.type}</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills section */}
      {profileLoading ? (
        <Skeleton
          variant="rectangle"
          sx={{
            width: "100%",
            height: "350px",
            marginTop: "20px",
            borderRadius: "20px",
          }}
        />
      ) : (
        <div className="skills-section">
          <div className="skills-header">Skills</div>
          {profileData?.skillSet.map((item) => {
            // Convert rating (1 to 5) into percentage
            const ratingPercentage = (parseInt(item.skillRating) / 5) * 100;

            return (
              <div className="skill-bar-card" key={item.skill}>
                <span>{item.skill}</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="skill-rating"
                    style={{
                      marginBottom: "5px",
                      fontSize: "12px",
                      color: "#009DED",
                    }}
                  >
                    {ratingPercentage}%
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      style={{
                        width: `${ratingPercentage}%`,
                        backgroundColor: "#009DED", // Assign color based on rating
                        height: "5px",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
</section>
    
  <section className="acadmic-section-container">
  {
    profileLoading ? 
    (
      <Skeleton
      animation="pulse"
      variant="rectangular"
      sx={{width: '100%' , height: '100px' , borderRadius: "20px"}}
      />
    ) :
    (<div className="consulting-container" style={{ marginBottom: '20px' }}>
    <div className="consulting-btn-container">
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <span className="service-name">Consulting Now</span>
        <div className="issue-badge">
          {['Divorce', 'Property issue', 'Employment issue', 'Other'].map((item) => (
            <div className="badge">{item}</div>
          ))}
        </div>
      </div>
      <div className="consulting-btn">
        <button onClick={() => setInterviewScheduled(true)} className="chat-btn">
          <MdChat /> Chat
        </button>
        <button onClick={() => setInterviewScheduled(true)} className="chat-btn">
          <MdPhone /> Call
        </button>
      </div>
      <span className="consultant-price">
        ₹{profileData?.consultingPrice ? profileData?.consultingPrice : 'Loading'}
      
        {'/minute'}
      </span>
    </div>
  </div>)
  }

  {
    profileLoading ? 
    (
      <Skeleton
      animation="pulse"
      variant="rectangular"
      sx={{width: '100%' , height: '200px' , borderRadius: "20px", marginTop: '20px'}}
      />
    ):
    (<div className="service-container">
    <h4>Service</h4>
    <div className="service-list">
      {profileData?.serviceDetails.map((item) => (
        <div className="service-item">
          <span className="service-name">{item.serviceName}</span>
          <p>{item.serviceDescription}</p>
          <div className="price-duration-container">
            <span className="service-duration">
              <FaClock /> {item?.serviceDuration || 'N/A'} {item?.serviceDurationType || 'N/A'}
            </span>
            <span className="service-price">₹{item.servicePrice}</span>
          </div>
        </div>
      ))}
    </div>
  </div>)
  }

  <div className="single-mentor-third-sec">
    <div className="fifth-decs-sec">
      <div className="fifth-decs-sec-wrap">
        {profileLoading ? (
          <Skeleton
            variant="rectangle"
            sx={{
              width: '100%',
              height: '50px',
              marginTop: '20px',
              borderRadius: '10px',
            }}
          />
        ) : (
          <ul
            className="nav nav-pills single-mentor-tab"
            id="mentor-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="mentor-course-tab-btn"
                data-bs-toggle="pill"
                data-bs-target="#course-content"
                type="button"
                role="tab"
                aria-selected="true"
              >
                Work Experience
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="student-tab-btn"
                data-bs-toggle="pill"
                data-bs-target="#education-content"
                type="button"
                role="tab"
                aria-selected="false"
                tabIndex="-1"
              >
                Education
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="reviews-tab-btn"
                data-bs-toggle="pill"
                data-bs-target="#projects-content"
                type="button"
                role="tab"
                aria-selected="false"
                tabIndex="-1"
              >
                Projects
              </button>
            </li>
          </ul>
        )}

       <div className="tab-content" id="mentor-tab-content">
  {/* Work Experience Tab */}
  <div className="tab-pane fade show active mt-16" id="course-content" role="tabpanel">
    {profileData?.workExperience?.map((work, index) => (
      <div className="experience-sec" key={`${work?.role}-${index}`}>
        <div className="work-logo-container">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10655/10655913.png"
            className="educ-logo"
            alt="Company Logo"
          />
        </div>
        <div className="experience-info">
          <h4>{work?.role}</h4>
          <p>
            {work?.companyName} |{" "}
            {dayjs.unix(work?.startDate?.seconds).format("D MMM YYYY")} -{" "}
            {work.endDate === "present" || !work.endDate
              ? "Present"
              : dayjs.unix(work?.endDate?.seconds).format("D MMM YYYY")}
          </p>
          <button
            className="desc-btn"
            data-bs-toggle="collapse"
            data-bs-target={`#work-collapse-${index}`}
            aria-expanded="false"
            aria-controls={`work-collapse-${index}`}
          >
            View Description
          </button>
          <div
            id={`work-collapse-${index}`}
            className="collapse"
            aria-labelledby={`work-collapse-${index}`}
          >
            <div className="card card-body">
              {work?.description || "No description available"}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Education Tab */}
  <div className="tab-pane fade" id="education-content" role="tabpanel">
    {profileData?.educationDetails?.map((educ, index) => (
      <div className="experience-sec" key={`educ-${index}`}>
        <div className="work-logo-container">
          <img
            src="https://cdn.vectorstock.com/i/1000v/14/68/education-color-icon-vector-29051468.jpg"
            className="educ-logo"
            alt="Education Logo"
          />
        </div>
        <div className="experience-info">
          <h4>{educ?.degree}</h4>
          <h6>Stream: {educ?.stream}</h6>
          <p>{educ?.college}</p>
          <p>
            {dayjs.unix(educ?.startDate?.seconds).format("D MMM YYYY")} -{" "}
            {educ.endDate === "present" || !educ.endDate
              ? "Present"
              : dayjs.unix(educ?.endDate?.seconds).format("D MMM YYYY")}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Projects Tab */}
  <div className="tab-pane fade" id="projects-content" role="tabpanel">
    {profileData?.projectDetails?.map((project, index) => (
      <div className="experience-sec" key={`project-${index}`}>
        <div className="work-logo-container">
          <img
            src="https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg"
            className="educ-logo"
            alt="Project Logo"
          />
        </div>
        <div className="experience-info">
          <h4>{project?.projectName}</h4>
          <div>
            <b>Tech Stack:</b>{" "}
            {project?.techstack?.map((item, idx) => (
              <span key={idx}>{item}{idx !== project.techstack.length - 1 && ", "}</span>
            )) || "No tech stack available"}
          </div>
          <div className="desc-view-btn-container">
            {project?.liveDemo && (
              <a
                href={project?.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                Live Link
              </a>
            )}
            <button
              className="desc-btn"
              data-bs-toggle="collapse"
              data-bs-target={`#project-collapse-${index}`}
              aria-expanded="false"
              aria-controls={`project-collapse-${index}`}
            >
              View Description
            </button>
          </div>
          <div
            id={`project-collapse-${index}`}
            className="collapse"
            aria-labelledby={`project-collapse-${index}`}
          >
            <div className="card card-body">
              {project?.description || "No description available"}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  </div>
</section>
{interviewScheduled && (
  <div className="schedule-interview-container">
    <div className="schedule-interview-card">
      <div className="schedule-interview-img-section">
        <span>Schedule Call</span>
        <img
          alt="img"
          src="https://img.freepik.com/free-vector/employee-month-concept_23-2148459815.jpg?semt=ais_hybrid"
        />
      </div>
      <div className="date-time-container">
        {DateContainer && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateCalendar", "DateCalendar"]}>
              <DemoItem>
                <DateCalendar
                  value={interviewDate}
                  onChange={(newValue) => handledatechange(newValue)}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        )}

        {TimeContainer && (
          <div className="time-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimeClock", "TimeClock"]}>
                <DemoItem>
                  <TimeClock
                    value={interviewtime}
                    onChange={(newValue) => setInterviewTime(newValue)}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>

            <button onClick={scheduled} className="btn btn-primary">
              Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SingleMentor;