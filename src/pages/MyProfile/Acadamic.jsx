
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
                    <div
      className="experience-sec"
      key={work?.title + work?.company}
    >
      <div className="work-logo-container">
        <img src={'https://cdn-icons-png.flaticon.com/512/10655/10655913.png'} className="educ-logo" alt="Company Logo" />
      </div>
      <div className="experience-info">
        <h4>{work?.title}</h4>
        <p>
          {work?.company} | {startDate}
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

              {/* Education Tab */}
              <div className="tab-pane fade" id="student-content" role="tabpanel" tabIndex="0">
                {profileData?.linkedInProfile?.education?.map((educ , index) => (
                      <div className="experience-sec" key={index}>
                      <div className="work-logo-container">
                        <img src={'https://cdn.vectorstock.com/i/1000v/14/68/education-color-icon-vector-29051468.jpg'} className="educ-logo" />
                      </div>
                      <div className="experience-info">
                        <h4>{educ.degree_name}</h4>
                        <h6>Stream: ({educ.field_of_study})</h6>
                        <p>{educ.school}</p>
                        <p>
                          Batch: {educ.starts_at?.year} - {educ.ends_at?.year}
                        </p>
                      </div>
                    </div>
                ))}
              </div>

              {/* Projects Tab */}
              <div className="tab-pane fade" id="reviews-content" role="tabpanel" tabIndex="0">
                {profileData?.linkedInProfile?.accomplishment_projects?.map((project,index) => (
                 <div className="experience-sec" key={index}>
                 <div className="work-logo-container">
                   <img src={'https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg'} className="educ-logo" />
                 </div>
                 <div className="experience-info">
                   <h4>{project.title}</h4>

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
          </div>
        </div>
      </div>
    </div>
  );
}
