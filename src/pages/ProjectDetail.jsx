import React, { useEffect, useState } from "react";
import BookmarkSvg from "../assets/svg/white-bookmark.svg";
import PlayIcon from "../assets/images/single-courses/play-icon.svg";
import HeaderImg from "../assets/images/single-courses/header-img.png";
import FillStar from "../assets/images/single-courses/orange-fill-star.svg";
import StudentIcon from "../assets/images/single-courses/student-icon.svg";
import TimeIcon from "../assets/images/single-courses/time-icon.svg";
import LockIconSvg from "../assets/images/single-courses/lock-icon.svg";
import DisableLockSvg from "../assets/images/single-courses/disable-lock.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import useFetchProjectData from "../hooks/Auth/useFetchProjectData";
const ProjectDetails = () => {
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isBookmarkIcon, setIsBookmarkIcon] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { projectData, loading, error } = useFetchProjectData(projectId);

  if (error) return <p>Error: {error.message}</p>;

  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page in the history stack
  };
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkIcon = () => {
    setIsBookmarkIcon(!isBookmarkIcon);
  };
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: true,
    infinite: true,
    variableWidth: true,
    autoplaySpeed: 2000,
    dots: false,
    arrows: false,
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
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
              <p>Project Details</p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>
      {/* <!-- Single description section start --> */}
      <section id="single-description-screen">
        <div className="first-desc-img-sec">
          <div className="hero-img-desc">
            <div className="d-flex justify-content-center">
              <img
                src={projectData?.imageUrl || HeaderImg}
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
          <div className="container">
            <div className="single-courses-description">
              <div className="first-decs-sec mt-16">
                <div className="first-decs-sec-wrap">
                  <div className="skills-left-sec">
                    <div className="first-left-sec">
                      <div> {projectData?.skill || "Design"}</div>
                    </div>
                    <div className="first-left-sec">
                      <div> {projectData?.skill || "UI/UX"}</div>
                    </div>
                    <div className="first-left-sec">
                      <div> {projectData?.skill || "Figma"}</div>
                    </div>
                  </div>

                  <div className="first-right-sec">
                    <div>
                      <span className="firs-txt1 mr-8">$199.00</span>
                      <span className="firs-txt2">$149.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="second-decs-sec mt-16">
                <div className="second-decs-sec-wrap">
                  <div className="second-decs-sec-top">
                    <h1 className="second-txt1">
                      {projectData?.title ||
                        " Responsive Design with Grids. A Guide for UX/UI Designer"}
                    </h1>
                  </div>
                  <div className="second-decs-sec-bottom">
                    <div className="second-decs-sec-bottom-wrap">
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <img src={StudentIcon} alt="student-icon" />
                        </span>
                        <span className="second-txt2">104.2k Application</span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8 fillStar">
                          <img src={FillStar} alt="student-icon" />
                        </span>
                        {/* <span className="second-txt2">4.3 (3.7k ratings)</span> */}
                        <span className="second-txt2">Level: Medium</span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <img src={TimeIcon} alt="student-icon" />
                        </span>
                        <span className="second-txt2">41h 30m</span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <img src={TimeIcon} alt="student-icon" />
                        </span>
                        <span className="second-txt2">Due: 25-09-2024</span>
                      </div>
                      {/* <div className="mt-12">
                        <span className="student-img mr-8">
                          <img src={LanguageIcon} alt="student-icon" />
                        </span>
                        <span className="second-txt2">English</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="third-decs-sec mt-32">
                <div className="third-decs-sec-wrap">
                  {/* <div className="third-decs-sec-top">
                    <h2 className="third-txt1">This Course Includes</h2>
                  </div> */}
                  {/* <div className="third-decs-sec-bottom">
                    <div className="third-decs-sec-bottom-wrap mt-16">
                      <span className="third-txt2 mr-8">
                        <img src={CourseIconImg1} alt="course-img" />
                      </span>
                      <span className="third-txt3">
                        1.5 hours On-Demand Video
                      </span>
                    </div>
                    <div className="third-decs-sec-bottom-wrap mt-12">
                      <span className="third-txt2 mr-8">
                        <img src={CourseIconImg2} alt="course-img" />
                      </span>
                      <span className="third-txt3">Full Lifetime Access</span>
                    </div>
                    <div className="third-decs-sec-bottom-wrap mt-12">
                      <span className="third-txt2 mr-8">
                        <img src={CourseIconImg3} alt="course-img" />
                      </span>
                      <span className="third-txt3">
                        Access on Mobile, Desktop and TV
                      </span>
                    </div>
                    <div className="third-decs-sec-bottom-wrap mt-12">
                      <span className="third-txt2 mr-8">
                        <img src={CourseIconImg4} alt="course-img" />
                      </span>
                      <span className="third-txt3">
                        Certificate of Completion
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
              {/* <div className="fourth-decs-sec mt-32">
                <div className="fourth-decs-sec-wrap">
                  <h2 className="third-txt1">Mentor</h2>
                  <div className="fourth-decs-sec-top mt-16">
                    <div className="fourth-decs-img-wrap">
                      <div className="fourth-decs-img">
                        <img src={MentorImg} alt="client-img" />
                      </div>
                      <div className="fourth-client-wrap">
                        <h3 className="fourth-txt1">Athena Joy</h3>
                        <h4 className="fourth-txt2 mt-12">236k followerss</h4>
                        <div className="mt-16">
                          <span className="fourth-txt3">
                            <img src={FillStar} alt="star-img" />
                          </span>
                          <span className="fourth-txt4">
                            4.3 (3.7k ratings)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="fourth-follwing-sec">
                      <div className="fourth-txt5">
                        <p>Following</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
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
                    <li className="nav-item" role="presentation">
                      {/* <button
                        className="nav-link"
                        id="reviews-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#reviews-content"
                        type="button"
                        role="tab"
                        aria-selected="false"
                      >
                        Reviews
                      </button> */}
                    </li>
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
                            {projectData?.detail || (
                              <>
                                {" "}
                                <p className="des-con-txt2">
                                  {" "}
                                  In this className, you'll learn everything
                                  about using grids for your UI Design.Grids are
                                  not only your best friend when it comes to
                                  creating a consistent layout. They are also
                                  the backbone when it comes to responsive
                                  design and making your product shine across
                                  all screen sizes.
                                </p>
                                <p className="des-con-txt2">
                                  Besides the classNameic Grids like Bootstrap
                                  and co, I will tell you a bit about my
                                  favorite grid, the CSS Grid, full of
                                  possibilities.
                                </p>
                                <p className="des-con-txt2">
                                  And yes, we will go the extra mile and look at
                                  some basic code, all set up for UX/UI
                                  Designers to really understand the
                                  technicality behind the product you are
                                  building.
                                </p>
                                <p className="des-con-txt2">
                                  The Figma and code template that I will show
                                  you are part of the course material to make
                                  sure you can dive right into the making
                                </p>{" "}
                              </>
                            )}
                          </div>
                        </div>
                        {/* <div className="description-second-content mt-24">
                          <h3 className="des-con-txt1">What You'll Learn</h3>
                          <div className="mt-12">
                            <ul className="desc-learn-sec">
                              <li>
                                Everything about Responsive Grids from 0 to hero
                              </li>
                              <li>
                                Basic setup like Columns, Grutter, Margin, and
                                Rows
                              </li>
                              <li>
                                Understand the difference between responsive and
                                adaptive behaviour
                              </li>
                              <li>
                                Understand what breakpoints are, where they come
                                from and how to use them
                              </li>
                              <li>
                                Classic Grid Systems such as Bootstrap Grids and
                                CSS Grid
                              </li>
                              <li>
                                Setting up Adaptive, Responsive and CSS Grids in
                                FIGMA and adding content the right way
                              </li>
                              <li>
                                Adding content to the grid, avoiding common
                                positioning mistakes
                              </li>
                              <li>How Grids make your design responsive</li>
                              <li>
                                As a final project, we will be building our own
                                responsive portfolio in Figma
                              </li>
                              <li>
                                Go the extra mile and look at some basic code,
                                all set up for UX/UI Designers to really
                                understand the technicality behind the product
                                you are building.
                              </li>
                            </ul>
                          </div>
                        </div> */}
                        {/* <div className="description-second-content mt-24">
                          <h3 className="des-con-txt1">
                            Who This Course is For
                          </h3>
                          <div className="mt-12">
                            <ul className="desc-learn-sec">
                              <li>Beginner and Advanced UX/UI Designer</li>
                              <li>
                                Graphic Designer switching over to UX/UI Design
                              </li>
                              <li>
                                Front-End Developer wanting to improve their
                                communication with the design team
                              </li>
                              <li>
                                Anyone interested in learning about Grids in
                                UX/UI Design
                              </li>
                              <li>
                                Sketch or XD users switching over to Figma
                              </li>
                            </ul>
                          </div>
                        </div> */}
                        {/* <div className="description-second-content mt-24">
                          <h3 className="des-con-txt1">Requirements</h3>
                          <div className="mt-12">
                            <ul className="desc-learn-sec">
                              <li>
                                No requirements but recommended: (Free) Figma
                                account
                              </li>
                              <li>
                                Basic knowledge of Figma (or any other UI Design
                                software)
                              </li>
                            </ul>
                          </div>
                        </div> */}
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

          <div className="buy-now-description">
            <Link to={`/applyproject/${projectId}`}>Apply Now</Link>
          </div>
        </div>
      </section>
      {/* <!-- Single description section end --> */}
      {/* <!-- Video modal start --> */}
      <div
        className="modal"
        id="review-video-modal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <iframe
                src="https://www.youtube.com/embed/1SZle1skb84?si=2wmkzqF3sKhSy3xH"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen=""
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Video modal end --> */}
    </>
  );
};
export default ProjectDetails;
