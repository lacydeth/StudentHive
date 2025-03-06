import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/Login/Login';
import Register from './features/Register/Register';
import AOS from "aos";
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import AdminDashboard from './features/AdminDashboard/AdminDashboardView/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import IndexPage from './features/Index/Index';
import OrganizationDashboard from './features/OrganizationDashboard/OrganizationDashboard/OrganizationDashboard';
import AddAgents from './features/OrganizationDashboard/AddAgents/AddAgents';
import CurrentAgents from './features/OrganizationDashboard/CurrentAgents/CurrentAgents';
import SettingsAgents from './features/OrganizationDashboard/OrganizationSettings/OrganizationSettings';
import AgentDashboard from './features/AgentDashboard/AgentDashboard';
import NewOrg from './features/AdminDashboard/NewOrg/NewOrg';
import ExistingOrg from './features/AdminDashboard/ExistingOrg/ExistingOrg';
import NewJob from './features/OrganizationDashboard/NewJob/NewJob';

import AdminSettings from './features/AdminDashboard/AdminSettings/AdminSettings';
import CurrentJobs from './features/OrganizationDashboard/CurrentJobs/CurrentJobs';
import { routes } from './utils/routes';
import Works from './features/Works/Works';
import WorkPage from './components/WorkPage/WorkPage';
import NotFound from './pages/NotFound/NotFound';
import UserDashboard from './features/UserDashboard/UserDashboardView/UserDashboard';
import StudentApplications from './features/AgentDashboard/StudentApplications/StudentApplications';
import AgentSettings from './features/AgentDashboard/AgentSettings/AgentSettings';
import AgentStudentList from './features/AgentDashboard/AgentStudentList/AgentStudentList';
import AgentJobs from './features/AgentDashboard/AgentJobs/AgentJobs';
import ShiftPage from './components/ShiftPage/ShiftPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './features/UserDashboard/UserProfile/UserProfile';
import UserJobs from './features/UserDashboard/UserJobs/UserJobs';
import UserShiftPage from './components/UserShiftPage/UserShiftPage';
import ShiftApplications from './components/ShiftApplications/ShiftApplications';
import UserApplications from './features/UserDashboard/UserApplications/UserApplications';
import UserManageShifts from './features/UserDashboard/UserManageShifts/UserManageShifts';

const App = () => {
  useEffect(() => {
    AOS.init({})
  })
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path={routes.homePage.path} element={<IndexPage />} />
          <Route path={routes.loginPage.path} element={<Login />} />
          <Route path={routes.registerPage.path} element={<Register />} />
          <Route path={routes.worksPage.path} element={<Works />} />
          <Route path={routes.workPage.path} element={<WorkPage />} />
          <Route path={routes.unauthorized.path} element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* User protected routes */}
          <Route
            path={routes.userPage.path}
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.userShifts.path}
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserManageShifts />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.userProfile.path}
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.userJobs.path}
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.manageShiftsPage.path}
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserShiftPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.userApplications.path}
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <UserApplications/>
              </ProtectedRoute>
            }
          />
          {/* Admin protected routes */}
          <Route
            path={routes.adminPage.path}
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.newOrgPage.path}
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <NewOrg />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.existingOrgPage.path}
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ExistingOrg />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.adminSettings.path}
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          {/* Organization protected routes */}
          <Route
            path={routes.orgPage.path}
            element={
              <ProtectedRoute allowedRoles={["Organization"]}>
                <OrganizationDashboard />
              </ProtectedRoute>
            } />
          <Route
            path={routes.orgAddAgent.path}
            element={
              <ProtectedRoute allowedRoles={["Organization"]}>
                <AddAgents/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.orgCurrentAgent.path}
            element={
              <ProtectedRoute allowedRoles={["Organization"]}>
                <CurrentAgents/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.orgCurrentAgent.path}
            element={
              <ProtectedRoute allowedRoles={["Organization"]}>
                <CurrentAgents/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.orgSettings.path}
            element={
              <ProtectedRoute allowedRoles={["Organization"]}>
                <SettingsAgents/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.addNewJob.path}
            element={
              <ProtectedRoute allowedRoles={["Organization"]}>
                <NewJob/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.currentJobs.path}
            element={
              <ProtectedRoute allowedRoles={["Organization"]}>
                <CurrentJobs/>
              </ProtectedRoute>
            }
          />
          {/* Agent protected routes */}
          <Route
            path={routes.agentPage.path}
            element={
              <ProtectedRoute allowedRoles={["Agent"]}>
                <AgentDashboard/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.studentApplications.path}
            element={
              <ProtectedRoute allowedRoles={["Agent"]}>
                <StudentApplications/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.shiftPage.path}
            element={
              <ProtectedRoute allowedRoles={["Agent"]}>
                <ShiftPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.agentStudentList.path}
            element={
              <ProtectedRoute allowedRoles={["Agent"]}>
                <AgentStudentList/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.agentSettings.path}
            element={
              <ProtectedRoute allowedRoles={["Agent"]}>
                <AgentSettings/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.agentJobs.path}
            element={
              <ProtectedRoute allowedRoles={["Agent"]}>
                <AgentJobs/>
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.shiftApplications.path}
            element={
              <ProtectedRoute allowedRoles={["Agent"]}>
                <ShiftApplications/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
