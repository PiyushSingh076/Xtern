import React, { useEffect, useState } from "react";
import Layout from "../../../../components/SEO/Layout";

import Footer from "../../../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import EyeiconFill from "../../../../assets/svg/eye-off-fill.svg";
import Eyeicon from "../../../../assets/svg/eye-fill.svg";
import Loading from "../../../../components/Loading";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import SignInWithSocial from "../../../../components/SignInWithSocial";
import "./SignIn.css";
import useFetchUserData from "../../../../hooks/Auth/useFetchUserData";
import { ROUTES } from "../../../../constants/routes";

const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { userData, isLoading, error: fetchError } = useFetchUserData();

// if (userData ) {
//   navigate('/homescreen')
// }
  

  const handleBackClick = () => {
    navigate("/"); // This will navigate to the previous page in the history stack
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };



  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true)
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isPhoneVerified) {
            if(userData.type){
              navigate('/homescreen')
            }
            else{
              navigate('/choosetype')
            }
          } else {
            navigate('/verifyscreen')
          }
        } else {
          console.error("No such user profile!");
          // Handle the case where the user document doesn't exist--
          // You might want to redirect to a registration page or show an error
        }
      } else {
        console.error("User is null after sign-in!");
        // Handle the case where the user is not properly signed in
      }
    } catch (err) {
      setError(err.message); // Handle errors, such as incorrect credentials
    }
    finally{
      setLoading(false)
    }
  };

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   window.addEventListener("load", () => {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 500); // 350ms delay before hiding loader
  //   });

  //   return () => {
  //     window.removeEventListener("load", () => {
  //       setLoading(false);
  //     });
  //   };
  // }, []);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 500); // Simulate loading time
  // }, []);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <>
     <Layout
    title={"Sign In to Your Account"}
        description={"Sign in to your account to access job listings and manage your profil"}
        keywords={"Sign In, Login, Account, Access, Job Portal, User Login"}/>
      {/* <!-- Preloader start --> */}
      {/* {loading && (
        <div className="loader-mask">
          <div className="loader"></div>
        </div>
      )} */}
      {/* <!-- Preloader end --> */}
      {/* <!-- Header start --> */}

      {/* <!-- Header end --> */}
      {/* <!-- Sign in screen start --> */}
      <section
        id="sign-in-screen-content"
        // className={loading ? "hidden-content" : ""}
      >
        <div className="des-signin-container">
          <div className="sign-in-login">
            <h1 className="login-txt">Login To Your Account</h1>
          </div>
          <div className="sign-in-login-form mt-24">
            <form onSubmit={handleSignIn}>
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
              <div className="form-details-sign-in mt-12">
                <span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_330_7136"
                      style={{ maskType: "alpha" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <rect width="24" height="24" fill="white" />
                    </mask>
                    <g mask="url(#mask0_330_7136)">
                      <path
                        d="M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </span>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className="sign-in-custom-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={isPasswordVisible ? Eyeicon : EyeiconFill}
                  alt="Password Visibility Toggle"
                  className="password-toggle-icon"
                  id="eye"
                  onClick={togglePasswordVisibility}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="sign-in-btn mt-32 ">
                <button type="submit">{loading ? <div className="spinner-border spinner-border-sm"></div> : "Sign In"}</button>
              </div>
            </form>
          </div>
          <div className="remember-section">
            <div className="footer-checkbox-sec">
              <input
                className="footer-checkbox-input"
                id="footer-checkbox"
                type="checkbox"
              />
              <label htmlFor="footer-checkbox" className="footer-chec-txt">
                Remember Me
              </label>
            </div>
            <div className="forget-btn">
              <Link to="/forgetpassword">Forget password?</Link>
            </div>
          </div>
          <div className="or-section mt-32">
            <p>or continue with</p>
          </div>
          <SignInWithSocial />
        </div>
      </section>
      {/* <!-- Sign in screen end --> */}

      {/* <!-- Footer start --> */}

      <Footer link="/signup" type="signin" />
    </>
  );
};
export default SignIn;
