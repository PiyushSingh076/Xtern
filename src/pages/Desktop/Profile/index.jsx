import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Profile.css";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import "react-circular-progressbar/dist/styles.css";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import useRegisterUser from "../../../hooks/Stream/client";
import { FaClock } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdChat } from "react-icons/md";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const SingleMentor = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const [interviewDate, setInterviewDate] = useState(dayjs("2022-04-17"));
  const [DateContainer, setDateContainer] = useState(true);
  const [interviewtime, setInterviewTime] = useState(dayjs("2022-04-17T15:30"));
  const [TimeContainer, setTimecontainer] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [Editable, setEditable] = useState(false);
  const navigate = useNavigate();

  const { uid } = useParams();
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);

  const { userData: currentUser } = useFetchUserData();


if(!profileLoading){
  if(!profileData?.type){
    navigate('/xpertrole')
  }
}


  useEffect(() => {
    if (currentUser && currentUser.uid === uid) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [currentUser, uid]);

  const registrationStatus = useRegisterUser(
    profileData,
    profileLoading,
    profileError
  );


  const badgeMapping = {
    Developer: ["Frontend", "Backend", "Full Stack", "Mobile Apps"],
    Designer: ["UI/UX", "Graphics", "Web Design", "Animation"],
    CloudDevOps: ["AWS", "Azure", "CI/CD", "Kubernetes"],
    ContentCreator: ["Blogs", "Videos", "Podcasts", "Social Media"],
    DigitalMarketing: ["SEO", "PPC", "Social Media", "Email Marketing"],
    Lawyer: ["Divorce", "Property Issue", "Employment Issue", "Other"],
    HR: ["Recruitment", "Payroll", "Training", "Employee Relations"],
    Accountant: ["Taxation", "Auditing", "Budgeting", "Financial Reports"],
    Intern: ["Learning", "Assisting", "Research", "Shadowing"],
  };

  const professionBadges = badgeMapping[profileData?.type] || [];

  const sanitizeProfileData = (data) => {
    return JSON.parse(JSON.stringify(data)); // Removes non-serializable fields
  };

  const handleEdit = () => {
    const sanitizedData = sanitizeProfileData(profileData);
    navigate("/userdetail", { state: { profileData: sanitizedData } });
  };

  const internInfo = useSelector((state) => state.internInfo);

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

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkedIcon = () => {
    setIsBookmarkedIcon(!isBookmarkedIcon);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Top-level error handling
  if (profileError) {
    return (
      <div className="desktop-profile-container">
        <div className="fallback-message">
          <h2>Something went wrong.</h2>
          <p>
            We encountered an error while fetching the profile. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  // If not loading and no data found, show a fallback
  if (!profileLoading && !profileData) {
    return (
      <div className="desktop-profile-container">
        <div className="fallback-message">
          <h2>Profile Not Found</h2>
          <p>
            We couldn't find any data for this user. Please check back later or
            contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="desktop-profile-container">
      {/* Profile details section */}
      <section id="profile-details-section">
        <div className="profile-details">
          <div className="profile-details-wrap">
            {/* Profile image and basic info */}
            <div className="profile-details-first-wrap">
              {Editable && (
                <button onClick={handleEdit} className="edit-btn">
                  <MdEdit />
                </button>
              )}

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
                      src={
                        profileData?.photo_url ||
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={
                        profileData?.firstName ||
                        profileData?.display_name ||
                        "User"
                      }
                      width={150}
                      height={150}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=No+Image")
                      }
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
                      sx={{
                        fontSize: "1.2rem",
                        width: "150px",
                        height: "30px",
                      }}
                    />
                  ) : (
                    <h4 style={{ marginTop: "10px" }}>
                      {profileData?.firstName || "First"}{" "}
                      {profileData?.lastName || "Last"}
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
                      {profileData?.city || "City not available"},{" "}
                      {profileData?.state || "State not available"}
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
                    <span>
                      Year of Experience:{" "}
                      {profileData?.experience || "Not provided"}
                    </span>
                  )}

                  {/* Profile Type */}
                  {profileLoading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ fontSize: "1rem", width: "100px", height: "20px" }}
                    />
                  ) : (
                    <p className="badge-type">
                      {profileData?.type || "No Type Available"}
                    </p>
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
                {profileData?.skillSet && profileData.skillSet.length > 0 ? (
                  profileData.skillSet.map((item) => {
                    const ratingPercentage =
                      (parseInt(item.skillRating) / 5) * 100;
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
                                backgroundColor: "#009DED",
                                height: "5px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="fallback-message">
                    No skills available at the moment.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>


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
          {profileData?.skillSet?.map((item) => {
            // Convert rating (1 to 5) into percentage
            const ratingPercentage = (parseInt(item.skillRating) / 5) * 100;

            return (
              <div className="skill-bar-card" key={item.skill}>
                <span>{item.skill}</span>

      <section className="acadmic-section-container">
        {profileLoading ? (
          <Skeleton
            animation="pulse"
            variant="rectangular"
            sx={{ width: "100%", height: "100px", borderRadius: "20px" }}
          />
        ) : (
          profileData?.type !== "Intern" && (
            <div
              className="consulting-container"
              style={{ marginBottom: "20px" }}
            >
              <div className="consulting-btn-container">

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span className="service-name">Consulting Now</span>
                  <div className="issue-badge">
                    {professionBadges.length > 0 ? (
                      professionBadges.map((badge, index) => (
                        <div className="badge" key={index}>
                          {badge}
                        </div>
                      ))
                    ) : (
                      <div className="fallback-message">
                        No specializations available.
                      </div>
                    )}
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
  profileLoading ? (
    <Skeleton
      animation="pulse"
      variant="rectangular"
      sx={{ width: '100%', height: '100px', borderRadius: "20px" }}
    />
  ) : (
    profileData?.type !== 'Intern' && (
      <div className="consulting-container" style={{ marginBottom: '20px' }}>
        <div className="consulting-btn-container">
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <span className="service-name">Consulting Now</span>
        <div className="issue-badge">
  {professionBadges?.map((badge, index) => (
    <div className="badge" key={index}>{badge}</div>
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
      </div>
    )
  )
}

{
  profileLoading ? (
    <Skeleton
      animation="pulse"
      variant="rectangular"
      sx={{ width: '100%', height: '200px', borderRadius: "20px", marginTop: '20px' }}
    />
  ) : (
 (
      <div className="service-container">
        <h4>Service</h4>
        <div className="service-list">
          {profileData?.serviceDetails?.map((item) => (
            <div className="service-item" key={item.serviceName}>
              <span className="service-name">{item.serviceName}</span>
              <p>{item.serviceDescription}</p>
              <div className="price-duration-container">
                <span className="service-duration">
                  <FaClock /> {item?.serviceDuration || 'N/A'} {item?.serviceDurationType || 'N/A'}
=======
                <div className="consulting-btn">
                  <button
                    onClick={() => setInterviewScheduled(true)}
                    className="chat-btn"
                  >
                    <MdChat /> Chat
                  </button>
                  <button
                    onClick={() => setInterviewScheduled(true)}
                    className="chat-btn"
                  >
                    <MdPhone /> Call
                  </button>
                </div>
                <span className="consultant-price">
                  ₹
                  {profileData?.consultingPrice
                    ? profileData.consultingPrice
                    : "N/A"}
                  {"/minute"}

                </span>
              </div>
            </div>
          )
        )}

        {profileLoading ? (
          <Skeleton
            animation="pulse"
            variant="rectangular"
            sx={{
              width: "100%",
              height: "200px",
              borderRadius: "20px",
              marginTop: "20px",
            }}
          />
        ) : (
          <div className="service-container">
            <h4>Service</h4>
            {profileData?.serviceDetails &&
            profileData.serviceDetails.length > 0 ? (
              <div className="service-list">
                {profileData.serviceDetails.map((item) => (
                  <div className="service-item" key={item.serviceName}>
                    <span className="service-name">
                      {item.serviceName || "Unnamed Service"}
                    </span>
                    <p>
                      {item.serviceDescription || "No description provided"}
                    </p>
                    <div className="price-duration-container">
                      <span className="service-duration">
                        <FaClock /> {item?.serviceDuration || "N/A"}{" "}
                        {item?.serviceDurationType || "N/A"}
                      </span>
                      <span className="service-price">
                        ₹{item.servicePrice || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="fallback-message">
                No service details available at the moment.
              </div>
            )}
          </div>
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
            {
              work.endDate === "present" || !work.endDate
  ? "Present"
  : work.endDate.seconds
  ? dayjs.unix(work.endDate.seconds).format("D MMM YYYY")
  : "Not Available"
            }
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

        <div className="single-mentor-third-sec">
          <div className="fifth-decs-sec">
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
                <div
                  className="tab-pane fade show active mt-16"
                  id="course-content"
                  role="tabpanel"
                >
                  {profileData?.workExperience &&
                  profileData.workExperience.length > 0 ? (
                    profileData.workExperience.map((work, index) => (
                      <div
                        className="experience-sec"
                        key={`${work?.role}-${index}`}
                      >
                        <div className="work-logo-container">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/10655/10655913.png"
                            className="educ-logo"
                            alt="Company Logo"
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{work?.role || "Role not specified"}</h4>
                          <p>
                            {work?.companyName || "Company not specified"} |{" "}
                            {work?.startDate
                              ? dayjs
                                  .unix(work.startDate.seconds)
                                  .format("D MMM YYYY")
                              : "Start date N/A"}{" "}
                            -{" "}
                            {work?.endDate === "present" || !work?.endDate
                              ? "Present"
                              : dayjs
                                  .unix(work.endDate.seconds)
                                  .format("D MMM YYYY")}
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
                    ))
                  ) : (
                    <div className="fallback-message">
                      No work experience available.
                    </div>
                  )}
                </div>

                {/* Education Tab */}
                <div
                  className="tab-pane fade"
                  id="education-content"
                  role="tabpanel"
                >
                  {profileData?.educationDetails &&
                  profileData.educationDetails.length > 0 ? (
                    profileData.educationDetails.map((educ, index) => (
                      <div className="experience-sec" key={`educ-${index}`}>
                        <div className="work-logo-container">
                          <img
                            src="https://cdn.vectorstock.com/i/1000v/14/68/education-color-icon-vector-29051468.jpg"
                            className="educ-logo"
                            alt="Education Logo"
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{educ?.degree || "Degree not specified"}</h4>
                          <h6>Stream: {educ?.stream || "N/A"}</h6>
                          <p>{educ?.college || "College not specified"}</p>
                          <p>
                            {educ?.startDate
                              ? dayjs
                                  .unix(educ.startDate.seconds)
                                  .format("D MMM YYYY")
                              : "Start date N/A"}{" "}
                            -{" "}
                            {educ?.endDate === "present" || !educ?.endDate
                              ? "Present"
                              : dayjs
                                  .unix(educ.endDate.seconds)
                                  .format("D MMM YYYY")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="fallback-message">
                      No education details available.
                    </div>
                  )}
                </div>

                {/* Projects Tab */}
                <div
                  className="tab-pane fade"
                  id="projects-content"
                  role="tabpanel"
                >
                  {profileData?.projectDetails &&
                  profileData.projectDetails.length > 0 ? (
                    profileData.projectDetails.map((project, index) => (
                      <div className="experience-sec" key={`project-${index}`}>
                        <div className="work-logo-container">
                          <img
                            src="https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg"
                            className="educ-logo"
                            alt="Project Logo"
                          />
                        </div>
                        <div className="experience-info">
                          <h4>{project?.projectName || "Project not named"}</h4>
                          <div>
                            <b>Tech Stack:</b>{" "}
                            {project?.techstack && project.techstack.length > 0
                              ? project.techstack.map((item, idx) => (
                                  <span key={idx}>
                                    {item}
                                    {idx !== project.techstack.length - 1 &&
                                      ", "}
                                  </span>
                                ))
                              : "No tech stack available"}
                          </div>
                          <div className="desc-view-btn-container">
                            {project?.liveDemo && (
                              <a
                                href={project.liveDemo}
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
                              {project?.description ||
                                "No description available"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="fallback-message">
                      No projects available.
                    </div>
                  )}
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
