import { useState, useEffect } from "react";
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

const VideoCallSelection = () => {
  const { userData } = useFetchUserData();
  const [availableUsers, setAvailableUsers] = useState([]);
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

        // Query scheduledCalls for the current user
        const q = query(
          scheduledCallsRef,
          where("hostUserId", "==", currentUserId)
        );

        const querySnapshot = await getDocs(q);
        const associatedUsersData = [];

        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();

          // Determine the other user and meeting time
          const otherUserId =
            data.hostUserId === currentUserId
              ? data.recipientUserId
              : data.hostUserId;

          const meetingTime = data.scheduledDateTime || "No time specified";

          // Format the meeting time to a more readable format
          const formattedMeetingTime = meetingTime !== "No time specified" ? 
            new Date(meetingTime).toLocaleString() : meetingTime;

          // Fetch user details
          const userDoc = doc(usersCollectionRef, otherUserId);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            associatedUsersData.push({
              id: otherUserId,
              ...userSnapshot.data(),
              meetingTime: formattedMeetingTime,
            });
          }
        }

        setAvailableUsers(associatedUsersData);
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
      <h2>Start a Video Call</h2>
      {availableUsers.length === 0 ? (
        <div className="no-users-message">
          <i className="video-icon"></i>
          <p>No users available for video call</p>
        </div>
      ) : (
        <div className="user-grid">
          {availableUsers.map((user) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoCallSelection;
