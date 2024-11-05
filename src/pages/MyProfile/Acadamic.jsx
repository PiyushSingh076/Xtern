
import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function Acadamic({profileData}) {
  return (
    <div>
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
                  {profileData?.workExperience.map((work , index) => {

  const startDate = new Date(work.startdate.seconds * 1000);

  const startDateFormatted = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="experience-sec" key={work.role + work.companyname}>
    <img src={work.logo} className="educ-logo" width={'100px'} height={'100px'}/>
   <div className="experience-info">
   <h4>{work.role}</h4>
      <p>{work.companyname} | {startDateFormatted}</p>

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
    style={{marginTop: '10px'}}
      id={`collapse-${index}`} 
      className="collapse" 
      aria-labelledby={`collapse-${index}`}
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
                  </div>
                  <div className="tab-content" id="student-tabContent">
                    <div
                      className="tab-pane fade show"
                      id="student-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                   {profileData?.educationDetails.map((educ)=> (  <div className="experience-sec">
                     <img src={educ?.logo} width={'100px'} className="educ-logo"/>
                      <div className="experience-info">
                      <h4>{educ.degree}</h4>
                        <h6>Stream: ({educ.branch})</h6>
                        <p>{educ.collegename} </p>
                        <p> Batch: {educ.startyear} - {educ.endyear}</p>
                      </div>
                        {/* <span> cgpa </span> */}
                      </div>))}
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
     <img src={project?.logo} width={'100px'} height={'100px'} className="educ-logo"/>
  <div className="experience-info">
  <h4>{project.projectname}</h4>

<div style={{ marginTop: '5px' }}>
  <span><b>Tech Stack:</b> {project.techstack.map((item) => (<span key={item}> {item} |</span>))}</span>
</div>

<div className="desc-view-btn-container">
<button 
  className="desc-btn" 
  data-bs-toggle="collapse" 
  data-bs-target={`#collapse-${index}`}
  aria-expanded="false" 
  aria-controls={`collapse-${index}`}
>
  View Description
</button>

<Link
to={project.link}
className="link-btn" 
>
  Live Link
</Link>
  </div>

<div 
style={{marginTop: '10px'}}
  id={`collapse-${index}`} 
  className="collapse" 
  aria-labelledby={`collapse-${index}`}
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
  )
}
