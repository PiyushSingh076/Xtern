import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { Button } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  //const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSendEmail() {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent");
      setIsSent(true);
    } catch (error) {
      toast.error("Error sending password reset link, try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  // const navigate = useNavigate()
  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page in the history stack
  };

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 500); // Simulate loading time
  // }, []);

  // if (loading) {
  //   return <Loading />;
  // }
  return (
    <>
      {/* <!-- Header start --> */}
      <header id="top-header">
        <div className="container">
          <div className="top-header-full">
            <div className="back-btn">
              <svg
                onClick={handleBackClick}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_330_7385"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="black" />
                </mask>
                <g mask="url(#mask0_330_7385)">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            <div className="header-title">
              <p>Forget Password</p>
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>
      {/* <!-- Header end --> */}
      {/* <!-- Forget password screen start --> */}
      <div className="w-full flex justify-center">
        <section className="!w-[400px]" id="forget-password-screen-content">
          <div className="container">
            {isSent ? (
              <div className="w-full text-center flex flex-col gap-2">
                <div className="w-full">
                  {" "}
                  A password reset link has been sent to{" "}
                  <span className="font-bold">{email}</span>, please follow the
                  instructions
                </div>
                <Button variant="contained" onClick={() => navigate("/signin")} >Back to login</Button>
              </div>
            ) : (
              <>
                <h1 className="d-none">Forget Password</h1>
                <h2 className="d-none">Hidden</h2>
                <div className="forget-password-screen-wrap">
                  <div className="forget-password-screen-top mt-32">
                    <p className="title-sec">
                      Enter the email associated with your account and we’ll
                      send an email with instructions to reset your password.
                    </p>
                  </div>
                  <form className="forget-password-screen-form mt-32">
                    <div className="form-details-sign-in">
                      <span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_330_7186"
                            style={{ maskType: "alpha" }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="24"
                            height="24"
                          >
                            <rect width="24" height="24" fill="white" />
                          </mask>
                          <g mask="url(#mask0_330_7186)">
                            <path
                              d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 7L12 13L21 7"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="Email"
                        placeholder="Email"
                        className="sign-in-custom-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </form>
                  <div className="send-instruction-btn mt-32 !flex !justify-center w-full">
                    {/* <Link to="/checkmailscreen">Send Instructions</Link> */}
                    <Button
                      onClick={handleSendEmail}
                      className="flex items-center gap-2"
                      variant="contained"
                      disabled={loading}
                    >
                      Send Link
                      {loading && (
                        <>
                          <div className="spinner-border-sm spinner-border"></div>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      {/* <!-- Forget password screen end --> */}
    </>
  );
};
export default ForgetPassword;
