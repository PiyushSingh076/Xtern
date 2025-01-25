import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchInternshipData from "../hooks/Auth/useFetchInternshipData";
import useFetchUserData from "../hooks/Auth/useFetchUserData";
import BookmarkSvg from "../assets/svg/white-bookmark.svg";
import PlayIcon from "../assets/images/single-courses/play-icon.svg";
import HeaderImg from "../assets/images/single-courses/header-img.png";
import FillStar from "../assets/images/single-courses/orange-fill-star.svg";
import StudentIcon from "../assets/images/single-courses/student-icon.svg";
import TimeIcon from "../assets/images/single-courses/time-icon.svg";
import LockIconSvg from "../assets/images/single-courses/lock-icon.svg";
import DisableLockSvg from "../assets/images/single-courses/disable-lock.svg";
import Loading from "../components/Loading";
const SingleJobDescription = () => {
  const [isBookmarked, setIsBookmarked] = useState(true);

  const navigate = useNavigate();
  const { userData } = useFetchUserData();
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  console.log(userData, "dsdfsdf");
  const { internshipId } = useParams();
  const { internshipData, loading, error } =
    useFetchInternshipData(internshipId);
  const [activeTab, setActiveTab] = useState("description");
  const handleBackClick = () => {
    navigate(-1);
  };
  console.log(internshipData, "lllllll");
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-danger text-center">
        Error loading internship details
      </div>
    );
  }

  if (!internshipData) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <>
      {/* <!-- Header start --> */}
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn" onClick={handleBackClick}>
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
            </div>
            <div className="top-navbar-title">
              <p>Internship Details</p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>
      {/* <!-- Header end --> */}

      <section id="single-description-screen">
        <div className="first-desc-img-sec">
          <div className="hero-img-desc">
            <div className="d-flex justify-content-center">
              <img
                src={internshipData?.image || HeaderImg}
                alt="social-media-img"
                height="350"
                width="350"
                className="img-fluid"
              />
            </div>

            <div className="single-courses-top">
              <div className="course-back-icon">
                <svg
                  onClick={handleBackClick}
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
                    <rect width="24" height="24" fill="black" />
                  </mask>
                  <g mask="url(#mask0_330_7385)">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <div className="single-courses-bookmark-icon">
                <a
                  href=""
                  className={`item-bookmark ${isBookmarked ? "active" : ""}`}
                  onClick={toggleBookmark}
                  tabIndex="0"
                >
                  <img src={BookmarkSvg} alt="bookmark-icon" />
                </a>
              </div>
            </div>
            <div className="cousr-play-btn">
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#review-video-modal"
              >
                <img src={PlayIcon} alt="play-icon" />
              </a>
            </div>
          </div>
          <div className="container !min-w-0">
            <div className="single-courses-description">
              <div className="first-decs-sec mt-16">
                <div className="first-decs-sec-wrap">
                  <div className="skills-left-sec">
                    <div className="first-left-sec">
                      <div> {internshipData?.skills[0]} </div>
                    </div>
                    <div className="first-left-sec">
                      <div> {internshipData?.skills[1]} </div>
                    </div>
                    <div className="first-left-sec">
                      <div> {internshipData?.skills[2]} </div>
                    </div>
                  </div>
                  {/* <div className="skills-left-sec">
                    {internshipData?.skills?.map((skill, index) => {
                      <div className="first-left-sec">
                        <div> {skill || "UI/UX"}</div>
                      </div>;
                    })}
                  </div> */}

                  <div className="first-right-sec">
                    <div>
                      {/* <span className="firs-txt1 mr-8">$199.00</span>
                      <span className="firs-txt2">$149.00</span> */}
                      {internshipData?.companyName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="second-decs-sec mt-16">
                <div className="second-decs-sec-wrap">
                  <div className="second-decs-sec-top">
                    <h1 className="second-txt1">
                      {internshipData?.title ||
                        " Responsive Design with Grids. A Guide for UX/UI Designer"}
                    </h1>
                  </div>

                  <div className="second-decs-sec-bottom">
                    <div className="second-decs-sec-bottom-wrap">
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <img src={StudentIcon} alt="student-icon" />
                        </span>
                        <span className="second-txt2">04 Application</span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8 fillStar">
                          <img src={FillStar} alt="student-icon" />
                        </span>
                        {/* <span className="second-txt2">4.3 (3.7k ratings)</span> */}
                        <span className="second-txt2">
                          {internshipData?.location}
                        </span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <img src={TimeIcon} alt="student-icon" />
                        </span>
                        <span className="second-txt2">
                          Assessment:{" "}
                          {internshipData?.assessmentDuration || "Not Mention"}
                        </span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <img src={TimeIcon} alt="student-icon" />
                        </span>
                        <span className="second-txt2">
                          Duration: {internshipData.duration || "Not Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="third-decs-sec mt-32">
                <div className="third-decs-sec-wrap"></div>
              </div>

              <div className="fifth-decs-sec mt-32">
                <div className="fifth-decs-sec-wrap">
                  <ul
                    className="nav nav-pills single-courses-tab"
                    id="description-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="description-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#description-content"
                        type="button"
                        role="tab"
                        aria-selected="true"
                      >
                        Description
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="lessons-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#lesson-content"
                        type="button"
                        role="tab"
                        aria-selected="false"
                      >
                        Assessment
                      </button>
                    </li>
                    <li className="nav-item" role="presentation"></li>
                  </ul>
                  <div className="tab-content" id="description-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="description-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      <div className="description-content-wrap mt-24">
                        <div className="description-first-content">
                          <h3 className="des-con-txt1">Details</h3>
                          <div>
                            {internshipData?.description || "NO Detail"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content" id="lessons-tabContent">
                    <div
                      className="tab-pane fade show"
                      id="lesson-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      <div className="lesson-content-wrap mt-24">
                        <div className="lesson-first-content">
                          <div className="lesson-first-content-top">
                            <div className="lesson-first-content-wrap">
                              <div className="lesson-course">
                                <h3 className="des-con-txt1">Course content</h3>
                              </div>
                              <div className="lesson-expand">
                                <p className="lesson-txt1">Expand Sections</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="lesson-second-content">
                          <div className="lesson-second-content-bottom">
                            <div className="accordion" id="lesson-introduction">
                              <div className="accordion-item mt-16">
                                <h2
                                  className="accordion-header"
                                  id="lesson-title1"
                                >
                                  <button
                                    className="accordion-button lesson-custom-btn"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse1"
                                    aria-expanded="true"
                                  >
                                    <span className="lesson-title">
                                      Introduction
                                    </span>
                                    <span className="lesson-custom-time">
                                      5 min
                                    </span>
                                  </button>
                                </h2>
                                <div
                                  id="collapse1"
                                  className="accordion-collapse collapse show"
                                  data-bs-parent="#lesson-introduction"
                                >
                                  <div className="accordion-body">
                                    <div className="lesson-intro-content mt-12">
                                      <div className="lesson-intro-content-wrap">
                                        <span className="lesson-txt2">
                                          Promotion
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2">
                                          Introduction
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2 color-grey">
                                          Course Material
                                        </span>
                                        <span className="lesson-lock-img color-grey">
                                          <img
                                            src={DisableLockSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion-item mt-16">
                                <h2
                                  className="accordion-header"
                                  id="lesson-title2"
                                >
                                  <button
                                    className="accordion-button lesson-custom-btn"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse2"
                                    aria-expanded="true"
                                  >
                                    <span className="lesson-title">
                                      How Grids Work
                                    </span>
                                    <span className="lesson-custom-time">
                                      21 min
                                    </span>
                                  </button>
                                </h2>
                                <div
                                  id="collapse2"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#lesson-introduction"
                                >
                                  <div className="accordion-body">
                                    <div className="lesson-intro-content mt-12">
                                      <div className="lesson-intro-content-wrap">
                                        <span className="lesson-txt2">
                                          Promotion
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2">
                                          Introduction
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2 color-grey">
                                          Course Material
                                        </span>
                                        <span className="lesson-lock-img color-grey">
                                          <img
                                            src={DisableLockSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="buy-now-description text-center mt-4">
            {userData?.typeUser === "Intern " ? (
              <Link
                to={`/applyinternship/${internshipId}`}
                className="btn btn-primary btn-lg"
              >
                Apply Now
              </Link>
            ) : (
              <Link
                to={`/applicants/${internshipId}`}
                className="btn btn-primary btn-lg"
              >
                Applicants
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* <div className="container mt-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4">
            <div className="card h-100 shadow-sm">
              {internshipData?.image && (
                <img
                  src={internshipData?.image}
                  className="card-img-top"
                  alt={internshipData?.companyName}
                  style={{ height: "250px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{internshipData?.companyName}</h5>
                <p className="card-text">
                  <strong>Location:</strong> {internshipData?.location}
                </p>
                <p className="card-text">
                  <strong>Duration:</strong>{" "}
                  {internshipData?.assessmentDuration}
                </p>

                <ul
                  className="nav nav-pills single-courses-tab"
                  id="description-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="description-tab-btn"
                      data-bs-toggle="pill"
                      data-bs-target="#description-content"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Description
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="assessment-tab-btn"
                      data-bs-toggle="pill"
                      data-bs-target="#assessment-content"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      Assessment
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  <div
                    className="tab-pane fade show active"
                    id="description-content"
                    role="tabpanel"
                    aria-labelledby="description-tab-btn"
                  >
                    <p className="card-text">{internshipData?.description}</p>
                    <div className="mb-3">
                      <h6 style={{ fontWeight: "bold" }}>Required Skills:</h6>
                      <ul className="list-inline">
                        {internshipData?.skills?.map((skill, index) => (
                          <li
                            key={index}
                            className="list-inline-item badge bg-secondary"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="assessment-content"
                    role="tabpanel"
                    aria-labelledby="assessment-tab-btn"
                  >
                    <h6>Assessment Details:</h6>
                    <p>{internshipData?.assessmentDetail}</p>
                    <p>
                      <strong>Assessment Duration:</strong>{" "}
                      {internshipData?.assessmentDuration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="buy-now-description text-center mt-4">
          {userData.typeUser === "Intern " ? (
            <Link
              to={`/applyinternship/${internshipId}`}
              className="btn btn-primary btn-lg"
            >
              Apply Now
            </Link>
          ) : (
            <Link
              to={`/applicants/${internshipId}`}
              className="btn btn-primary btn-lg"
            >
              Applicants
            </Link>
          )}
        </div>
      </div> */}
    </>
  );
};

export default SingleJobDescription;
