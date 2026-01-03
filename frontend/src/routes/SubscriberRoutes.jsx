import AuthRoute from "../components/AuthRoute/AuthRoute";
import SubscriberDashboard from "../components/Subscribers/SubscriberDashboard";
import { Routes, Route } from "react-router-dom";

import AccountSummaryDashboard from "../components/Subscribers/AccountSummary";
import DashboardPosts from "../components/Subscribers/DashboardPosts";
import UploadProfilePic from "../components/Subscribers/UploadProfilePic";
import Settings from "../components/Subscribers/Settings/Settings";
import AddEmailComponent from "../components/Subscribers/UpdateEmail";
import MyFollowing from "../components/Subscribers/MyFollowing";
import MyFollowers from "../components/Subscribers/MyFollowers";
import Notifications from "../components/Notification/NotificationLists";
import AccountVerifiedComponent from "../components/Subscribers/AccountVerification";

import PostsList from "../components/Posts/PostsList";
import Pricing from "../components/Plans/Pricing";
import Plan from "../components/Subscribers/Settings/Plan";
import Billing from "../components/Subscribers/Settings/Billing";
import ChangePassword from "../components/Subscribers/Settings/ChangePassword";
import BecomeCreator from "../components/Subscribers/Settings/BecomeCreator";
import SettingsSubPage from "../components/Subscribers/SettingsPage";
import SearchFilter from "../components/Subscribers/Webinars/SearchFilter";

import { Webinars } from "../components/Webinar/Webinars";

import PayingFreePlan from "../components/Plans/PayingFreePlan";
import Trending from "../components/Subscribers/Trending/Trending";
import { BookmarkPost } from "../components/Posts/BookmarkPost";

import ResetPassword from "../components/Subscribers/ResetPassword";
import ViewGuide from "../components/Posts/ViewGuide";
import GuideDetails from "../components/Posts/GuideDetails";
import CheckoutForm from "../components/Plans/CheckoutForm";
import PostDetails from "../components/Posts/PostDetails";
import BookmarkDetails from "../components/Posts/BookmarkDetails";

import PlanDetails from "../components/Plans/PlanDetails";
import UpcomingEvents from "../components/Posts/UpcomingEvents";


const SubscriberRoutes = () => {
  return (
    <Routes>
      <Route
        path="/subscriber"
        element={
          <AuthRoute allowedRoles={["subscriber"]}>
            {" "}
            <SubscriberDashboard />{" "}
          </AuthRoute>
        }
      >
        <Route index element={<PostsList />} />
        <Route path="upcomingevents"element={<UpcomingEvents />} />
        <Route path="upload-profile-photo" element={<UploadProfilePic />} />
        <Route path="settings" element={<Settings />}>
          <Route path="profilesettings" element={<SettingsSubPage />} />
          <Route path="plan" element={<Plan />} />
          <Route path="billing" element={<Billing />} />
          <Route path="security" element={<ChangePassword />} />
          <Route path="become-creator" element={<BecomeCreator />} />
          <Route path="trendingcontent" element={<Trending />} />
        </Route>

        <Route path="bookmarks" element={<BookmarkPost />} />
        <Route path="profile" element={<AccountSummaryDashboard />} />

        <Route path="my-followings" element={<MyFollowing />} />
        <Route path="my-followers" element={<MyFollowers />} />
        <Route path="add-email" element={<AddEmailComponent />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="latestposts" element={<DashboardPosts />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="free-subscription" element={<PayingFreePlan />} />
        <Route path="webinars" element={<Webinars />} />
        <Route path="stepbystepguide" element={<ViewGuide />} />
        <Route path="guide/:guideId" element={<GuideDetails />} />
        <Route path="checkout/:planId" element={<CheckoutForm />} />
        <Route path="plan-details" element={<PlanDetails />} />
      </Route>
      <Route
            path="/account-verification/:verifyToken"
            element={<AccountVerifiedComponent />}
          />
      {/* <Route path="/posts/:postId" element={<PostDetails/>}/> */}
      <Route path="/bookmarks/:postId" element={<BookmarkDetails/>}/>

      <Route path="reset-password/:verifyToken" element={<ResetPassword />} />
    </Routes>
  );
};

export default SubscriberRoutes;
