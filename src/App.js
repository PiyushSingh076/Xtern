import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import "./assets/css/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "./assets/css/media-query.css";
import { ROUTES } from "./constants/routes"; // Import the route constants


//  Desktop View

import DesktopHomeScreen  from './pages/Desktop/HomeScreen/index';
import Header from "./pages/Desktop/Header/Header";
import DesktopProjectDetails from "./pages/Desktop/ProjectDetail";
import DesktopCreateProject from "./pages/Desktop/ProjectDetail/ApplyProject";
import DesktopProfile from './pages/Desktop/Profile/index.jsx'
import DesktopPrefferRole from './pages/Desktop/Prefference/PrefferRole.jsx'
import DesktopSignIn from './pages/Desktop/Auth/SignIn'
import DesktopSignUp from './pages/Desktop/Auth/SignUp'
import DesktopPrefferedServiceIntern from './pages/Desktop/Prefference/PrefferServiceIntern.jsx'
import DesktopPrefferServiceVenture from './pages/Desktop/Prefference/PrefferServiceVenture.jsx'
import DesktopPrefferServiceMentor from './pages/Desktop/Prefference/PrefferServiceMentor.jsx'
import DesktopAllProjects from './pages/Desktop/ProjectDetail/AllProjects.jsx'




// Mobile View

import Teams from "./pages/Teams/Teams.jsx";
import PrefferedServiceVenture from "./pages/PrefferedServiceVenture.jsx";
import PrefferedServiceMentor from "./pages/PrefferedServiceMentor.jsx";
import PrefferedServiceIntern from "./pages/PrefferedServiceIntern.jsx";
import LetYouScreen from "./pages/LetYouScreen";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import CheckMailScreen from "./pages/CheckMailScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import VerifyScreen from "./pages/VerifyScreen";
import NotificationAllow from "./pages/NotificationAllow";
import PreferredLanguage from "./pages/PreferredLanguage";
import SpendLearning from "./pages/SpendLearning";
import SelectSkills from "./pages/SkillSelectionScreen";
import SelectCoursesScreen from "./pages/SelectCoursesScreen";
import HomeScreen from "./pages/HomeScreen";
import Notification from "./pages/Notification";
import CategoryScreen from "./pages/CategoryScreen";
import Business from "./pages/Business";
import TrendingCourse from "./pages/TrendingCourse";
import CheckOutScreen from "./pages/CheckOutScreen";
import PaymentScreen from "./pages/PaymentScreen";
import PaymentSuccessfulScreen from "./pages/PaymentSuccessfulScreen";
import ApplyCoupon from "./pages/ApplyCoupon";
import MentorScreen from "./pages/MentorScreen";
import FilterScreen from "./pages/FilterScreen";
import NewReleaseCourse from "./pages/NewReleaseCourse";
import Bookmark from "./pages/Bookmark";
import CourseOngoingScreen from "./pages/CourseOngoingScreen";
import SingleCourseOngoing from "./pages/SingleCourseOngoing";
import ChatScreen from "./pages/ChatScreen";
import SingleChatScreen from "./pages/SingleChatScreen";
import Profile from "./pages/MyProfile/Index.jsx";
import ProfileEdit from "./pages/ProfileEdit";
import WalletScreen from "./pages/WalletScreen";
import SingleMentor from "./pages/SingleMentor";
import NotificationOption from "./pages/NotificationOption";
import Language from "./pages/Language";
import Currency from "./pages/Currency";
import AboutUsScreen from "./pages/AboutUsScreen";
import PolicyScreen from "./pages/PolicyScreen";
import FaqScreen from "./pages/FaqScreen";
import FeedBackScreen from "./pages/FeedBackScreen";
import CompleteCourseRating from "./pages/CompleteCourseRating";
import ReviewScreen from "./pages/ReviewScreen";
import SearchResultFound from "./pages/SearchResultFound";
import SingleCourseComplete from "./pages/SingleCourseComplete";
import SearchNoResultScreen from "./pages/SearchNoResultScreen";
import BottomNavigation from "./components/BottomNavigation";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Protected/ProtectedRoute";
import Footer from "./components/Footer";
import AddLinkedInProfile from "./pages/AddLinkedInProfile";
import UserProfile from "./pages/UserProfile";
import ApplyProject from "./pages/ApplyProject";
import SingleJobDescription from "./pages/SingleJobDescription";
import ApplyInternship from "./pages/ApplyInternship";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetail";
import CreateJob from "./pages/CreateJob";
import { useEffect, useState } from "react";
import PrefferedRole from "./pages/PrefferedRole.jsx";

import BottomNavigationVenture from "./components/BottomNavigationVenture";


