import React from "react";
import { Link } from "react-router-dom";
import TimeIcon from "../assets/images/checkout-screen/time-icon.svg";
import useFetchUserJobs from "../hooks/Auth/useFetchUserJobs";
import useFetchUserProjects from "../hooks/Auth/useFetchUserProjects";
import Loading from "../components/Loading";

const CourseOngoingScreen = () => {
  const { jobs, loading, error } = useFetchUserJobs(); // For jobs
  const { projects, projectLoading, projectError } = useFetchUserProjects(); // For projects

  if (loading || projectLoading) {
    return <Loading />; // Or a proper loading spinner
  }

  if (error || projectError) {
    return <div>Error: {error || projectError}</div>;
  }

  return (
    <>
      {/* <!-- Header start --> */}
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn">
              <a href="#offcanvasExample" data-bs-toggle="offcanvas">
                {/* Your SVG back button here */}
              </a>
            </div>
            <div className="top-navbar-title">
              <p>My Posts</p>
            </div>
            <div className="skip-btn-goal">
              <Link to="/notification">
                {/* Your Notification button SVG here */}
              </Link>
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      {/* <!-- Course ongoing screen start --> */}
      <section id="ongoing-section">
        <div className="container">
          <h1 className="d-none">Course</h1>
          <div className="ongoing-section-wrap mt-32">
            <ul
              className="nav nav-pills ongoing-courses-tab"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  Jobs
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                >
                  Projects
                </button>
              </li>
            </ul>

            <div className="tab-content" id="pills-tabContent">
              {/* Jobs Tab */}
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabIndex="0"
              >
                <div className="ongoing-section-details mt-16">
                  {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <Link
                        to={`/internship/${job.id}`}
                        className={`checkout-screen-top ${
                          index === 0 ? "mt-32" : "mt-16"
                        }`}
                        key={index}
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
                                <img src={TimeIcon} alt="star-img" />
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

                  <div
                    className="position-fixed mb-5"
                    style={{ bottom: "10%", left: "920px" }}
                  >
                    <Link to="/createjob" className="btn btn-primary">
                      Add Job
                    </Link>
                  </div>
                </div>
              </div>

              {/* Projects Tab */}
              <div
                className="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
                tabIndex="0"
              >
                <div className="Completed-section-details mt-16">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <Link
                        to={`/project/${project.id}`}
                        className={`checkout-screen-top ${
                          index === 0 ? "mt-32" : "mt-16"
                        }`}
                        key={index}
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
                              <div className="check-txt1">$170.00</div>
                            </div>
                          </div>
                          <div className="checkout-second-fourth">
                            <div className="bookmark-rating">
                              <div className="bookmark-star">
                                <img src={TimeIcon} alt="star-img" />
                              </div>
                              <div className="check-txt5 ps-1">
                                Level: {project?.level}
                              </div>
                            </div>
                          </div>

                          {/* <div className="gap-2 d-flex mt-4">
                            {project?.skills?.map((skill, idx) => (
                              <div key={idx} className="checkout-design">
                                <p> {skill}</p>
                              </div>
                            ))}
                          </div> */}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p>No projects posted yet</p>
                  )}

                  <div
                    className="position-fixed mb-5"
                    style={{ bottom: "10%", left: "920px" }}
                  >
                    <Link className="btn btn-primary" to="/createproject">
                      Add Project
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseOngoingScreen;
