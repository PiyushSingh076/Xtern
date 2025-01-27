import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import axios from "axios";
import Loader from "./Loader";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallEndModal } from "./utils/CallEndModal";
import "./videostyle.css";

const apiKey = "3pts2x46x4wy";

if (!apiKey) {
  throw new Error("API key must be provided");
}

const VideoCall = () => {
  const navigate = useNavigate();
  const { userData } = useFetchUserData();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isJoining, setIsJoining] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showCallEndModal, setShowCallEndModal] = useState(false);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const user2FirstName = searchParams.get("firstName");
  const user2Uid = searchParams.get("uid");

  const handleCallEnd = useCallback(() => {
    setShowCallEndModal(true);
  }, []);

  const joinCall = useCallback(async () => {
    if (isJoined || !userData || !user2Uid) {
      setIsJoining(false);
      return;
    }

    try {
      setIsJoining(true);

      const { data: callData } = await axios.post(
        "https://us-central1-startup-a54cf.cloudfunctions.net/api/getVideoCallId",
        {
          members: [
            { id: userData.uid, name: userData.display_name },
            { id: user2Uid, name: user2FirstName },
          ],
        }
      );

      const { data: tokenData } = await axios.post(
        "https://us-central1-startup-a54cf.cloudfunctions.net/api/getToken",
        { userId: userData.uid }
      );

      const user = {
        id: userData.uid,
        name: userData.display_name,
        image: userData.image || "https://getstream.io/random_svg/?id=guest&name=Guest",
        type: "authenticated",
      };

      const newClient = new StreamVideoClient({ apiKey });
      await newClient.connectUser(user, tokenData.token);
      setClient(newClient);

      const newCall = newClient.call("default", callData.callId);
      await newCall.join({ create: true });
      
      newCall.startRecording();

      setCall(newCall);
      setIsJoined(true);
    } catch (error) {
      alert("Failed to join the call. Please try again later.");
    } finally {
      setIsJoining(false);
    }
  }, [isJoined, userData, user2Uid, user2FirstName]);

  useEffect(() => {
    joinCall();
  }, [joinCall]);

  useEffect(() => {
    if (call) {
      const handleCallStateChange = async (event) => {
        if (
          event?.state === CallingState.ENDED ||
          event?.state === CallingState.LEFT ||
          event === CallingState.ENDED ||
          event === CallingState.LEFT
        ) {
          await call.stopRecording();
          handleCallEnd();
        }
      };

      call.on("call.state_updated", handleCallStateChange);
      call.on("state_changed", handleCallStateChange);

      return () => {
        call.off("call.state_updated", handleCallStateChange);
        call.off("state_changed", handleCallStateChange);
      };
    }
  }, [call, handleCallEnd]);

  useEffect(() => {
    let timer;
    if (isJoined) {
      timer = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isJoined]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isJoining || !isJoined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallLayout
            duration={formatDuration(callDuration)}
            userName={userData?.display_name}
          />
        </StreamCall>
      </StreamVideo>
      
      {showCallEndModal && (
        <CallEndModal
          isOpen={showCallEndModal}
          onClose={() => {
            setShowCallEndModal(false);
            navigate("/");
          }}
        />
      )}
    </>
  );
};

const CallLayout = ({ duration, userName }) => {
  const navigate = useNavigate();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState === CallingState.LEFT) {
    navigate("/");
    return null;
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="call-container">
        <div className="content-wrapper">
          <header className="header-container">
            <div className="call-header">
              <div className="header-left">
                <div className="call-info">
                  <div className="cal-duration-container">
                    <span className="call-duration">{duration}</span>
                  </div>
                  <span className="connection-status">0 ms</span>
                </div>
              </div>
              <div className="header-right">
                <div className="stream-logo">
                  <img src="/logo.png" className="video-call-logo" alt="" />
                  <span className="logo-text">Xtern Video Calling</span>
                </div>
              </div>
            </div>
          </header>
          <main className="call-content">
            <SpeakerLayout />
          </main>
          <footer className="call-controls">
            <div className="controls-container">
              <CallControls />
            </div>
          </footer>
        </div>
      </div>
    </StreamTheme>
  );
};

export default VideoCall;
