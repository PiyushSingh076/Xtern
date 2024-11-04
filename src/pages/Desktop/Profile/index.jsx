// Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import code from "../../../assets/svg/code.svg";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import schedule from "../../../assets/svg/schedule.svg";
import medal from "../../../assets/svg/medal.png";

import "./Profile.css";
import toast from "react-hot-toast";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import Loading from "../../../components/Loading";

// Component definition
const SingleMentor = () => {
  // State declarations
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewtime, setInterviewTime] = useState("");
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const navigate = useNavigate();
  const { uid } = useParams();
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);
  console.log("profileData", profileData, profileError);
  // Slider settings
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // schedule interview modal
  const handleScheduleInterview = () => {
    setInterviewScheduled(true);
  };

  // Hooks
  const { userData, loading, error } = useFetchUserData();
  const internInfo = useSelector((state) => state.internInfo);
  console.log(internInfo);

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
  //   if (profileLoading) return <Loading />;
  return (
    <div className="desktop-profile-container">
      {/* Profile details section */}
      <section id="profile-details-section">
        <div className="profile-details">
          <div className="profile-details-wrap mt-32">
            {/* Profile image and basic info */}
            <div className="profile-details-first-wrap">
              <div className="mentor-img-sec">
                <div className="mentor-medal-sec">
                  <img
                    src={medal}
                    className="mentor-medal"
                    width={"24px"}
                    alt="medal"
                  />
                  <span>{profileData?.medal}</span>
                </div>
                <img
                  src={profileData?.photo_url}
                  alt={profileData?.display_name || "profile image"}
                  width={96}
                  height={96}
                />
              </div>
              <div className="profile-details-details">
                <h1>{profileData?.display_name}</h1>
                <h4 className="mt-12">Graduation Year: 2024</h4>
                <p className="mt-16">{profileData?.role}</p>
              </div>
            </div>

            {/* Skills section */}
            <div className="profile-details-skill-sec">
              <h3>Skills</h3>
            </div>

            {/* Skills slider */}
            <Slider {...settings}>
              {profileData?.skillSet.map((skill, index) => (
                <div className="profile-details-second-wrap-sec" key={index}>
                  <div
                    className={`mentor-icon ${
                      ["purple-bg", "green-bg", "pink-bg", "orange-bg"][
                        index % 4
                      ]
                    }`}
                  >
                    <img
                      width={"30px"}
                      src={code}
                      alt={`${skill.skillset}-icon`}
                    />
                  </div>
                  <div className="mentor-content-single mt-12">
                    <h3>{skill.skill}</h3>
                    <p>{skill.rating}</p>
                  </div>
                </div>
              ))}
            </Slider>

            {/* Tabs section */}
            <div className="single-mentor-third-sec">
              <div className="fifth-decs-sec mt-32">
                <div className="fifth-decs-sec-wrap">
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
                  <div className="tab-content" id="course-tab-btn">
                    <div
                      className="tab-pane fade show active mt-16"
                      id="course-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      {profileData?.workExperience.map((work, index) => {
                        const startDate = new Date(
                          work.startdate.seconds * 1000
                        );

                        const startDateFormatted = startDate.toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long" }
                        );

                        return (
                          <div
                            className="experience-sec"
                            key={work.role + work.companyname}
                          >
                            <h4>{work.role}</h4>
                            <p>
                              {work.companyname} | {startDateFormatted} - August
                              2022
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
                              style={{ marginTop: "10px" }}
                              id={`collapse-${index}`}
                              className="collapse"
                              aria-labelledby={`collapse-${index}`}
                            >
                              <div className="card card-body">
                                {work.description}
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
                      {profileData?.educationDetails.map((educ) => (
                        <div className="experience-sec">
                          <h4>{educ.degree}</h4>
                          <h6>Stream: ({educ.branch})</h6>
                          <p>{educ.collegename} </p>
                          <p>
                            {" "}
                            Batch: {educ.startyear} - {educ.endyear}
                          </p>
                          {/* <span> cgpa </span> */}
                        </div>
                      ))}
                    </div>
                  </div>
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
                          <h4>{project.projectname}</h4>

                          <div style={{ marginTop: "20px" }}>
                            <span>
                              <b>Tech Stack:</b>{" "}
                              {project.techstack.map((item) => (
                                <span key={item}> {item} |</span>
                              ))}
                            </span>
                          </div>

                          <button
                            className="desc-btn"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${index}`}
                            aria-expanded="false"
                            aria-controls={`collapse-${index}`}
                          >
                            View Description
                          </button>

                          <Link to={project.link} className="link-btn">
                            Live Link
                          </Link>

                          <div
                            style={{ marginTop: "10px" }}
                            id={`collapse-${index}`}
                            className="collapse"
                            aria-labelledby={`collapse-${index}`}
                          >
                            <div className="card card-body">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Similar profiles section */}
      <section id="similar-profiles-section">
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

        {/* Interview scheduling modal */}
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
        {/* Similar profiles */}
      </section>
    </div>
  );
};

export default SingleMentor;
