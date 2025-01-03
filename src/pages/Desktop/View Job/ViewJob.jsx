import React from "react";

const ViewJob = () => {
  return (
    <div id="view-job-container">
      <div id="job-stats-details" className="job-stats-card">
        <div id="job-stats-logo">
          <img src={jobDetails.logo} alt="" />
          <img id="job-stats-banner" src={jobDetails.banner} alt="" />
        </div>
        <h4>{jobDetails.title}</h4>
        <h5>
          {jobDetails.company}, {jobDetails.city}
        </h5>
        <div id="job-stats-description">{jobDetails.description}</div>
        <h5>Skills:</h5>
        <div id="job-stats-skills">
          {jobDetails.skills.map((skill, index) => {
            return (
              <Chip label={skill} key={index + skill + "job-stat-skill"}></Chip>
            );
          })}
        </div>

        <div id="job-stats-controls">
          <Button
            variant="contained"
            sx={{
              borderRadius: "10px",
              padding: "10px",
              backgroundColor: "#FF6D6DFF",
            }}
          >
            Delete Posting
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: "10px", padding: "10px" }}
          >
            Edit Posting
          </Button>
          <div id="job-stats-applicants">
            Applicants: {jobDetails.applicants}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJob;
