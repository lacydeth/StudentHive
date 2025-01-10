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

export const routes = {
  homePage: { path: '/', title: 'Home' },
  loginPage: { path: '/login', title: 'Login' },
  registerPage: { path: '/register', title: 'Register' },
  protectedPage: { path: '/user', title: 'User' },
  adminPage: { path: '/admin', title: 'Admin'},
  unauthorized: { path: '/unauthorized', title: 'Unauthorized'}
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
      </Routes>
    </Router>
  );
};

export default App;
