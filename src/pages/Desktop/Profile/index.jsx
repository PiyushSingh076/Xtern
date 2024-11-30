// Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import code from "../../../assets/svg/code.svg";
import { useSelector } from "react-redux";
import medal from "../../../assets/svg/medal.png";
import "./Profile.css";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Skeleton from "@mui/material/Skeleton";
import schedule from "../../../assets/svg/calendar.png";
import chat from "../../../assets/svg/chat.png";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import { Flag } from "@mui/icons-material";
import useRegisterUser from "../../../hooks/Stream/client";

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

  // Slider settings
  // const settings = {
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 2,
  //   slidesToScroll: 2,
  //   initialSlide: 0,
  //   autoplay: false,
  // };

  // schedule interview modal

  // Hooks

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
          <div className="profile-details-wrap mt-32">
            {/* Profile image and basic info */}
            <div className="profile-details-first-wrap">
              {profileLoading ? (
                <Skeleton variant="circular" width={100} height={100} />
              ) : (
                <div className="profile-img-info-container">
                  <div className="mentor-img-sec">
                    {/* <div className="mentor-medal-sec">
                      <img
                        src={medal}
                        className="mentor-medal"
                        width={"24px"}
                        alt="medal"
                      />
                      <span>{profileData?.medal}</span>
                    </div> */}
                    <img
                      src={profileData?.photo_url}
                      alt={profileData?.firstName || "profile image"}
                      width={100}
                      height={100}
                      onError={(e) => (e.target.src = "")}
                    />
                  </div>
                  <div className="profile-details-details">
                    {profileLoading ? (
                      <Skeleton
                        variant="text"
                        sx={{
                          fontSize: "1rem",
                          width: "300px",
                          height: "30px",
                        }}
                      />
                    ) : (
                      <h4>{profileData?.firstName} {profileData?.lastName}</h4>
                    )}
                    {profileLoading ? (
                      <Skeleton
                        variant="text"
                        sx={{
                          fontSize: "1rem",
                          width: "200px",
                          height: "20px",
                        }}
                      />
                    ) : (
                      <span className="mt-12">
                        Year of Experience: {profileData?.experience}
                      </span>
                    )}
                    {profileLoading ? (
                      <Skeleton
                        variant="text"
                        sx={{
                          fontSize: "1rem",
                          width: "100px",
                          height: "20px",
                        }}
                      />
                    ) : (
                      <p className="mt-14">{profileData?.type}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <div className="profile-details-second-wrap">
                <div className="service-item">
                    <span className="service-name">
                      Consulting Price
                    </span>
                    <div className="consulting-btn">
                      <button className="chat-btn">
                        💬 Chat
                      </button>
                      <button className="call-btn">
                        📞 Call
                      </button>
                    </div>
                    <span className="service-price">
                    ₹{profileData?.consultingPrice}/{profileData?.consultingDuration?.split(' ')[0] + ' ' +profileData?.consultingDurationType?.split(' ')[1]}
                    </span>

                  </div>
                  {/* <button className="chat-btn"><img src={chat} width={'50px'} alt="chat"/> Chat</button> */}
                </div>
              </div>
            </div>
             {/* Skills section */}
            {profileLoading ? (
              <Skeleton
                variant="rectangle"
                sx={{
                  width: "100%",
                  height: "200px",
                  marginTop: "20px",
                  borderRadius: "10px",
                }}
              />
            ) : (
           <div className="skill-service-container">
              <div className="skill-container">
                <div className="profile-details-skill-sec">
                  <h3>Skills</h3>
                </div>

                {/* Skills slider */}
                <div className="skillset-container">
                  {profileData?.skillSet?.map((skillItem, index) => (
                    <div
                      className="profile-details-second-wrap-sec"
                      key={index}
                    >
                      <div
                        className={`mentor-icon ${
                          ["purple-bg", "green-bg", "pink-bg", "orange-bg"][
                            index % 4
                          ]
                        }`}
                        style={{
                          position: "relative",
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <CircularProgressbar
                          value={
                            100
                            
                          }
                          styles={buildStyles({
                            pathColor: "green",
                            // skillItem.rating == "High"
                            //   ? "green"
                            //   : skillItem.rating == "Medium"
                            //   ? "orange"
                            //   : "red",
                            // trailColor: "#f0f0f0",
                          })}
                        />
                        <img
                          src={code}
                          alt={`${skillItem}-icon`}
                          style={{
                            padding: "5px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)", 
                            width: "40px",
                          }}
                        />
                      </div>
                      <div className="mentor-content-single mt-12">
                 
                        <p>{skillItem.skill}</p>
                     
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-container">
                <h3>Services</h3>
                <div className="service-list">
               


                  
    


                  {profileData?.serviceDetails?.map((serviceItem, index) => (
                    <div key={index} className="service-item">
                             <span className="service-name">{serviceItem?.serviceName}</span>
                             <span className="service-description">
                             {(serviceItem?.serviceDescription).slice(0,100) + '..'}
                              </span>
                             <span className="service-price">₹{serviceItem?.servicePrice}</span>
                      </div>
                  ))}
                  </div>
              </div>
           </div>
            )}
            {/* Tabs section */}
            <div className="single-mentor-third-sec">
              <div className="fifth-decs-sec mt-32">
                <div className="fifth-decs-sec-wrap">
                  {profileLoading ? (
                    <Skeleton
                      variant="rectangle"
                      sx={{
                        width: "100%",
                        height: "50px",
                        marginTop: "20px",
                        borderRadius: "10px",
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
                          data-bs-target="#student-content"
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
                          data-bs-target="#reviews-content"
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
                  <div className="tab-content" id="course-tab-btn">
                    <div
                      className="tab-pane fade show active mt-16"
                      id="course-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                     {profileData?.workExperience?.map((work, index) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
   


  if (profileLoading)
    return (
      <Skeleton
        key={index}
        variant="rectangle"
        sx={{
          width: "100%",
          height: "100px",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      />
    );

  return (
    <div
      className="experience-sec"
      key={work?.title + work?.company}
    >
      <div className="work-logo-container">
        <img src={'https://cdn-icons-png.flaticon.com/512/10655/10655913.png'} className="educ-logo" alt="Company Logo" />
      </div>
      <div className="experience-info">
        <h4>{work?.role}</h4>
        <p>
          {work?.companyname} | {dayjs.unix(work?.startdate?.seconds).format('MMMM D, YYYY')} - {dayjs.unix(work?.enddate?.seconds).format('MMMM D, YYYY') || 'Present'}
        </p>

        <button
          className="desc-btn"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${index}`}
          aria-expanded="false"
          aria-controls={`collapse-${index}`}
        >
          View Description
        </button>

        <div
          id={`collapse-${index}`}
          className="collapse"
          aria-labelledby={`collapse-${index}`}
          style={{
            marginTop: "10px",
            width: "100%",
          }}
        >
          <div
            className="card card-body"
            style={{
              width: "100%",
            }}
          >
            {work?.description || "No description available"}
          </div>
        </div>
      </div>
    </div>
  );
})}
                    </div>
                  </div>
                  <div className="tab-content" id="student-tabContent">
                    <div
                      className="tab-pane fade show"
                      id="student-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      {profileData?.educationDetails?.map((educ, index) => {
                        if (profileLoading) {
                          return (
                            <Skeleton
                              variant="rectangle"
                              sx={{
                                width: "100%",
                                height: "100px",
                                marginTop: "20px",
                                borderRadius: "10px",
                              }}
                              key={index}
                            />
                          );
                        } else {
                          return (
                            <div className="experience-sec" key={index}>
                              <div className="work-logo-container">
                                <img src={'https://cdn.vectorstock.com/i/1000v/14/68/education-color-icon-vector-29051468.jpg'} className="educ-logo" />
                              </div>
                              <div className="experience-info">
                                <h4>{educ.degree}</h4>
                                <h6>Stream: ({educ.branch})</h6>
                                <p>{educ.school}</p>
                                <p>
                                  Batch: {educ.startyear} - {educ.endyear}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  {profileLoading ? (
                    <Skeleton
                      variant="rectangle"
                      sx={{
                        width: "100%",
                        height: "200px",
                        marginTop: "20px",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <div className="tab-content" id="review-tabContent">
                      <div
                        className="tab-pane fade show"
                        id="reviews-content"
                        role="tabpanel"
                        tabIndex="0"
                        aria-labelledby="reviews-tab-btn"
                      >
                        {profileData?.projectDetails.map((project, index) => (
                          <div className="experience-sec" key={index}>
                            <div className="work-logo-container">
                              <img src={'https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg'} className="educ-logo" />
                            </div>
                            <div className="experience-info">
                              <h4>{project.projectname}</h4>

                              <div style={{ marginTop: "5px" }}>
                                <span>
                                  <b>Tech Stack:</b>{" "}
                                  {project.techstack?.map((item) => (
                                    <span key={item}> {item} |</span>
                                  ))}
                                </span>
                              </div>

                              <div className="desc-view-btn-container">


                              <Link to={project.link} className="link-btn">
                                  Live Link
                                </Link>

                                <button
                                  className="desc-btn"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapse-${index}`}
                                  aria-expanded="false"
                                  aria-controls={`collapse-${index}`}
                                >
                                  View Description
                                </button>

                              
                              </div>

                              <div
                                style={{ marginTop: "10px",
                                 }}
                                id={`collapse-${index}`}
                                className="collapse"
                                aria-labelledby={`collapse-${index}`}
                              >
                                <div 
                                style={{width: '100%'}}
                                className="card card-body">
                                  {project.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Similar profiles section */}
      {/* <section id="similar-profiles-section">
        <div className="xtern-btn-sec">
          <div
            className="schedule-interview-btn"
            data-bs-toggle="modal"
            data-bs-target="#scheduleInterviewModal"
          >
            <div>
              <img
                src={schedule}
                className="schedule-icon me-2"
                alt="schedule"
                width={20}
                height={20}
              />
              <span>
                {interviewScheduled
                  ? "Reschedule Interview"
                  : "Schedule Interview"}
              </span>
            </div>
            <div className="interview-scheduled-sec">
              {interviewScheduled ? (
                <div className="interview-scheduled-sec-wrap">
                  <b>Interview Scheduled on:</b>{" "}
                  <span>
                    {interviewDate} at {interviewtime}
                  </span>
                </div>
              ) : (
                <span>No Interview Scheduled</span>
              )}
            </div>
          </div>
        </div>

         Interview scheduling modal 
        <div
          style={{ marginTop: "40px" }}
          className="modal fade "
          id="scheduleInterviewModal"
          tabIndex="-1"
          aria-labelledby="scheduleInterviewModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="scheduleInterviewModalLabel">
                  Schedule an Interview
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Interview Date</h6>
                  <input
                    onChange={(e) => setInterviewDate(e.target.value)}
                    type="date"
                    className="form-control mt-3"
                    id="interviewDate"
                  />
                  <input
                    onChange={(e) => setInterviewTime(e.target.value)}
                    type="time"
                    className="form-control mb-3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  onClick={handleScheduleInterview}
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
         Similar profiles 
     
      </section> */}

      {interviewScheduled && (
        <div className="schedule-interview-container">
          <div className="schedule-interview-card">
            <div className="schedule-interview-img-section">
              <span>Schedule Inteview</span>
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
