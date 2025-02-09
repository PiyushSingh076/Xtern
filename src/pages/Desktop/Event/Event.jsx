import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import "./Event.css";
import EmptyIcon from "./Empty_icon.png";
import FeedbackModal from "./FeedbackModal"; 

const Event = () => {
  const { userData } = useFetchUserData();
  const [calls, setCalls] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("invites");
  const [historyTab, setHistoryTab] = useState("accepted");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(""); // 'accepted' or 'rejected'
  const [currentInviteId, setCurrentInviteId] = useState(""); // To identify the current invitation

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      fetchCalls();
    }
  }, [currentUser]);

  const handleAcceptClick = (inviteId) => {
    setModalStatus("accepted");
    setCurrentInviteId(inviteId);
    setIsModalOpen(true);
  };
  
  const handleRejectClick = (inviteId) => {
    setModalStatus("rejected");
    setCurrentInviteId(inviteId);
    setIsModalOpen(true);
  };

  const handleSubmitFeedback = async (feedback) => {
    try {
      const callRef = doc(db, "scheduledCalls", currentInviteId);
      await updateDoc(callRef, { status: modalStatus, inviteFeedback: feedback });

      toast.success(`Invitation ${modalStatus} with feedback!`);
      setIsModalOpen(false);
      fetchScheduledCalls();
    } catch (error) {
      toast.error("Error submitting feedback");
      console.error("Error submitting feedback:", error);
    }
  };

  const fetchCalls = async () => {
    const callsRef = collection(db, "scheduledCalls");
    const q = query(callsRef, where("recipientUserId", "==", currentUser.uid));
    const q2 = query(callsRef, where("hostUserId", "==", currentUser.uid));

    const querySnapshot1 = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);

    const allCalls = [
      ...querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...querySnapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ];
    setCalls(allCalls);
  };

  // Function to fetch user data
  const fetchUserData = async (userId) => {
    if (!userId) return { display_name: "Unknown", photo_url: "/default-avatar.png" };
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : { display_name: "Unknown", photo_url: "/default-avatar.png" };
  };

  // Function to map scheduled call data
  const mapCallsData = async (querySnapshot, currentUserId, isHost) => {
    const callsData = [];
    for (let docSnap of querySnapshot.docs) {
      const callData = docSnap.data();
      const hostData = await fetchUserData(isHost ? currentUserId : callData.hostUserId);
      const recipientData = await fetchUserData(isHost ? callData.recipientUserId : currentUserId);

      callsData.push({
        id: docSnap.id,
        ...callData,
        host: hostData,
        recipient: recipientData,
      });
    }
    return callsData;
  };

  const fetchScheduledCalls = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const currentUserId = userData.uid;
  
      // Fetch scheduled calls where the user is the host
      const hostQuery = query(collection(db, "scheduledCalls"), where("hostUserId", "==", currentUserId));
      const hostSnapshot = await getDocs(hostQuery);
  
      // Fetch calls where the user is the recipient (including accepted, pending, and rejected ones)
      const recipientQuery = query(
        collection(db, "scheduledCalls"),
        where("recipientUserId", "==", currentUserId),
        where("status", "in", ["pending", "accepted", "rejected"])  // Include 'rejected' here
      );
      const recipientSnapshot = await getDocs(recipientQuery);
  
      const callsData = await mapCallsData(hostSnapshot, currentUserId, true); // currentUser as host
      const invitationData = await mapCallsData(recipientSnapshot, currentUserId, false); // currentUser as recipient
  
      // Separate accepted, pending, and rejected invitations
      const acceptedCalls = invitationData.filter((call) => call.status === "accepted");
      const pendingInvitations = invitationData.filter((call) => call.status === "pending");
      const rejectedCalls = invitationData.filter((call) => call.status === "rejected"); // New rejected calls filter
  
      setCalls([...callsData, ...acceptedCalls, ...rejectedCalls]); // Add rejected calls to the state along with scheduled/accepted ones
      setInvitations(pendingInvitations); // Only show pending invitations
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      if (userData) fetchScheduledCalls();
    }, [userData]);

  const handleStatusUpdate = async (callId, status) => {
      try {
        const callRef = doc(db, "scheduledCalls", callId);
        await updateDoc(callRef, { status });

        toast.success(`Call ${status} successfully!`);

        // Refetch updated data
        setLoading(true);

        // Update the invitations and calls list
        setInvitations((prevInvites) => prevInvites.filter((invite) => invite.id !== callId));

        const updatedCall = invitations.find((invite) => invite.id === callId);

          if (updatedCall) {
            const updatedCallWithStatus = { ...updatedCall, status };

            setCalls((prevCalls) => [...prevCalls, updatedCallWithStatus]); // Add rejected calls too
          }
        } catch (error) {
          toast.error("Error updating status");
          console.error("Error updating call status:", error);
        } finally {
          setLoading(false);
        }
    };
      const formatDateTime = (dateTime) => {
      return new Date(dateTime).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
      };
      
  return (
      <div className="event-container">
      <h1 className="event-title">My Schedule</h1>
      {loading ? (
      <div class="spinner-container">
        <div class="dots"></div>
      </div>
) : error ? (
    <p className="error-message">{error}</p>
  ) : (
    <div className="tab-container">
      <div className="tab-header">
        <button
          className={`tab-button ${activeTab === "invites" ? "active" : ""}`}
          onClick={() => setActiveTab("invites")}
        >
          Invites
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={`tab-button ${activeTab === "calls" ? "active" : ""}`}
          onClick={() => setActiveTab("calls")}
        >
          Calls
        </button>
       
      </div>

      {activeTab === "invites" && (
      <div className="invite-section">
        {invitations.length > 0 ? (
          <div className="invite-list">
            {invitations.map((invite) => (
              <div key={invite.id} className="invite-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="host-section" style={{ textAlign: "left" }}>
                  <img src={invite.host?.photo_url || "/default-avatar.png"} alt="Host" className="user-image" />
                  <p className="user-name">{invite.host?.display_name || "Unknown"}</p>
                </div>
                <div className="invite-details" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  
                  <p className="user-name">Host: {invite.host?.display_name || "Unknown"}</p>
                  <p className="description">Online Meet with {invite.host?.display_name || "Unknown"}</p>
                  <p className="scheduled-time">Date: {new Date(invite.scheduledDateTime).toLocaleDateString()}</p>
                  <p className="scheduled-time">Time: {new Date(invite.scheduledDateTime).toLocaleTimeString()}</p>
                
                </div>
                {/* this is for without modal */}
                {/* <div className="invite-actions" style={{ textAlign: "right" }}>
                  <button className="accept-button" onClick={() => handleStatusUpdate(invite.id, "accepted")} >
                    Accept
                  </button>
                  <button className="reject-button" onClick={() => handleStatusUpdate(invite.id, "rejected")}>
                    Reject
                  </button>
                </div> */}

                  <div className="invite-actions" style={{ textAlign: "right" }}>
                    <button className="accept-button" onClick={() => handleAcceptClick(invite.id)}>
                      Accept
                    </button>
                    <button className="reject-button" onClick={() => handleRejectClick(invite.id)}>
                      Reject
                    </button>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-invites-container">
            <img src={EmptyIcon} alt="No Invitations" className="no-invites-icon" />
            <p className="no-invites">No invitations found.</p>
          </div>

        )}
      </div>
    )}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        status={modalStatus}
      />

{activeTab === "history" && (
  <div className="history-section">
    <div className="history-tabs">
      <div
        className={`history-tab ${historyTab === "accepted" ? "active accepted" : ""}`}
        onClick={() => setHistoryTab("accepted")}
      >
        Accepted
      </div>
      <div
        className={`history-tab ${historyTab === "rejected" ? "active rejected" : ""}`}
        onClick={() => setHistoryTab("rejected")}
      >
        Rejected
      </div>
    </div>


    <div className="history-content">
      {historyTab === "accepted" && (
        <div className="history-list">
          {calls.filter((call) => call.status === "accepted").length > 0 ? (
            calls
              .filter((call) => call.status === "accepted")
              .map((call) => (
                <div key={call.id} className="history-item">
                  <div className="history-item-container">
                    <div className="host-section">
                      <img src={call.host?.photo_url || "/default-avatar.png"} alt="Host" className="user-image" />
                      <p className="user-name">{call.host?.display_name || "Unknown"}</p>
                    </div>

                    <div className="history-item-details">
                      <p className="history-description">
                        Online Meet with {call.recipient?.display_name || "Unknown"}
                      </p>
                      <p className="history-host">
                        Host: {call.host?.display_name || "Unknown"}
                      </p>
                      <p className="scheduled-time">Scheduled: {formatDateTime(call.scheduledDateTime)}</p>
                    </div>
                    <div className="recipient-section">
                      <img src={call.recipient?.photo_url || "/default-avatar.png"} alt="Recipient" className="user-image" />
                      <p className="user-name">{call.recipient?.display_name || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="no-accepted-calls-container">
              <img src={EmptyIcon} alt="No Accepted Calls" className="no-accepted-calls-icon" />
              <p className="no-accepted-calls">No accepted calls found.</p>
            </div>
          )}
        </div>
      )}

        {historyTab === "rejected" && (
          <div className="history-list">
            {calls.filter((call) => call.status === "rejected").length > 0 ? (
              calls
                .filter((call) => call.status === "rejected")
                .map((call) => (
                  <div key={call.id} className="history-item">
                    <div className="history-item-container">
                      <div className="host-section">
                        <img src={call.host?.photo_url || "/default-avatar.png"} alt="Host" className="user-image" />
                        <p className="user-name">{call.host?.display_name || "Unknown"}</p>
                      </div>
                      <div className="history-item-details">
                        <p className="history-description">
                          Online Meet with {call.recipient?.display_name || "Unknown"}
                        </p>
                        <p className="history-host">
                          Host: {call.host?.display_name || "Unknown"}
                        </p>
                        <p className="scheduled-time">Scheduled: {formatDateTime(call.scheduledDateTime)}</p>
                      </div>
                      <div className="recipient-section">
                        <img src={call.recipient?.photo_url || "/default-avatar.png"} alt="Recipient" className="user-image" />
                        <p className="user-name">{call.recipient?.display_name || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="no-rejected-calls-container">
                <img src={EmptyIcon} alt="No Rejected Calls" className="no-rejected-calls-icon" />
                <p className="no-rejected-calls">No rejected calls found.</p>
              </div>
            )}
          </div>
        )}
    </div>
  </div>
)}

      {activeTab === "calls" && (
        <div className="calls-list">
          {calls.length > 0 ? (
            calls.map((call) => (
              <div key={call.id} className={`call-item ${call.status}`}>
                <div className="user-section">
                  <img src={call.host?.photo_url || "/default-avatar.png"} alt="Host" className="user-image" />
                  <p className="user-name">{call.host?.display_name || "Unknown"}</p>
                  <p className="user-role">Host</p>
                </div>

                <div className="call-details">
                  <h2 className="call-type">{call.callType} Call</h2>
                  {/* <p className="scheduled-time">Scheduled: {formatDateTime(call.scheduledDateTime)}</p> */}
                  <p className="description">{call.description || "No description provided"}</p>
                  <p className={`call-status ${call.status === 'accepted' ? 'green' : call.status === 'rejected' ? 'red' : 'grey'}`}>
                    Status: {call.status}
                  </p>

                  <button className="join-button">
                    <a href={call.eventLink} target="_blank" rel="noopener noreferrer">Join Call</a>
                  </button>
                </div>

                <div className="user-section">
                  <img src={call.recipient?.photo_url || "/default-avatar.png"} alt="Recipient" className="user-image" />
                  <p className="user-name">{call.recipient?.display_name || "Unknown"}</p>
                  <p className="user-role">Recipient</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-calls-container">
              <img src={EmptyIcon} alt="No Calls" className="no-calls-icon" />
              <p className="no-calls">No scheduled calls found.</p>
            </div>

          )}
        </div>
      )}
    </div>
  )}
</div>
);
};
export default Event;