import React from "react";
import { ImSpinner3 } from "react-icons/im";
import {
  googleProvider,
  facebookProvider,
  appleProvider,
} from "../firebaseConfig"; // Import Firebase setup
import useOAuthLogin from "../hooks/Auth/useOAuthLogin"; // Import custom hook

const SignInWithSocial = () => {
  const { handleOAuthLogin, loadingProvider } = useOAuthLogin(); // Use the hook

  return (
    <div>
      <div className="sign-in-social-media">
        <div className="sign-in-social-media-full">
          {/* Sign in with Google */}
          <button
            onClick={() => handleOAuthLogin(googleProvider, "google")}
            className="sign-in-social-media-deatails"
            disabled={loadingProvider === "google"}
            style={buttonStyles}
          >
            {loadingProvider === "google" ? (
              <ImSpinner3 className="spin-icon" />
            ) : (
              <span className="social-icon-img" style={iconContainerStyles}>
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
            )}
          </button>
          {/* Sign in with Facebook */}
          <button
            onClick={() => handleOAuthLogin(facebookProvider, "facebook")}
            className="sign-in-social-media-deatails !bg-gray-200 saturate-0 "
            // disabled={loadingProvider === "facebook"}
            disabled={true}
            style={buttonStyles}
          >
            {loadingProvider === "facebook" ? (
              <ImSpinner3 className="spin-icon " />
            ) : (
              <span className="social-icon-img" style={iconContainerStyles}>
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
            )}
          </button>

          {/* Sign in with Apple */}
          {/* <button
            onClick={() => handleOAuthLogin(appleProvider, "apple")}
            className="sign-in-social-media-deatails apple-icon"
            disabled={loadingProvider === "apple"}
            style={buttonStyles}
          >
            {loadingProvider === "apple" ? (
              <ImSpinner3 className="spin-icon" />
            ) : (
              <span className="social-icon-img" style={iconContainerStyles}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_330_7241"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="white" />
                  </mask>
                  <g mask="url(#mask0_330_7241)">
                    <path
                      d="M20.9144 8.1816C20.7752 8.2896 18.3176 9.6744 18.3176 12.7536C18.3176 16.3152 21.4448 17.5752 21.5384 17.6064C21.524 17.6832 21.0416 19.332 19.8896 21.012C18.8624 22.4904 17.7896 23.9664 16.1576 23.9664C14.5256 23.9664 14.1056 23.0184 12.2216 23.0184C10.3856 23.0184 9.7328 23.9976 8.24 23.9976C6.7472 23.9976 5.7056 22.6296 4.508 20.9496C3.1208 18.9768 2 15.912 2 13.0032C2 8.3376 5.0336 5.8632 8.0192 5.8632C9.6056 5.8632 10.928 6.9048 11.924 6.9048C12.872 6.9048 14.3504 5.8008 16.1552 5.8008C16.8392 5.8008 19.2968 5.8632 20.9144 8.1816ZM15.2984 3.8256C16.0448 2.94 16.5728 1.7112 16.5728 0.4824C16.5728 0.312 16.5584 0.1392 16.5272 0C15.3128 0.0456 13.868 0.8088 12.9968 1.8192C12.3128 2.5968 11.6744 3.8256 11.6744 5.0712C11.6744 5.2584 11.7056 5.4456 11.72 5.5056C11.7968 5.52 11.9216 5.5368 12.0464 5.5368C13.136 5.5368 14.5064 4.8072 15.2984 3.8256Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </span>
            )}
          </button> */}
        </div>
      </div>
    </div>
  );
};

// Styling for the buttons and icons
const buttonStyles = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  background: "#fff",
  width: "100%",
  justifyContent: "center",
  marginBottom: "10px",
  transition: "background-color 0.3s ease", // Add hover effect
};

const iconContainerStyles = {
  marginRight: "10px",
};

// Custom spinner icon style
const spinIconStyles = {
  animation: "spin 1s linear infinite",
  fontSize: "24px",
};

// Add CSS for hover state
const hoverStyles = `
  .sign-in-social-media-deatails:hover {
    background-color: #f0f0f0; /* Change background color on hover */
    cursor: pointer;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default SignInWithSocial;
