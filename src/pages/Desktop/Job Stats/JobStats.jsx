import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Box,
  Button,
  Chip,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Table,
} from "@mui/material";

import dayjs from "dayjs";
import { useFetchJob } from "../../../hooks/Jobs/useFetchJob";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";
import { Spinner } from "react-bootstrap";

const JobStats = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { jobId } = useParams();
  const { jobData, loading, fetchApplicantDetails } = useFetchJob(jobId);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const openModal = async (applicant) => {
    setLoadingDetails(true)
    const user = await fetchApplicantDetails(applicant.uid);
    setLoadingDetails(false)
    console.log("User", user);  
    console.log("Applicant", applicant);
    setSelectedUser({...applicant, user: user});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSubscribe = () => {
    toast.success("Subscribed to  this Applicant!");
  };

  return (
    <div id="job-stats-container">
      {loading == false && (
        <>
          <div id="job-stats-details" className="job-stats-card">
            <div id="job-stats-logo">
              {/* <img src={jobData.logo} alt="" /> */}
              <img id="job-stats-banner" src={jobData.image} alt="" />
            </div>
            <h4>{jobData.title}</h4>
            <h5>
              {jobData.companyName}, {jobData.location}
            </h5>
            <div id="job-stats-description">{jobData.description}</div>
            <h5>Skills:</h5>
            <div id="job-stats-skills">
              {jobData.skills.map((skill, index) => {
                return (
                  <Chip
                    label={skill}
                    key={index + skill + "job-stat-skill"}
                  ></Chip>
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
                Applicants: {jobData.applicants.length}
              </div>
            </div>
          </div>
          <div className="job-stats-card">
            <TableContainer sx={{ height: "100%" }} component={Box}>
              <Table hover='true' stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date Applied</TableCell>

                    <TableCell>Assesment Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobData.applicants.map((applicant, index) => (
                    <TableRow
                      hover="true"
                      sx={{
                        "&:hover": {
                          backgroundColor: "primary.main",
                        },
                      }}
                      key={index}
                    >
                      <TableCell>{applicant.name}</TableCell>
                      <TableCell>
                        {dayjs(new Timestamp(applicant.appliedOn.seconds, applicant.appliedOn.nanoseconds).toDate()).format("MM/DD/YYYY")}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          color="red"
                          sx={{
                            borderRadius: "10px",
                            width: "100%",
                            height: "5vh",
                            padding: "5px",
                            color: "#FF6D6DFF",
                          }}
                          onClick={() => openModal(applicant)}
                        >
                          {loadingDetails  ? <div><Spinner size="sm"></Spinner></div> : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {showModal && selectedUser && (
            <div
              className="modal show d-block modal-overlay"
              tabIndex="-1"
              role="dialog"
            >
              <div className="modal-dialog m-7" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedUser.name}</h5>
                    
                  </div>
                  <div className="modal-body">
                    <p>
                      <strong>Location:</strong> {selectedUser.user.city}
                    </p>
                    <p>
                      <strong>Video Link:</strong>{" "}
                      <a
                        href={selectedUser.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedUser.videoLink}
                      </a>
                    </p>
                    <p>
                      <strong>Repository link:</strong>{" "}
                      <a
                        href={selectedUser.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedUser.repoLink}
                      </a>
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      onClick={handleSubscribe}
                      className="btn btn-primary"
                    >
                      Subscribe
                    </button>
                    <button className="btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobStats;
