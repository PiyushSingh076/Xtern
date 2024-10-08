import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LetYouImg from "../assets/svg/letyouin.svg";

import Footer from "../components/Footer";
import { googleProvider, facebookProvider } from "../firebaseConfig"; // Import Firebase setup
import useOAuthLogin from "../hooks/Auth/useOAuthLogin";
import { ROUTES } from "../constants/routes";
import useFetchUserData from "../hooks/Auth/useFetchUserData";
import Loading from "../components/Loading";

const LetYouScreen = () => {
  const { handleOAuthLogin, loadingProvider } = useOAuthLogin();
  const navigate = useNavigate();
  const { userData, loading, error } = useFetchUserData();

  // Redirect if phone is verified
  useEffect(() => {
    if (userData?.isPhoneVerified) {
      navigate(ROUTES.VERIFY_SCREEN); // Redirect to verify screen
    }
  }, [userData, navigate]);

  // Show loading state while fetching user data
  if (loading) {
    return <Loading />; // You can replace this with a loading spinner if needed
  }

  // Handle error case if user data fails to load
  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <>
      {/* <header id="let-you-screen">
        <div className="container">
          <div className="let-yoy-page-section-full pt-30">
            <div className="back-btn-page">
              <Link to="/">
                <svg
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
                    <rect width="24" height="24" fill="white" />
                  </mask>
                  <g mask="url(#mask0_330_7385)">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      <section id="let-you-screen-content">
        <div className="container">
          <div className="let-you-screen-content-wrap">
            <div className="let-you-screen-img mt-32">
              <img src={LetYouImg} height="200" width="200" alt="let-you-img" />
              <h1 className="let-you-txt mt-32">Let’s You In</h1>
            </div>

            <div className="let-you-social-media mt-24">
              {/* Continue with Google */}
              <button
                onClick={() => handleOAuthLogin(googleProvider, "google")}
                className="social-icon social-links"
                disabled={loadingProvider === "google"}
              >
                <span className="social-icon-img">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_330_7246"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="white" />
                    </mask>
                    <g mask="url(#mask0_330_7246)">
                      <path
                        d="M23.49 12.27C23.49 11.48 23.42 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.33 17.24 16.07 18.09V21.09H19.93C22.19 19 23.49 15.92 23.49 12.27Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 24C15.24 24 17.95 22.92 19.93 21.09L16.07 18.09C14.99 18.81 13.62 19.25 12 19.25C8.87004 19.25 6.22004 17.14 5.27004 14.29H1.29004V17.38C3.26004 21.3 7.31004 24 12 24Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.27 14.29C5.02 13.57 4.89 12.8 4.89 12C4.89 11.2 5.03 10.43 5.27 9.71V6.62H1.29C0.469999 8.24 0 10.06 0 12C0 13.94 0.469999 15.76 1.29 17.38L5.27 14.29Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 4.75C13.77 4.75 15.35 5.36 16.6 6.55L20.02 3.13C17.95 1.19 15.24 0 12 0C7.31004 0 3.26004 2.7 1.29004 6.62L5.27004 9.71C6.22004 6.86 8.87004 4.75 12 4.75Z"
                        fill="#EA4335"
                      />
                    </g>
                  </svg>
                </span>
                <span className="social-txt">
                  {loadingProvider === "google"
                    ? "Loading..."
                    : "Continue with Google"}
                </span>
              </button>

              {/* Continue with Facebook */}
              <button
                onClick={() => handleOAuthLogin(facebookProvider, "facebook")}
                className="social-icon mt-12 social-links"
                disabled={loadingProvider === "facebook"}
              >
                <span className="social-icon-img">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_330_7255"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="white" />
                    </mask>
                    <g mask="url(#mask0_330_7255)">
                      <path
                        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                        fill="#1977F3"
                      />
                      <path
                        d="M16.6711 15.4696L17.2027 12H13.8749V9.74884C13.8749 8.80045 14.3389 7.874 15.8307 7.874H17.3444V4.92083C17.3444 4.92083 15.9708 4.68626 14.6579 4.68626C11.9173 4.68626 10.1252 6.34679 10.1252 9.35565V12H7.07751V15.4696H10.1252V23.8549C10.7361 23.9511 11.3621 24 12 24C12.6379 24 13.264 23.9494 13.8749 23.8549V15.4696H16.6711Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </span>
                <span className="social-txt">
                  {loadingProvider === "facebook"
                    ? "Loading..."
                    : "Continue with Facebook"}
                </span>
              </button>

              {/* <button
                onClick={() => navigate(ROUTES.VERIFY_SCREEN)}
                className="social-icon mt-12 social-links "
              >
                <span className="social-icon-img apple-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M22 16.92v3.67a2.24 2.24 0 0 1-2.42 2.24A21.94 21.94 0 0 1 2.5 3.42 2.24 2.24 0 0 1 4.72 1h3.68A2.25 2.25 0 0 1 10.65 3.12c.23 1.43.7 2.8 1.34 4.04a2.25 2.25 0 0 1-.51 2.51l-1.55 1.55a17.08 17.08 0 0 0 7.24 7.24l1.55-1.55a2.25 2.25 0 0 1 2.51-.51c1.24.64 2.6 1.11 4.04 1.34a2.25 2.25 0 0 1 2.12 2.29Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span className="social-txt">Continue with Mobile</span>
              </button> */}
            </div>

            <div className="or-section mt-2">
              <p>or</p>
            </div>
            <div className="sign-in-password-btn mt-2">
              <Link to="/signin">Sign In with Password</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer link="/signup" />
    </>
  );
};

export default LetYouScreen;
