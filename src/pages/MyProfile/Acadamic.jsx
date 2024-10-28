
import React, { useState } from "react";


export default function Acadamic() {
  return (
    <div>
        <div className="single-mentor-third-sec">
                            <div className="fifth-decs-sec mt-32">
                                <div className="fifth-decs-sec-wrap">
                                    {/* Tab navigation */}
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
                                    {/* Tab content */}
                                    <div className="tab-content" id="course-tab-btn">
                                        {/* Work Experience tab */}
                                        <div
                                            className="tab-pane fade show active mt-16"
                                            id="course-content"
                                            role="tabpanel"
                                            tabIndex="0"
                                        >
                                            <div className="experience-sec">
                                                <h4>Software Developer Intern</h4>
                                                <p>TechCorp Inc. | June 2022 - August 2022</p>
                                                <ul>
                        
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-content" id="student-tabContent">
                                        {/* Education tab */}
                                        <div
                                            className="tab-pane fade show"
                                            id="student-content"
                                            role="tabpanel"
                                            tabIndex="0"
                                        >
                                            <div className="experience-sec">
                                                <h4>B.E(Computer Science)</h4>
                                                <p>Chandigarh University </p>
                                                <p> Expected Graduation: May 2024</p>
                                                <span>CGPA: 8.5</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-content" id="review-tabContent">
                                        {/* Projects tab */}
                                        <div
                                            className="tab-pane fade show"
                                            id="reviews-content"
                                            role="tabpanel"
                                            tabIndex="0"
                                            aria-labelledby="reviews-tab-btn"
                                        >
                                            <div className="experience-sec">
                                                <h4>E-commerce Website</h4>
                                                <p>Developed a full-stack e-commerce website using MERN stack</p>
                                            </div>

                                            <div className="experience-sec">
                                                <h4>Social Media App</h4>
                                                <p>Developed a social media app using React and Firebase</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    </div>
  )
}
