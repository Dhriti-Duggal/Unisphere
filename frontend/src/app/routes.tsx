import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// Lazy Load Pages for performance
const Welcome = lazy(() => import("./pages/Welcome").then(m => ({ default: m.Welcome })));
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const Signup = lazy(() => import("./pages/Signup").then(m => ({ default: m.Signup })));
const Onboarding = lazy(() => import("./pages/Onboarding").then(m => ({ default: m.Onboarding })));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard").then(m => ({ default: m.TeacherDashboard })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const CoursesList = lazy(() => import("./pages/CoursesList").then(m => ({ default: m.CoursesList })));
const CourseDetail = lazy(() => import("./pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
const Chat = lazy(() => import("./pages/Chat").then(m => ({ default: m.Chat })));
const AssignmentList = lazy(() => import("./pages/AssignmentList").then(m => ({ default: m.AssignmentList })));
const AssignmentDetail = lazy(() => import("./pages/AssignmentDetail").then(m => ({ default: m.AssignmentDetail })));
const Analytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.Analytics })));
const Profile = lazy(() => import("./pages/Profile").then(m => ({ default: m.Profile })));
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));
const SearchResults = lazy(() => import("./pages/SearchResults").then(m => ({ default: m.SearchResults })));
const Groups = lazy(() => import("./pages/Groups").then(m => ({ default: m.Groups })));
const GroupDetails = lazy(() => import("./pages/GroupDetails").then(m => ({ default: m.GroupDetails })));
const CreateCourse = lazy(() => import("./pages/CreateCourse").then(m => ({ default: m.CreateCourse })));
const LiveClass = lazy(() => import("./pages/LiveClass").then(m => ({ default: m.LiveClass })));
const CourseManagement = lazy(() => import("./pages/CourseManagement").then(m => ({ default: m.CourseManagement })));
const Notifications = lazy(() => import("./pages/Notifications").then(m => ({ default: m.Notifications })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

// Loading component for Suspense
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      < Suspense fallback={<Loading />}>
        <Welcome />
      </Suspense>
    ),
    errorElement: <Suspense fallback={<Loading />}><NotFound /></Suspense>,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loading />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <Suspense fallback={<Loading />}>
        <Onboarding />
      </Suspense>
    ),
  },
  {
    path: "/student",
    element: <ProtectedRoute role="student" />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <Suspense fallback={<Loading />}><StudentDashboard /></Suspense> },
          { path: "courses", element: <Suspense fallback={<Loading />}><CoursesList /></Suspense> },
          { path: "courses/:id", element: <Suspense fallback={<Loading />}><CourseDetail /></Suspense> },
          { path: "assignments", element: <Suspense fallback={<Loading />}><AssignmentList /></Suspense> },
          { path: "assignments/:id", element: <Suspense fallback={<Loading />}><AssignmentDetail /></Suspense> },
          { path: "groups", element: <Suspense fallback={<Loading />}><Groups /></Suspense> },
          { path: "groups/:id", element: <Suspense fallback={<Loading />}><GroupDetails /></Suspense> },
          { path: "chat", element: <Suspense fallback={<Loading />}><Chat /></Suspense> },
          { path: "chat/group/:id", element: <Suspense fallback={<Loading />}><Chat /></Suspense> },
          { path: "chat/course/:id", element: <Suspense fallback={<Loading />}><Chat /></Suspense> },
          { path: "notifications", element: <Suspense fallback={<Loading />}><Notifications /></Suspense> },
          { path: "profile", element: <Suspense fallback={<Loading />}><Profile /></Suspense> },
          { path: "analytics", element: <Suspense fallback={<Loading />}><Analytics /></Suspense> },
          { path: "settings", element: <Suspense fallback={<Loading />}><Settings /></Suspense> },
          { path: "search", element: <Suspense fallback={<Loading />}><SearchResults /></Suspense> },
          { path: "live-class", element: <Suspense fallback={<Loading />}><LiveClass /></Suspense> },
          { path: "live-class/:id", element: <Suspense fallback={<Loading />}><LiveClass /></Suspense> },
        ],
      },
    ],
  },
  {
    path: "/teacher",
    element: <ProtectedRoute role="teacher" />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <Suspense fallback={<Loading />}><TeacherDashboard /></Suspense> },
          { path: "courses", element: <Suspense fallback={<Loading />}><CoursesList /></Suspense> },
          { path: "courses/:id", element: <Suspense fallback={<Loading />}><CourseDetail /></Suspense> },
          { path: "courses/:id/manage", element: <Suspense fallback={<Loading />}><CourseManagement /></Suspense> },
          { path: "create-course", element: <Suspense fallback={<Loading />}><CreateCourse /></Suspense> },
          { path: "analytics", element: <Suspense fallback={<Loading />}><Analytics /></Suspense> },
          { path: "live-class", element: <Suspense fallback={<Loading />}><LiveClass /></Suspense> },
          { path: "groups", element: <Suspense fallback={<Loading />}><Groups /></Suspense> },
          { path: "groups/:id", element: <Suspense fallback={<Loading />}><GroupDetails /></Suspense> },
          { path: "chat", element: <Suspense fallback={<Loading />}><Chat /></Suspense> },
          { path: "chat/group/:id", element: <Suspense fallback={<Loading />}><Chat /></Suspense> },
          { path: "chat/course/:id", element: <Suspense fallback={<Loading />}><Chat /></Suspense> },
          { path: "notifications", element: <Suspense fallback={<Loading />}><Notifications /></Suspense> },
          { path: "profile", element: <Suspense fallback={<Loading />}><Profile /></Suspense> },
          { path: "analytics", element: <Suspense fallback={<Loading />}><Analytics /></Suspense> },
          { path: "settings", element: <Suspense fallback={<Loading />}><Settings /></Suspense> },
          { path: "search", element: <Suspense fallback={<Loading />}><SearchResults /></Suspense> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute role="admin" />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <Suspense fallback={<Loading />}><AdminDashboard /></Suspense> },
          { path: "notifications", element: <Suspense fallback={<Loading />}><Notifications /></Suspense> },
          { path: "profile", element: <Suspense fallback={<Loading />}><Profile /></Suspense> },
          { path: "analytics", element: <Suspense fallback={<Loading />}><Analytics /></Suspense> },
          { path: "settings", element: <Suspense fallback={<Loading />}><Settings /></Suspense> },
          { path: "search", element: <Suspense fallback={<Loading />}><SearchResults /></Suspense> },
        ],
      },
    ],
  },
  {
    path: "/app",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <Suspense fallback={<Loading />}><NotFound /></Suspense>,
  },
]);

