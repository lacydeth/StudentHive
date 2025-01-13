import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/Login/Login';
import Register from './features/Register/Register';
import AOS from "aos";
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import ProtectedPage from './features/UserDashboard/UserDashboard';
import AdminDashboard from './features/AdminDashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import IndexPage from './features/Index/Index';
import OrganizationDashboard from './features/OrganizationDashboard/OrganizationDashboard/OrganizationDashboard';
import AddAgents from './features/OrganizationDashboard/AddAgents/AddAgents';
import CurrentAgents from './features/OrganizationDashboard/CurrentAgents/CurrentAgents';
import SettingsAgents from './features/OrganizationDashboard/SettingsAgents/SettingsAgents';
import StuddentShift from './features/AgentDashboard/StudentShift/StudentShift';
import StudentsList from './features/AgentDashboard/StudentsList/StudentsList';
import AgentSettings from './features/AgentDashboard/AgentSettings/AgentSettings';
import AgentDashboard from './features/AgentDashboard/AgentDashboard/AgentDashboard';
import StudentApply from './features/AgentDashboard/StudentApply.tsx/StudentApply';

export const routes = {
  homePage: { path: '/', title: 'Home' },
  loginPage: { path: '/login', title: 'Login' },
  registerPage: { path: '/register', title: 'Register' },
  protectedPage: { path: '/user', title: 'User' },
  adminPage: { path: '/admin', title: 'Admin' },
  orgPage: { path: '/organization', title: 'Organization' },
  orgAddAgent: { path: '/addagents', title: 'Add Agents' },
  orgSettings: { path: '/orgsettings', title: 'Organization settings' },
  orgCurrentAgent: { path: '/currentagents', title: 'Current Agents' },
  AgentPage: { path: '/agent', title: 'Agent' },
  AgentSettings: { path: '/agentsettings', title: 'Agent Settings' },
  StudentApply: { path: '/studentapply', title: 'Student Apply' },
  StudentShifts: { path: '/studentshifts', title: 'Student Shifts' },
  StudentsList: { path: '/studentsList', title: 'Students list' },
  unauthorized: { path: '/unauthorized', title: 'Unauthorized' },
};

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
        <Route path={routes.unauthorized.path} element={<Unauthorized />} />


        <Route
          path={routes.protectedPage.path}
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <ProtectedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.adminPage.path}
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
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
          path={routes.orgSettings.path}
          element={
            <ProtectedRoute allowedRoles={["Organization"]}>
              <SettingsAgents/>
            </ProtectedRoute>
          }
        />
         <Route
          path={routes.StudentShifts.path}
          element={
            <ProtectedRoute allowedRoles={["Organization"]}>
              //Agent kell legyen a role tesztelésből átállitom
              <StuddentShift/>
            </ProtectedRoute>
          }
        />
         <Route
          path={routes.StudentsList.path}
          element={
            <ProtectedRoute allowedRoles={["Organization"]}>
              //Agent kell legyen a role tesztelésből átállitom
              <StudentsList/>
            </ProtectedRoute>
          }
        />
         <Route
          path={routes.AgentSettings.path}
          element={
            <ProtectedRoute allowedRoles={["Organization"]}>
              //Agent kell legyen a role tesztelésből átállitom
              <AgentSettings/>
            </ProtectedRoute>
          }
        />
         <Route
          path={routes.AgentPage.path}
          element={
            <ProtectedRoute allowedRoles={["Organization"]}>
              //Agent kell legyen a role tesztelésből átállitom
              <AgentDashboard/>
            </ProtectedRoute>
          }
        />
         <Route
          path={routes.StudentApply.path}
          element={
            <ProtectedRoute allowedRoles={["Organization"]}>
              //Agent kell legyen a role tesztelésből átállitom
              <StudentApply/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
