import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./my_video_call.css";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const MyVideoCall = () => {
  const { userData } = useFetchUserData();
  const [pastCalls, setPastCalls] = useState([]);
  const [todayCalls, setTodayCalls] = useState([]);
  const [futureCalls, setFutureCalls] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUserId = userData?.uid || localStorage.getItem("currentUserId");

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchAssociatedUsers = async () => {
      const db = getFirestore();
      const scheduledCallsRef = collection(db, "scheduledCalls");
      const usersCollectionRef = collection(db, "users");

      try {
        setLoading(true);

        const q = query(
          scheduledCallsRef,
          where("hostUserId", "==", currentUserId)
        );

        const querySnapshot = await getDocs(q);
        const pastCallsData = [];
        const todayCallsData = [];
        const futureCallsData = [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          const otherUserId =
            data.hostUserId === currentUserId
              ? data.recipientUserId
              : data.hostUserId;

          const meetingTime = data.scheduledDateTime
            ? new Date(data.scheduledDateTime)
            : null;

          const userDoc = doc(usersCollectionRef, otherUserId);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const callData = {
              id: otherUserId,
              ...userSnapshot.data(),
              meetingTime: meetingTime
                ? meetingTime.toLocaleString()
                : "No time specified",
            };

            if (meetingTime) {
              if (meetingTime < today) {
                pastCallsData.push(callData);
              } else if (
                meetingTime.getDate() === today.getDate() &&
                meetingTime.getMonth() === today.getMonth() &&
                meetingTime.getFullYear() === today.getFullYear()
              ) {
                todayCallsData.push(callData);
              } else {
                futureCallsData.push(callData);
              }
            } else {
              futureCallsData.push(callData);
            }
          }
        }

        setPastCalls(pastCallsData);
        setTodayCalls(todayCallsData);
        setFutureCalls(futureCallsData);
      } catch (err) {
        console.error("Error fetching associated users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociatedUsers();
  }, [currentUserId]);

  const handleVideoCallInvite = (user) => {
    navigate(
      `/videocall?uid=${user.id}&firstName=${encodeURIComponent(
        user.display_name
      )}`
    );
  };

  const renderUserCards = (users) => {
    return users.map((user) => (
      <div key={user.id} className="user-card">
        <div className="user-info">
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.display_name}
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              <i className="user-icon"></i>
            </div>
          )}
          <div className="user-details">
            <h3>{user.display_name}</h3>
            <p>{user.role || "Available"}</p>
            <p>Meeting Time: {user.meetingTime}</p>
          </div>
        </div>
        <button
          onClick={() => handleVideoCallInvite(user)}
          className="video-call-button"
        >
          <i className="video-icon"></i>
          Start Video Call
        </button>
      </div>
    ));
  };

  if (!userData) {
    return (
      <div className="loading-message">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="login-required">
        <div className="login-message">
          <i className="user-icon"></i>
          <p>Please log in to start a video call</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="video-call-selection">
      <h2>My Video Calls</h2>
      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
        <button
          className={`tab-button ${activeTab === "today" ? "active" : ""}`}
          onClick={() => setActiveTab("today")}
        >
          Today
        </button>
        <button
          className={`tab-button ${activeTab === "future" ? "active" : ""}`}
          onClick={() => setActiveTab("future")}
        >
          Upcomming
        </button>
      </div>
      <div className="call-section">
        {activeTab === "past" && (
          <>
            <h3>Past Calls</h3>
            <div className="user-grid">
              {pastCalls.length === 0 ? (
                <p>No past calls</p>
              ) : (
                renderUserCards(pastCalls)
              )}
            </div>
          </>
        )}
        {activeTab === "today" && (
          <>
            <h3>Today's Calls</h3>
            <div className="user-grid">
              {todayCalls.length === 0 ? (
                <p>No calls scheduled for today</p>
              ) : (
                renderUserCards(todayCalls)
              )}
            </div>
          </>
        )}
        {activeTab === "future" && (
          <>
            <h3>Upcomming Calls</h3>
            <div className="user-grid">
              {futureCalls.length === 0 ? (
                <p>No Upcomming calls scheduled</p>
              ) : (
                renderUserCards(futureCalls)
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyVideoCall;