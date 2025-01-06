import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/Login/Login';
import LandingPage from './features/Index/Index';
import Register from './features/Register/Register';
import AOS from "aos";
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import ProtectedPage from './features/ProtectedPage/ProtectedPage';

export const routes = {
  homePage: { path: '/', title: 'Home' },
  loginPage: { path: '/login', title: 'Login' },
  registerPage: { path: '/register', title: 'Register' },
  protectedPage: { path: '/test', title: 'Teszt' }
};

const App = () => {
  useEffect(() => {
    AOS.init({})
  })
  return (
    <Router>
      <Routes>
        <Route path={routes.homePage.path} element={<LandingPage />} />
        <Route path={routes.loginPage.path} element={<Login />} />
        <Route path={routes.registerPage.path} element={<Register />} />
        <Route path={routes.protectedPage.path} element={<ProtectedPage />} />
      </Routes>
    </Router>
  );
};

export default App;
