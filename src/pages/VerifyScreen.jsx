import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // You are using only auth, removed db
import OtpInputGroup from "../components/OtpGroup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CgSpinner } from "react-icons/cg";
import { toast, Toaster } from "react-hot-toast";
import useSendOtp from "../hooks/Auth/useSendOtp";
import useVerifyOtp from "../hooks/Auth/useVerifyOtp";
import useRecaptcha from "../hooks/Auth/useRecaptcha";

const VerifyScreen = () => {
  const [seconds, setSeconds] = useState(50); // Timer for OTP resend
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState(""); // Phone number state
  const [showOTP, setShowOTP] = useState(false); // Toggle to show OTP input
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();

  // Initialize Recaptcha hook
  const { resetRecaptcha, initRecaptchaVerifier } = useRecaptcha(auth);

  // Hooks for sending and verifying OTP
  const { sendOtp, loading: sendingOtp } = useSendOtp(auth);
  const { verifyOtp, loading: verifyingOtp } = useVerifyOtp(auth);

  useEffect(() => {
    if (seconds > 0 && showOTP) {
      const timerId = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [seconds, showOTP]);

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    if (!ph || ph.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      await initRecaptchaVerifier(); // Initialize Recaptcha
      console.log('reCAPTCHA initialized successfully');
      await sendOtp(ph, setShowOTP, setError); // Send OTP
    } catch (err) {
      console.error("Error during OTP sending:", err);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    // Verify OTP
    await verifyOtp(otp, setError, navigate);
  };

  const handleResendOtp = async () => {
    setSeconds(50);
    setOtp("");
    setError("");
    await resetRecaptcha(); // Reset Recaptcha before resending OTP
    await sendOtp(ph, setShowOTP, setError, setSeconds, initRecaptchaVerifier); // Resend OTP
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
      <header id="top-header">
        <div className="container">
          <div className="top-header-full">
            <div className="back-btn" onClick={handleBackClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="header-title">
              <p>Verify Phone Number</p>
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      <section id="verify-screen">
        <div className="container">
          <div className="verify-screen-wrap">
            <div className="forget-password-screen-top mt-32">
              {showOTP ? (
                <>
                  <p className="title-sec">Enter your OTP</p>
                  <form className="mt-32" onSubmit={handleVerifyOtp}>
                    <OtpInputGroup
                      length={6}
                      onComplete={(completedOtp) => setOtp(completedOtp)}
                    />
                    <div className="verify-btn mt-32">
                      <button
                        type="submit"
                        className="btn"
                        disabled={verifyingOtp}
                      >
                        {verifyingOtp ? (
                          <span>
                            <CgSpinner size={20} className="animate-spin" />{" "}
                            Verifying...
                          </span>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  </form>
                  {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                  )}
                  <div className="otp-resend mt-16">
                    {seconds > 0 ? (
                      <span className="resend-txt1">
                        You can resend OTP in {seconds} seconds
                      </span>
                    ) : (
                      <span className="resend-txt2" onClick={handleResendOtp}>
                        Resend OTP
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="title-sec">Please enter your phone number</p>
                  <form className="mt-32" onSubmit={handlePhoneNumberSubmit}>
                    <PhoneInput
                      country={"in"}
                      value={ph}
                      onChange={setPh}
                      inputStyle={{
                        width: "100%",
                        padding: "20px 25px",
                        paddingLeft: "60px",
                        borderRadius: "12px",
                        border: error ? "2px solid red" : "2px solid #ccc",
                        outline: "none",
                        fontSize: "16px",
                        transition: "all 0.3s ease-in-out",
                        boxShadow: error
                          ? "0 0 8px rgba(255, 0, 0, 0.2)"
                          : "0 0 5px rgba(0, 0, 0, 0.1)",
                        backgroundColor: error ? "#ffeeee" : "white",
                      }}
                      containerStyle={{
                        width: "100%",
                        maxWidth: "450px",
                        margin: "0 auto",
                      }}
                    />
                    {error && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "5px",
                          paddingLeft: "65px",
                        }}
                      >
                        {error}
                      </p>
                    )}
                    <div id="recaptcha-container"></div>
                    <div className="verify-btn mt-32">
                      <button
                        type="submit"
                        className="btn"
                        disabled={sendingOtp}
                      >
                        {sendingOtp ? (
                          <span>
                            <CgSpinner size={20} className="animate-spin" />{" "}
                            Sending...
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        <Toaster position="bottom-left" reverseOrder={false} />
      </section>
    </>
  );
};

export default VerifyScreen;
