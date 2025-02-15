import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import "./assets/css/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "./assets/css/media-query.css";
import { ROUTES } from "./constants/routes"; // Import the route constants

//  Desktop View
import Entrepreneur from "./pages/Desktop/Entrepreneur/index.jsx";
import DesktopHomeScreen from "./pages/Desktop/Homescreen/index.jsx";
import DesktopLandingPage from "./pages/Desktop/LandingScreen/index";
import Header from "./pages/Desktop/Header/Header";
import DesktopProjectDetails from "./pages/Desktop/ProjectDetail";
import DesktopProfile from "./pages/Desktop/Profile/index.jsx";
import DesktopPrefferRole from "./pages/Desktop/Prefference/XpertRole.jsx";
import DesktopSignIn from "./pages/Desktop/Auth/SignIn";
import DesktopSignUp from "./pages/Desktop/Auth/SignUp";
import DesktopPrefferedServiceIntern from "./pages/Desktop/Prefference/PrefferServiceIntern.jsx";
import DesktopFilterScreen from "./pages/Desktop/FilterScreen/filter.jsx"; //iffat
// import DesktopProfileDetails from "./pages/Desktop/FilterScreen/ProfileDetails.jsx";
import DesktopCard from "./pages/Desktop/Card/CardList.jsx";
import DesktopStepperForm from "./pages/Desktop/StepperForm/index.jsx";
import EntrepreneurDetailsForm from "./pages/Desktop/StepperForm/EntrepreneurDetailsForm.js";
import Event from "./pages/Desktop/Event/Event.jsx"// for My Schedule
// chat
import Chat from "./pages/Desktop/Chat/Chat.jsx";
import MyChat from "./pages/Desktop/MyChats/Mychats.jsx";
// video call
import VideoCall from "./pages/Desktop/VideoCall/VideoCall.jsx";
import MyVideoCall from "./pages/Desktop/MyVideoCall/MyVideoCall.jsx";

// Mobile View
import UserType from "./pages/UserType.jsx";
import MobHeader from "./components/MobHeader.jsx";
import TeamsPage from "./pages/Teams/index.jsx";
import PrefferedServiceIntern from "./pages/PrefferedServiceIntern.jsx";
import LetYouScreen from "./pages/LetYouScreen";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import VerifyScreen from "./pages/VerifyScreen";
import NotificationAllow from "./pages/NotificationAllow";
import PreferredLanguage from "./pages/PreferredLanguage";
import SelectSkills from "./pages/SkillSelectionScreen";
import HomeScreen from "./pages/MobLandingScreen/index.jsx";
import Notification from "./pages/Notification";
import ApplyCoupon from "./pages/ApplyCoupon";
import FilterScreen from "./pages/FilterScreen";
import Bookmark from "./pages/Bookmark";
import ChatScreen from "./pages/ChatScreen";
import SingleChatScreen from "./pages/SingleChatScreen";
import Profile from "./pages/MyProfile/Index.jsx";
import ProfileEdit from "./pages/ProfileEdit";
import WalletScreen from "./pages/Desktop/Wallet/wallet.jsx";
import NotificationOption from "./pages/NotificationOption";
import AboutUsScreen from "./pages/AboutUsScreen";
import PolicyScreen from "./pages/PolicyScreen";
import FaqScreen from "./pages/FaqScreen";
import FeedBackScreen from "./pages/FeedBackScreen";
import ReviewScreen from "./pages/ReviewScreen";
import BottomNavigation from "./components/BottomNavigation";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Protected/ProtectedRoute";
import Footer from "./components/Footer";
import UserProfile from "./pages/UserProfile";
import SingleJobDescription from "./pages/SingleJobDescription";
import ApplyInternship from "./pages/ApplyInternship";
import ProjectDetails from "./pages/ProjectDetail";
import CreateJob from "./pages/CreateJob";
import Jobs from "./pages/jobs.jsx";
import SingleJob from "./pages/SingleJob.jsx";
import ApplyJob from "./pages/Applyjob.jsx";

import { useEffect, useState } from "react";
import PrefferedRole from "./pages/PrefferedRole.jsx";

