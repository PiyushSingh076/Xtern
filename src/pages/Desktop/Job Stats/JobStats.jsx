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
import { Book, Bookmark, Save } from "lucide-react";
import { useSubscriptions } from "../../../hooks/Profile/useSubscriptions";
import { BookmarkAdded } from "@mui/icons-material";

const JobStats = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { jobId } = useParams();
  const { jobData, loading, fetchApplicantDetails } = useFetchJob(jobId);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { toggleSubscribeToXpert, isSubscribed, subLoading } =
    useSubscriptions();
  const openModal = async (applicant) => {
    setLoadingDetails(true);
    const user = await fetchApplicantDetails(applicant.uid);
    setLoadingDetails(false);
    console.log("User", user);
    console.log("Applicant", applicant);
    const subscribed = await isSubscribed(applicant.uid);
    setSelectedUser({ ...applicant, user: user, subscribed: subscribed });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSubscribe = async () => {
    setSelectedUser((prev) => ({ ...selectedUser, subscribed: !prev.subscribed }));
    const s = await toggleSubscribeToXpert(selectedUser.uid);
    console.log("Subscribed", s);
    setSelectedUser({ ...selectedUser, subscribed: s });
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
              <Table hover="true" stickyHeader>
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
                        {dayjs(
                          new Timestamp(
                            applicant.appliedOn.seconds,
                            applicant.appliedOn.nanoseconds
                          ).toDate()
                        ).format("MM/DD/YYYY")}
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
                          {loadingDetails ? (
                            <div>
                              <Spinner size="sm"></Spinner>
                            </div>
                          ) : (
                            "View"
                          )}
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
                    <h5 className="modal-title">
                      {selectedUser.user.firstName} {selectedUser.user.lastName}
                    </h5>
                  </div>
                  <div className="modal-body">
                    <div className="w-full h-[150px] flex items-center justify-center">
                      <img
                        src={selectedUser.user.photo_url}
                        className="size-[150px] rounded-full shadow-xl shadow-black/20 border-2 border-black/10"
                        alt=""
                      />
                    </div>
                    <div>
                      <b>Name:</b> {selectedUser.user.firstName}{" "}
                      {selectedUser.user.lastName}
                    </div>
                    <div>
                      <b>Skills:</b>
                      <div className="h-fit w-full flex flex-wrap gap-2">
                        <>
                          {selectedUser.user.skillSet.map((skill, index) => (
                            <Chip
                              label={skill.skill}
                              key={index + skill + "job-stat-skill"}
                            ></Chip>
                          ))}
                        </>
                      </div>
                    </div>
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
                    <p>
                      <strong>Submitted On: </strong>{" "}
                      {dayjs(
                        new Timestamp(
                          selectedUser.submittedOn.seconds,
                          selectedUser.submittedOn.nanoseconds
                        ).toDate()
                      ).format("MM/DD/YYYY")}
                    </p>
                  </div>
                  <div className="modal-footer gap-2">
                    <Button variant="contained">Approve</Button>
                    <Button
                      disabled={subLoading}
                      onClick={handleSubscribe}
                      variant="contained"
                      className=" !flex  gap-2"
                    >
                      
                        <>
                          {selectedUser.subscribed
                            ? "Unsubscribe"
                            : "Subscribe"}
                        </>
                      
                      {subLoading ? <Spinner size="sm"></Spinner> : selectedUser.subscribed == false ? <Bookmark></Bookmark> : <BookmarkAdded></BookmarkAdded>}
                    </Button>
                    <Button
                      variant="contained"
                      className=""
                      sx={{ bgcolor: "#FF6D6DFF" }}
                      onClick={closeModal}
                    >
                      Close
                    </Button>
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
