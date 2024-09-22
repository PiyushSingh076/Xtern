import { Route, Routes, useLocation } from "react-router-dom";
import "./assets/css/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/media-query.css";
import { ROUTES } from "./constants/routes"; // Import the route constants
import LetYouScreen from "./pages/LetYouScreen";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import CheckMailScreen from "./pages/CheckMailScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import VerifyScreen from "./pages/VerifyScreen";
import NotificationAllow from "./pages/NotificationAllow";
import PreferredLanguage from "./pages/PreferredLanguage";
import PrimaryGoalScreen from "./pages/PrimaryGoalScreen";
import SpendLearning from "./pages/SpendLearning";
import SelectSkills from "./pages/SkillSelectionScreen";
import SelectCoursesScreen from "./pages/SelectCoursesScreen";
import HomeScreen from "./pages/HomeScreen";
import Notification from "./pages/Notification";
import CategoryScreen from "./pages/CategoryScreen";
import Business from "./pages/Business";
import SingleCourseDescription from "./pages/SingleCourseDescription";
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
import Profile from "./pages/Profile";
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

function App() {
  const location = useLocation(); // Get the current location

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
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<LetYouScreen />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={ROUTES.FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={ROUTES.CHECK_MAIL_SCREEN} element={<CheckMailScreen />} />
        <Route
          path={ROUTES.RESET_PASSWORD_SCREEN}
          element={<ResetPasswordScreen />}
        />
        <Route path={ROUTES.VERIFY_SCREEN} element={<VerifyScreen />} />

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
          path={ROUTES.PREFERRED_LANGUAGE}
          element={
            <ProtectedRoute>
              <PreferredLanguage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PRIMARY_GOAL_SCREEN}
          element={
            <ProtectedRoute>
              <PrimaryGoalScreen />
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
            <ProtectedRoute>
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
            <ProtectedRoute>
              <HomeScreen />
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
          path={ROUTES.SINGLE_COURSE_DESCRIPTION + "/:projectId"}
          element={
            <ProtectedRoute>
              <SingleCourseDescription />
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
              <NewReleaseCourse />
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
              <Profile />
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
          path={ROUTES.WALLET_SCREEN}
          element={
            <ProtectedRoute>
              <WalletScreen />
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

        {/* Footer */}
        <Route path="" element={<Footer />} />
      </Routes>

      {/* Conditionally render BottomNavigation based on the current path */}
      {pagesWithBottomNavigation.includes(location.pathname) && (
        <BottomNavigation />
      )}
    </div>
  );
}

export default App;