import { RouteRounded } from "@mui/icons-material";
import LandingBanner from "./pages/Desktop/LandingScreen/LandingBanner.jsx";
import LandingPage from "./pages/MobLandingScreen/LandingPage.jsx";
import InstaPull from "./pages/Desktop/InstaPull/MainSection.js";
import JobPostings from "./pages/Desktop/Job Postings/JobPostings";
import JobStats from "./pages/Desktop/Job Stats/JobStats.jsx";
import ViewJob from "./pages/Desktop/View Job/ViewJob.jsx";
import ChooseType from "./pages/Desktop/Auth/SignUp/ChooseType.jsx";
import EditJob from "./pages/EditJob.jsx";
import { AuthProvider } from "./hooks/Auth/useAuth.jsx";
import EntrepreneurMobile from "./pages/MyProfile/EntrepreneurMobile.jsx";
import SuperUserDashboard from "./pages/SuperUser/index.jsx";


function App() {
  const location = useLocation(); // Get the current location

  const selectedRole = useSelector((state) => state.role.selectedRole);

  const isVideoCallRoute = location.pathname === ROUTES.VIDEOCALL;

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 992);
    };

    // Initial check
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobileView);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, [window.innerWidth]);

  // Define the pages where BottomNavigation is needed
  const pagesWithBottomNavigation = [
    ROUTES.HOME_SCREEN,
    ROUTES.CHAT_SCREEN,
    ROUTES.PROFILE,
    ROUTES.BOOKMARK,
    ROUTES.COURSE_ONGOING_SCREEN,
  ];

  // comment
  return (
    <AuthProvider>
      <div className="App">
        {!isMobileView && !isVideoCallRoute && <Header />}
        {isMobileView && !isVideoCallRoute && <MobHeader />}
        {isMobileView && !isVideoCallRoute && (
          <div style={{ height: "50px" }}></div>
        )}
        {!isMobileView && !isVideoCallRoute && (
          <div style={{ height: "90px" }}></div>
        )}
        <Toaster />
        <Routes>
          {/* Public Routes */}
          {/* <Route
        path={ROUTES.HOME}
        element={isMobileView ? <DesktopHomeScreen /> : <DesktopHomeScreen />}
      /> */}
          <Route
            path={ROUTES.SIGN_UP}
            element={isMobileView ? <SignUp /> : <DesktopSignUp />}
          />
          <Route
            path={ROUTES.MYCHAT}
            element={
              <ProtectedRoute>
                <MyChat />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.VIDEOCALL}
            element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MYVIDEOCALL}
            element={
              <ProtectedRoute>
                <MyVideoCall />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CHOOSETYPE}
            element={
              <ProtectedRoute>
                <ChooseType></ChooseType>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path={ROUTES.SIGN_IN}
            element={isMobileView ? <SignIn /> : <DesktopSignIn />}
          />
          <Route path={ROUTES.FORGET_PASSWORD} element={<ForgetPassword />} />
          <Route path="/insta" element={<InstaPull />} />

          <Route path={ROUTES.VERIFY_SCREEN} element={<VerifyScreen />} />

          <Route
            path={ROUTES.PREFERRED_ROLE}
            element={<DesktopPrefferRole />}
          />
          {/*iffat*/}
          <Route
            path={ROUTES.FILTER_SCREEN}
            element={<DesktopFilterScreen />}
          />
          <Route path={ROUTES.CARD_DESIGN} element={<DesktopCard />} />

          {/* <Route
        path={ROUTES.PROFESSIONAL_PROFILE}
        element={<DesktopProfileDetails />}
      /> */}

          <Route
            path={ROUTES.INTERN}
            element={
              isMobileView ? (
                <PrefferedServiceIntern />
              ) : (
                <DesktopPrefferedServiceIntern />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path={ROUTES.NOTIFICATION_ALLOW}
            element={
              <ProtectedRoute>
                <NotificationAllow />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.WALLET_SCREEN}
            element={
              <ProtectedRoute>
                <WalletScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.STEPPER_FORM}
            element={
              <ProtectedRoute>
                <DesktopStepperForm />
                </ProtectedRoute>
              
            }
          />

          <Route
            path={ROUTES.ENTREPRENEURS_FORM}
            element={<EntrepreneurDetailsForm />}
          />
          <Route
            path={ROUTES.CREATE_JOB}
            element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            }
          />
           <Route
            path={ROUTES.EVENT}
            element={
             
                <Event/>
              
            }
          />
          <Route
            path={ROUTES.JOBS}
            element={
              
                <Jobs />
              
            }
          />

          <Route
            path={ROUTES.JOBS + "/:jobId"}
            element={
              
                <SingleJob />
              
            }
          />
          <Route
            path={ROUTES.APPLYJOB + "/:jobId"}
            element={
              <ProtectedRoute>
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.LANDING_PAGE}
            element={
              <>{isMobileView ? <HomeScreen /> : <DesktopLandingPage />}</>
            }
          />

          <Route path={ROUTES.HOME_SCREEN} element={<DesktopHomeScreen />} />

          <Route
            path={ROUTES.NOTIFICATION}
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />


          <Route
            path={ROUTES.USER_TYPE}
            element={
              isMobileView ? <UserType /> : <div>This Page only for Mobile</div>
            }
          />

          <Route
            path={ROUTES.SINGLE_COURSE_DESCRIPTION}
            element={
              <>
                <DesktopProjectDetails />
                {/* {isMobileView ? <ProjectDetails /> : <DesktopProjectDetails />} */}
              </>
            }
          />

          <Route
            path={ROUTES.INTERNSHIP + "/:internshipId"}
            element={
              <ProtectedRoute>
                <SingleJobDescription />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.APPLY_INTERNSHIP + "/:internshipId"}
            element={
              <ProtectedRoute>
                <ApplyInternship />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.APPLY_COUPON}
            element={
              <ProtectedRoute>
                <ApplyCoupon />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FILTER_SCREEN}
            element={
              <ProtectedRoute>
                <FilterScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.BOOKMARK}
            element={
              <ProtectedRoute>
                <Bookmark />
              </ProtectedRoute>
            }
          />
 
          <Route
            path={ROUTES.CHAT_SCREEN}
            element={
              <ProtectedRoute>
                <ChatScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SINGLE_CHAT_SCREEN}
            element={
              <ProtectedRoute>
                <SingleChatScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <>
                {isMobileView ? <Profile /> : <DesktopProfile />}
              </>
            }
          />
          <Route
            path={ROUTES.ENTREPRENEUR}
            element={
              <>
                {isMobileView ? (
                  <EntrepreneurMobile></EntrepreneurMobile>
                ) : (
                  <Entrepreneur />
                )}
              </>
            }
          />
          <Route
            path={ROUTES.JOBSPOSTINGS}
            element={
              <ProtectedRoute allowedRoles={["entrepreneur"]}>
                <JobPostings></JobPostings>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path={ROUTES.JOBSTATS}
            element={
              <ProtectedRoute allowedRoles={["entrepreneur"]}>
                <JobStats></JobStats>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path={ROUTES.PROFILE_EDIT}
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.USER_PROFILE}
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EDITJOB}
            element={
              <ProtectedRoute allowedRoles={["entrepreneur"]}>
                <EditJob />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path={ROUTES.NOTIFICATION_OPTION}
            element={
              <ProtectedRoute>
                <NotificationOption />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.VIEWJOB}
            element={
              <ProtectedRoute allowedRoles={["entrepreneur"]}>
                <ViewJob></ViewJob>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path={ROUTES.ABOUT_US_SCREEN}
            element={
              <ProtectedRoute>
                <AboutUsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.POLICY_SCREEN}
            element={
              <ProtectedRoute>
                <PolicyScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FAQ_SCREEN}
            element={
              <ProtectedRoute>
                <FaqScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FEEDBACK_SCREEN}
            element={
              <ProtectedRoute>
                <FeedBackScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.REVIEW_SCREEN}
            element={
              <ProtectedRoute>
                <ReviewScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.TEAMS}
            element={
              <ProtectedRoute>
                <TeamsPage />
              </ProtectedRoute>
            }
          />
           <Route
            path={ROUTES.SUPER_USER}
            element={
              <ProtectedRoute>
                <SuperUserDashboard />
              </ProtectedRoute>
            }
          />
          {/*//---------CHATS------------// */}
          <Route
            path={ROUTES.CHAT}
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Footer */}
          <Route path="" element={<Footer />} />
        </Routes>

      
      </div>
    </AuthProvider>
  );
}

export default App;
