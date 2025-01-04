// src/Components/Profile/Acadamic.js

import React, { useState, useEffect } from "react";
import { FaRegFolderOpen } from "react-icons/fa";
import { Tooltip, Button } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";

export default function Acadamic({ profileData }) {
  const [loading, setLoading] = useState(true);
  const [workOpen, setWorkOpen] = useState({});
  const [projectOpen, setProjectOpen] = useState({});
  const [educationOpen, setEducationOpen] = useState({});

  useEffect(() => {
    if (profileData) {
      setLoading(false);
    }
  }, [profileData]);

  const toggleWorkDesc = (index) =>
    setWorkOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleProjectDesc = (index) =>
    setProjectOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleEducationDesc = (index) =>
    setEducationOpen((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div>
      <div className="single-mentor-third-sec">
        <div className="fifth-decs-sec mt-32">
          <div className="fifth-decs-sec-wrap">
            <ul className="nav nav-pills single-mentor-tab" style={styles.navPills}>
              <li className="nav-item">
                <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#work-content">
                  Work Experience
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#education-content">
                  Education
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link" data-bs-toggle="pill" data-bs-target="#projects-content">
                  Projects
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {/* Work Experience Tab */}
              <div className="tab-pane fade show active" id="work-content">
                {loading ? (
                  <Skeleton variant="rounded" width="100%" height="200px" style={{ marginTop: "20px" }} />
                ) : profileData?.workExperience?.length ? (
                  profileData.workExperience.map((work, index) => (
                    <div key={index} style={styles.experienceSec}>
                      <div style={styles.logoContainer}>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/10655/10655913.png"
                          alt="Company Logo"
                          style={styles.logo}
                          onError={(e) => (e.target.src = "/default-work-logo.png")}
                        />
                      </div>
                      <div style={styles.infoContainer}>
                        <h4>{work?.role || "Role Not Available"}</h4>
                        <p>
                          {work?.companyName || "Company Not Available"} | {formatDate(work?.startDate)} -{" "}
                          {formatDate(work?.endDate)}
                        </p>
                        <Tooltip title={work.description || "No description available"} arrow>
                          <Button onClick={() => toggleWorkDesc(index)} style={styles.descButton}>
                            {workOpen[index] ? "Hide Description" : "View Description"}
                          </Button>
                        </Tooltip>
                        {workOpen[index] && <div style={styles.description}>{work?.description || "No description available"}</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.noDataContainer}>
                    <FaRegFolderOpen size={50} color="#ccc" />
                    <p>No work experience found</p>
                  </div>
                )}
              </div>

              {/* Education Tab */}
              <div className="tab-pane fade" id="education-content">
                {loading ? (
                  <Skeleton variant="rounded" width="100%" height="200px" style={{ marginTop: "20px" }} />
                ) : profileData?.educationDetails?.length ? (
                  profileData.educationDetails.map((educ, index) => (
                    <div key={index} style={styles.experienceSec}>
                      <div style={styles.logoContainer}>
                        <img
                          src="https://cdn.vectorstock.com/i/1000x1000/14/68/education-color-icon-vector-29051468.jpg"
                          alt="Education Logo"
                          style={styles.logo}
                          onError={(e) => (e.target.src = "/default-education-logo.png")}
                        />
                      </div>
                      <div style={styles.infoContainer}>
                        <h4>{educ?.degree || "Degree Not Available"}</h4>
                        <h6>Stream: {educ?.stream || "Stream Not Available"}</h6>
                        <p>{educ?.collegename || "College Not Available"}</p>
                        <p>
                          {formatDate(educ?.startyear)} - {formatDate(educ?.endyear)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.noDataContainer}>
                    <FaRegFolderOpen size={50} color="#ccc" />
                    <p>No education details found</p>
                  </div>
                )}
              </div>

              {/* Projects Tab */}
              <div className="tab-pane fade" id="projects-content">
                {loading ? (
                  <Skeleton variant="rounded" width="100%" height="200px" style={{ marginTop: "20px" }} />
                ) : profileData?.projectDetails?.length ? (
                  profileData.projectDetails.map((project, index) => (
                    <div key={index} style={styles.experienceSec}>
                      <div style={styles.logoContainer}>
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/027/269/443/original/color-icon-for-project-vector.jpg"
                          alt="Project Logo"
                          style={styles.logo}
                          onError={(e) => (e.target.src = "/default-project-logo.png")}
                        />
                      </div>
                      <div style={styles.infoContainer}>
                        <h4>{project?.projectName || "Project Not Available"}</h4>
                        {project?.duration && <h6>{project?.duration}</h6>}
                        {project?.techstack && (
                          <div>
                            <b>Tech Stack:</b>{" "}
                            {project.techstack.map((tech, idx) => (
                              <span key={idx}>
                                {tech}
                                {idx !== project.techstack.length - 1 && ", "}
                              </span>
                            ))}
                          </div>
                        )}
                        <Tooltip title={project.description || "No description available"} arrow>
                          <Button onClick={() => toggleProjectDesc(index)} style={styles.descButton}>
                            {projectOpen[index] ? "Hide Description" : "View Description"}
                          </Button>
                        </Tooltip>
                        {projectOpen[index] && (
                          <div style={styles.description}>{project?.description || "No description available"}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.noDataContainer}>
                    <FaRegFolderOpen size={50} color="#ccc" />
                    <p>No projects found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function for date formatting
function formatDate(value) {
  if (!value) return "N/A";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("D MMM YYYY") : "Invalid Date";
}

// Inline styles
const styles = {
  navPills: { justifyContent: "space-around", marginBottom: "20px" },
  experienceSec: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" },
  logoContainer: { alignSelf: "center" },
  logo: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" },
  infoContainer: { width: "100%" },
  descButton: { color: "#007bff", textTransform: "none", fontSize: "0.9rem" },
  description: { marginTop: "10px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px" },
  noDataContainer: { textAlign: "center", marginTop: "20px" },
};