function App() {
  const location = useLocation(); // Get the current location


  const selectedRole = useSelector((state) => state.role.selectedRole);

  console.log('selectedRole:',selectedRole);


 

  const [isMobileView, setIsMobileView] = useState(false);


  console.log('isMobileView',isMobileView);
  useEffect(() => {
    const checkMobileView = () => {
      console.log('window.innerWidth',window.innerWidth);
      setIsMobileView(window.innerWidth <=992);
    };

    // Initial check
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobileView);
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

  return (
    <div className="App">
      {!isMobileView && <Header />}
      
      <Toaster />   
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={isMobileView ? <HomeScreen /> : <DesktopHomeScreen/>} />
        <Route path={ROUTES.SIGN_UP} element={isMobileView ?  <SignUp /> : <DesktopSignUp/>} />
        <Route path={ROUTES.SIGN_IN} element={isMobileView ? <SignIn /> : <DesktopSignIn/>} />
        <Route path={ROUTES.FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={ROUTES.CHECK_MAIL_SCREEN} element={<CheckMailScreen />} />
        <Route
          path={ROUTES.RESET_PASSWORD_SCREEN}
          element={<ResetPasswordScreen />}
        />
        <Route
          path={ROUTES.VERIFY_SCREEN}
          element={
            <ProtectedRoute allowedRoles={["entrepreneur", "Intern"]}>
              <VerifyScreen />
            </ProtectedRoute>
          }
        />


       <Route
       path={ROUTES.PREFERRED_ROLE}
       element={isMobileView ? <PrefferedRole/> : <DesktopPrefferRole/>}
       />

      <Route
      path={ROUTES.INTERN}
      element={isMobileView ? <PrefferedServiceIntern/> : <DesktopPrefferedServiceIntern/>}
      />
      <Route
      path={ROUTES.MENTOR}
      element={isMobileView ? <PrefferedServiceMentor/> : <DesktopPrefferServiceMentor/>}
      />

      <Route
      path={ROUTES.VENTURE}
      element={isMobileView ?   <PrefferedServiceVenture/> : <DesktopPrefferServiceVenture/>}
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
          path={ROUTES.CREATE_JOB}
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SPEND_LEARNING}
          element={
            <ProtectedRoute>
              <SpendLearning />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.INTEREST_SCREEN}
          element={
            <ProtectedRoute allowedRoles={["Intern"]}>
              <SelectSkills />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SELECT_COURSES_SCREEN}
          element={
            <ProtectedRoute>
              <SelectCoursesScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HOME_SCREEN}
          element={
            <ProtectedRoute allowedRoles={["entrepreneur", "Intern"]}>
             {isMobileView ? <HomeScreen /> : <DesktopHomeScreen/>}
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.NOTIFICATION}
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CATEGORY_SCREEN}
          element={
            <ProtectedRoute>
              <CategoryScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.BUSINESS}
          element={
            <ProtectedRoute>
              <Business />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CREATE_PROJECT}
          element={
            <ProtectedRoute>
              {isMobileView ? <CreateProject /> : null}
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SINGLE_COURSE_DESCRIPTION + "/:projectId"}
          element={
            <ProtectedRoute>
              {isMobileView ? <ProjectDetails /> : <DesktopProjectDetails/>}
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.APPLY_PROJECT + "/:projectId"}
          element={
            <ProtectedRoute>
              {isMobileView ? <ApplyProject /> : <DesktopCreateProject/>}
            </ProtectedRoute>
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
          path={ROUTES.TRENDING_COURSE}
          element={
            <ProtectedRoute>
              <TrendingCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHECKOUT_SCREEN}
          element={
            <ProtectedRoute>
              <CheckOutScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAYMENT_SCREEN}
          element={
            <ProtectedRoute>
              <PaymentScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAYMENT_SUCCESSFUL_SCREEN}
          element={
            <ProtectedRoute>
              <PaymentSuccessfulScreen />
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
          path={ROUTES.MENTOR_SCREEN}
          element={
            <ProtectedRoute>
              <MentorScreen />
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
          path={ROUTES.NEW_RELEASE_COURSE}
          element={
            <ProtectedRoute>
              {isMobileView ? <NewReleaseCourse /> : <DesktopAllProjects/>}
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
          path={ROUTES.COURSE_ONGOING_SCREEN}
          element={
            <ProtectedRoute>
              <CourseOngoingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SINGLE_COURSE_ONGOING}
          element={
            <ProtectedRoute>
              <SingleCourseOngoing />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SINGLE_COURSE_COMPLETE}
          element={
            <ProtectedRoute>
              <SingleCourseComplete />
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
            <ProtectedRoute>
              {isMobileView ? <Profile /> : <DesktopProfile/>}
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE_EDIT}
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADD_LINKEDIN_PROFILE}
          element={
            <ProtectedRoute>
              <AddLinkedInProfile />
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
          path={ROUTES.SINGLE_MENTOR}
          element={
            <ProtectedRoute>
              <SingleMentor />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.NOTIFICATION_OPTION}
          element={
            <ProtectedRoute>
              <NotificationOption />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LANGUAGE}
          element={
            <ProtectedRoute>
              <Language />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CURRENCY}
          element={
            <ProtectedRoute>
              <Currency />
            </ProtectedRoute>
          }
        />
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
          path={ROUTES.COMPLETE_COURSE_RATING}
          element={
            <ProtectedRoute>
              <CompleteCourseRating />
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
          path={ROUTES.SEARCH_RESULT_FOUND}
          element={
            <ProtectedRoute>
              <SearchResultFound />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SEARCH_NO_RESULT_SCREEN}
          element={
            <ProtectedRoute>
              <SearchNoResultScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TEAMS}
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />

        {/* Footer */}
        <Route path="" element={<Footer />} />
      </Routes>

      
      {isMobileView && location.pathname !== ROUTES.SIGN_IN && 
      location.pathname !== ROUTES.SIGN_UP && 
      location.pathname !== ROUTES.INTERN && 
      location.pathname !== ROUTES.MENTOR && 
      location.pathname !== ROUTES.VENTURE && (
        <>
          {selectedRole === 'venture' && <BottomNavigationVenture />}
          {selectedRole === 'intern' && <BottomNavigation/>}
          {selectedRole === 'mentor' && <BottomNavigationVenture/>}
          {selectedRole === '' && <BottomNavigation/>}
         
        
        </>
      )}
    
    </div>
  );
}

export default App;
