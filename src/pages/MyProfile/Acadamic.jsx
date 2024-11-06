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
                {profileData?.workExperience?.map((work) => {
                  const startDate = new Date(work.startdate.seconds * 1000);
                  const startDateFormatted = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                  return (
                    <div className="experience-sec" key={work.role + work.companyname}>
                      <img src={work.logo} alt={`${work.companyname} logo`} className="educ-logo" style={{ width: '30%', height: '30%' }} />
                      <div className="experience-info">
                        <h4>{work.role}</h4>
                        <p>{work.companyname} | {startDateFormatted}</p>
                        <button 
                          className="desc-btn" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#work-collapse-${work.role}-${work.companyname}`}
                          aria-expanded="false" 
                          aria-controls={`work-collapse-${work.role}-${work.companyname}`}
                        >
                          View Description
                        </button>
                        <div 
                          style={{ marginTop: '10px' }}
                          id={`work-collapse-${work.role}-${work.companyname}`} 
                          className="collapse" 
                          aria-labelledby={`work-collapse-${work.role}-${work.companyname}`}
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
                    <img src={educ?.logo} alt={`${educ.collegename} logo`} width={'30%'} height={'30%'} className="educ-logo" />
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
                {profileData?.projectDetails?.map((project) => (
                  <div className="experience-sec" key={project.projectname}>
                    <img src={project?.logo} alt={`${project.projectname} logo`} width={'100px'} height={'50px'} className="educ-logo" />
                    <div className="experience-info">
                      <h4>{project.projectname}</h4>
                      <div style={{ marginTop: '5px' }}>
                        <span><b>Tech Stack:</b> {project.techstack.join(' | ')}</span>
                      </div>
                      <button 
                        className="desc-btn" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#project-collapse-${project.projectname}`}
                        aria-expanded="false" 
                        aria-controls={`project-collapse-${project.projectname}`}
                      >
                        View Description
                      </button>
                      <Link to={project.link} className="link-btn">
                        Live Link
                      </Link>
                      <div 
                        style={{ marginTop: '10px' }}
                        id={`project-collapse-${project.projectname}`} 
                        className="collapse" 
                        aria-labelledby={`project-collapse-${project.projectname}`}
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
