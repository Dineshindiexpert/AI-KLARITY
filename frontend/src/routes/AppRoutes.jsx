import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from '../pages/dashboard/Dashboard'
import GrowthAnalytic from '../pages/growthAnalytics/GrowthAnalytics'
import ResumeAnalyzer from '../pages/resumeAnalyzer/ResumeAnalyzer'
import Settings from '../pages/settings/Settings'
import Login from "../pages/auth/Login";
import MainLayout from '../components/layout/Layout'
import InterviewSession from "../pages/interviewSession/InterviewSession";
import Notfound from '../pages/notfound/notfound'
import Register from "../pages/auth/Register";
import InterviewLanding from "../pages/interviewSession/InterviewLanding";
import InterviewReport from '../pages/interviewSession/InterviewReport';

export const routes = createBrowserRouter([

  {
    path: "/signin",
    element: <Login />
  },
  {
    path :'/register',
    element : <Register/>
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

    children: [
      { path: "", element: <Dashboard /> },
      { path: "growthAnalytics", element: <GrowthAnalytic /> },
      { path: "Interview", element: <InterviewLanding /> },
      { path: "interview/live", element: <InterviewSession /> },
      { path: "resumeAnalyzer", element: <ResumeAnalyzer /> },
      { path: "setting", element: <Settings /> },
      {path: "interview/report", element :<InterviewReport/>}
    ]
  },

  {
    path: "*",
    element: <Notfound />
  }

]);