import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TimeIcon from "../assets/images/checkout-screen/time-icon.svg";
import useFetchUserJobs from "../hooks/Auth/useFetchUserJobs";
import useFetchUserProjects from "../hooks/Auth/useFetchUserProjects";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { ROUTES } from "../constants/routes";

const CourseOngoingScreen = () => {
  const navigate = useNavigate();
  const { jobs, loading, error } = useFetchUserJobs();
  const { projects, loading: projectLoading, error: projectError } = useFetchUserProjects();
  const [activeTab, setActiveTab] = useState("jobs");

  const role = useSelector((state) => state.role);

  useEffect(() => {
    if (role.selectedRole === "intern") {
      setActiveTab("projects");
    } else if (role.selectedRole === "mentor") {
      setActiveTab("courses");
    } else if (role.selectedRole === "venture") {
      setActiveTab("jobs");
    }
  }, [role.selectedRole]);

  

  if (loading || projectLoading) {
    return <Loading />;
  }

  if (error || projectError) {
    return <div>Error: {error || projectError}</div>;
  }

  const handleAddJob = () => {
    navigate(ROUTES.CREATE_JOB);
  };

  const handleAddProject = () => {
    navigate(ROUTES.CREATE_PROJECT);
  };

  const handleAddCourse = () => {
    navigate(ROUTES.SELECT_COURSES_SCREEN);
  };

  return (
    <>
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn">
              <Link to={ROUTES.HOME}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </Link>
            </div>
            <div className="top-navbar-title">
              <p>My Posts</p>
            </div>
            <div className="skip-btn-goal">
              <Link to={ROUTES.NOTIFICATION}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      <section id="ongoing-section">
        <div className="container">
          <div className="ongoing-section-wrap mt-16">
            <ul
              style={{display: "flex", flexDirection: "row", justifyContent: "center"}}
              className="nav nav-pills ongoing-courses-tab"
              id="pills-tab"
              role="tablist"
            >
              {role.selectedRole === "venture" && (
                <li style={{width: "100%"}} className={`nav-item ${loading ? "loading" : ""}`} role="presentation">
                  <button
                    className={`nav-link ${activeTab === "jobs" ? "active" : ""}`}
                    onClick={() => setActiveTab("jobs")}
                  >
                    Jobs
                  </button>
                </li>
              )}
              {role.selectedRole === "intern" && (
                <li 
                style={{width: "100%"}}
                className={`nav-item ${loading ? "loading" : ""}`} role="presentation">
                  <button
                    className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
                    onClick={() => setActiveTab("projects")}
                  >
                    Projects
                  </button>
                </li>
              )}


              {role.selectedRole === "mentor" && (
                <li
                style={{width: "100%"}}
                 className={`nav-item ${loading ? "loading" : ""}`} role="presentation">
                  <button
                    className={`nav-link ${activeTab === "courses" ? "active" : ""}`}
                    onClick={() => setActiveTab("courses")}
                  >
                    Courses
                  </button>
                </li>
              )}
            </ul>

            <div className="tab-content" id="pills-tabContent">
              {/* Jobs Tab */}
              <div
                className={`tab-pane fade ${activeTab === "jobs" ? "show active" : ""}`}
                id="pills-home"
                role="tabpanel"
              >
                <div className="ongoing-section-details mt-16">
                  {jobs && jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <Link
                        to={`${ROUTES.INTERNSHIP}/${job.id}`}
                        className={`checkout-screen-top ${index === 0 ? "mt-32" : "mt-16"}`}
                        key={job.id}
                      >
                        <div className="checkout-first">
                          <img
                            height="128"
                            width="128"
                            src={job?.image}
                            alt="job-image"
                          />
                        </div>
                        <div className="checkout-second">
                          <div className="checkout-second-wrap">
                            <div className="checkout-design">
                              <p>{job?.title}</p>
                            </div>
                            <div className="checkout-bookmark">
                              <div className="checkout-bookmark-sec">
                                <div className="check-txt5">
                                  {job?.duration}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-12">
                            <h1 className="check-txt1">{job?.companyName}</h1>
                          </div>
                          <div className="checkout-second-third mt-12">
                            <div>
                              <span className="check-txt2">
                                {job?.location}
                              </span>
                            </div>
                          </div>
                          <div className="checkout-second-fourth">
                            <div className="bookmark-rating">
                              <div className="bookmark-star">
                                <img src={TimeIcon} alt="time-icon" />
                              </div>
                              <div className="check-txt5 ps-1">
                                Assessment: {job?.assessmentDuration}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p>No jobs posted yet</p>
                  )}
                </div>
              </div>
              {activeTab === "jobs" && (
                <div className="position-fixed mb-5" style={{width: "100%", bottom: "8%", right: "20px"}}>
                  <button className="add-job-btn btn btn-primary" onClick={handleAddJob}>
                    Add Job
                  </button>
                </div>
              )}

              {/* Projects Tab */}
              <div
                className={`tab-pane fade ${activeTab === "projects" ? "show active" : ""}`}
                id="pills-profile"
                role="tabpanel"
              >
                <div className="Completed-section-details mt-16">
                  {projects && projects.length > 0 ? (
                    projects.map((project, index) => (
                      <Link
                        to={`${ROUTES.SINGLE_COURSE_DESCRIPTION}/${project.id}`}
                        className={`checkout-screen-top ${index === 0 ? "mt-32" : "mt-16"}`}
                        key={project.id}
                      >
                        <div className="checkout-first">
                          <img
                            height="128"
                            width="128"
                            src={project?.imageUrl}
                            alt="project-image"
                          />
                        </div>
                        <div className="checkout-second">
                          <div className="checkout-second-wrap">
                            <div className="checkout-design">
                              <p>{project?.title}</p>
                            </div>
                            <div className="checkout-bookmark">
                              <div className="checkout-bookmark-sec">
                                <div className="check-txt5">
                                  {project?.duration}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-12">
                            <h1 className="check-txt1">{project?.domain}</h1>
                          </div>
                          <div className="checkout-second-third mt-12">
                            <div>
                              <span className="check-txt2">
                                Due: {project?.dueDate}
                              </span>
                            </div>
                            <div className="bookmark-time">
                              <div className="check-txt1">${project?.price || '170.00'}</div>
                            </div>
                          </div>
                          <div className="checkout-second-fourth">
                            <div className="bookmark-rating">
                              <div className="bookmark-star">
                                <img src={TimeIcon} alt="time-icon" />
                              </div>
                              <div className="check-txt5 ps-1">
                                Level: {project?.level}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p>No projects posted yet</p>
                  )}
                </div>
              </div>
              {activeTab === "projects" && (
                <div className="position-fixed mb-5" style={{width: "100%", bottom: "8%", right: "20px"}}>
                  <button className="add-job-btn btn btn-primary" onClick={handleAddProject}>
                    Add Project
                  </button>
                </div>
              )}

              {/* Courses Tab */}
              <div
                className={`tab-pane fade ${activeTab === "courses" ? "show active" : ""}`}
                id="pills-courses"
                role="tabpanel"
              >
                <div className="ongoing-courses-content mt-16">
                  <p>No courses available yet</p>
                </div>
                {activeTab === "courses" && (
                <div className="position-fixed mb-5" style={{width: "100%", bottom: "8%", right: "20px"}}>
                  <button className="add-job-btn btn btn-primary" onClick={handleAddCourse}>
                    Add Course
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseOngoingScreen;
