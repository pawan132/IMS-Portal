import React from "react";
import { Route, Routes } from "react-router-dom";
import Error from "./pages/Error";
import PrivateRoute from "./components/layout/PrivateRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import axios from "axios";
import ScrollToTop from "./components/common/ScrollToTop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Student from "./pages/Student";
import Course from "./pages/Course";
import Branch from "./pages/Branches";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Faculty from "./pages/Faculty";
import Batch from "./pages/Batch";
import Profile from "./pages/Profile";
import Module from "./pages/Module";
import { createBrowserHistory } from "history";
import EmailVerified from "./pages/EmailVerified";
import User from "./pages/User";
import AdminModule from "./pages/AdminModule";
import Institute from "./pages/Institute";
import AdminCourse from "./pages/AdminCourse";
import FacultySchedule from "./pages/FacultySchedule";
import Attendance from "./pages/Attendance";
import StudentRegistration from "./pages/StudentRegistration"

const App = () => {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  const history = createBrowserHistory({ basename: "" });

  return (
    <div>
      <ScrollToTop />

      <Routes history={history}>
        <Route index element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/email-verified" element={<EmailVerified />} />

        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/admission" element={<Student />} />
          <Route path="admin/courses" element={<Course />} />
          <Route path="admin/branches" element={<Branch />} />
          <Route path="admin/faculty" element={<Faculty />} />
          <Route path="admin/batch" element={<Batch />} />
          <Route path="admin/registerStudent" element={<StudentRegistration />} />
          <Route path="admin/profile" element={<Profile />} />
          <Route path="admin/course-module" element={<Module />} />
          <Route path="admin/admin-course-module" element={<AdminModule />} />
          <Route path="admin/admin-course" element={<AdminCourse />} />
          <Route path="admin/user" element={<User />} />
          <Route path="admin/institute" element={<Institute />} />
          <Route path="admin/faculty/schedule" element={<FacultySchedule />} />
          <Route path="admin/attendance" element={<Attendance />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
