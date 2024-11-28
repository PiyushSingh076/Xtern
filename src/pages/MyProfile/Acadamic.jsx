
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Acadamic({ profileData }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a data fetching scenario
    if (profileData) {
      setLoading(false);
    }
  }, [profileData]);

  return (
    <div>
      <div className="single-mentor-third-sec">
        <div className="fifth-decs-sec mt-32">
          <div className="fifth-decs-sec-wrap">
            <ul className="nav nav-pills single-mentor-tab" id="mentor-tab" role="tablist">
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
              {/* Work Experience Tab */}
              <div className="tab-pane fade show active mt-16" id="course-content" role="tabpanel" tabIndex="0">
                {profileData?.linkedInProfile?.experiences?.map((work , index) => {
                 const months = [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                const startDate = work
                  ? `${work?.starts_at?.day || ""} ${months[work?.starts_at?.month - 1] || ""} ${work?.starts_at?.year || ""}`.trim()
                  : "Date not available";
                 
                  return (
                    <div className="experience-sec" key={index}>
                      <div className="mob-work-logo-container">
                        <img src={work.logo} className="educ-logo" />
                      </div>
                      <div className="experience-info">
                        <h4>{work.title}</h4>
                        <p>{work.company} | {startDate}</p>
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
                          style={{ marginTop: '10px' }}
                          id={`work-collapse-${index}`}
                          className="collapse"
                          aria-labelledby={`work-collapse-${index}`}
                        >
                          <div className="card card-body">
                            {work.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Education Tab */}
              <div className="tab-pane fade" id="student-content" role="tabpanel" tabIndex="0">
                {profileData?.educationDetails?.map((educ) => (
                  <div className="experience-sec" key={educ.collegename + educ.degree}>
                    <div className="mob-work-logo-container">
                      <img src={educ.logo} className="educ-logo" />
                    </div>
                    <div className="experience-info">
                      <h4>{educ.degree}</h4>
                      <h6>Stream: ({educ.branch})</h6>
                      <p>{educ.collegename}</p>
                      <p>Batch: {educ.startyear} - {educ.endyear}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects Tab */}
              <div className="tab-pane fade" id="reviews-content" role="tabpanel" tabIndex="0">
                {profileData?.projectDetails?.map((project,index) => (
                  <div className="experience-sec" key={index}>
                    <div className="mob-work-logo-container">
                      <img src={project.logo} className="educ-logo" />
                    </div>
                    <div className="experience-info">
                      <h4>{project.projectname}</h4>
                      <div style={{ marginTop: '5px' }}>
                        <span><b>Tech Stack:</b> {project.techstack.join(' | ')}</span>
                      </div>
                      <button
                        className="desc-btn"
                        data-bs-toggle="collapse"
                        data-bs-target={`#project-collapse-${index}`}
                        aria-expanded="false"
                        aria-controls={`project-collapse-${index}`}
                      >
                        View Description
                      </button>
                      <Link to={project.link} className="link-btn">
                        Live Link
                      </Link>
                      <div
                        style={{ marginTop: '10px' }}
                        id={`project-collapse-${index}`}
                        className="collapse"
                        aria-labelledby={`project-collapse-${index}`}
                      >
                        <div className="card card-body">
                          {project.description}
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
    </div>
  );
}
