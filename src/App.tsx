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
import AgentDashboard from './features/AgentDashboard/AgentDashboard/AgentDashboard';
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
import StudentApplications from './features/AgentDashboard/AgentDashboard/StudentApplications/StudentApplications';
import AgentSettings from './features/AgentDashboard/AgentDashboard/AgentSettings/AgentSettings';

const App = () => {
  useEffect(() => {
    AOS.init({})
  })
  return (
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
          path={routes.protectedPage.path}
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <UserDashboard />
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
          path={routes.studentApplications.path}
          element={
            <ProtectedRoute allowedRoles={["Agent"]}>
              <StudentApplications/>
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
      </Routes>
    </Router>
  );
};

export default App;
