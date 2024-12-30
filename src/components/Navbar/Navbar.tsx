import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../App";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`navbar ${isMenuOpen ? "show" : ""}`}>
      <div className="content">
        <div className="logo">
          <Link to={routes.homePage.path} className="btn">StudentHive</Link>
        </div>
        <ul className="menu-list">
          <div className="icon cancel-btn" onClick={toggleMenu}>
            <i className="ri-close-line"></i>
          </div>
          <li>
          <Link to={routes.homePage.path} className="btn">Főoldal</Link>
          </li>
          <li>
            <Link to={routes.registerPage.path} className="btn">Rólunk</Link>
          </li>
          <li>
            <Link to={routes.registerPage.path} className="btn">Regisztráció</Link>
          </li>
          <li>
            <Link to={routes.loginPage.path} className="btn login-btn">Bejelentkezés</Link>
          </li>
        </ul>
        <div className={`icon menu-btn ${isMenuOpen ? "hide" : ""}`} onClick={toggleMenu}>
          <i className="ri-menu-3-line"></i>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
