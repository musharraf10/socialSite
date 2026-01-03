import AuthRoute from "../components/AuthRoute/AuthRoute";
import Home from "../components/Home/Home";
// import Login from "../components/Subscribers/Login";
import Unauthorized from "../components/Templates/Unauthorized";
import PostDetails from "../components/Posts/PostDetails"

import {Routes, Route} from "react-router-dom";

import PostsList from "../components/Posts/PostsList";

import Register from "../components/Subscribers/Register";

import RequestResetPassword from "../components/Subscribers/RequestResetPassword"

import Rankings from "../components/Admin/CreatorsRanking"
import Login from "../components/Subscribers/Login";
import PaymentSuccess from "../components/Plans/PaymentSuccess";
import GuideDetails from "../components/Posts/GuideDetails";
import Pricing from "../components/Plans/Pricing";




export default function PublicRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<RequestResetPassword />} path="/forgot-password" />
        <Route element={<Rankings />} path="/ranking" />
        <Route element={<PostsList />} path="/posts" />
        <Route element={<AuthRoute allowedRoles={["curator","subscriber","admin"]}> <PostDetails /> </AuthRoute>} path="/posts/article/:postId" />
        <Route element={<AuthRoute allowedRoles={["curator","subscriber","admin"]}><PostDetails /></AuthRoute>} path="/posts/article/:postId" />
        <Route element={<AuthRoute allowedRoles={["curator","subscriber","admin"]}><GuideDetails/></AuthRoute>} path="/posts/guide/:postId" />
        <Route element={<AuthRoute allowedRoles={["curator","subscriber","admin"]}><Pricing/></AuthRoute>} path="/free-subscription" />

        <Route path="posts/:postId" element={<AuthRoute allowedRoles={["curator","subscriber","admin"]}> <PostDetails /></AuthRoute>} />
        <Route path="/success" element={<AuthRoute allowedRoles={["curator","subscriber","admin"]}><PaymentSuccess/></AuthRoute>} />
        <Route path="/subscriber/bookmark" element={<AuthRoute allowedRoles={["curator","subscriber","admin"]}> <PostDetails /></AuthRoute>} />
        
        <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  )
}
