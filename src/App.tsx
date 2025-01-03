import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/Login/Login'; 
import LandingPage from './features/Index/Index'
import Register from './features/Register/Register'
import Navbar from './components/Navbar/Navbar';
import ProtectedPage from './features/ProtectedPage/ProtectedPage';

export const routes = {
  "homePage": { path: "/", title: "Home" },
  "loginPage": { path: "/login", title: "Login" }, 
  "registerPage": {path: "/register", title: "Register"},
  "protectedPage": {path: "/test", title: "Teszt"}
}

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path={routes.loginPage.path} element={<Login/>} />
        <Route path={routes.registerPage.path} element={<Register/>} />
        <Route path={routes.homePage.path} element={<LandingPage/>} />
        <Route path={routes.protectedPage.path} element={<ProtectedPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
