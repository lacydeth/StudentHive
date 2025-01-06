import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../App";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={`navbar ${isMenuOpen ? "show" : ""}${isSticky? 'sticky' : ''}`}>
      <div className="content">
        <div className="logo">
          <Link to={routes.homePage.path} className="btn" onClick={closeMenu}>
            <img src="./website-logo.png" alt="Weboldal logója."></img>
          </Link>
        </div>
        <ul className="menu-list">
          <div className="icon cancel-btn" onClick={toggleMenu}>
            <i className="ri-close-line"></i>
          </div>
          <li>
            <Link to={routes.homePage.path} className="btn" onClick={closeMenu}>
              Főoldal
            </Link>
          </li>
          <li>
            <Link to={routes.registerPage.path} className="btn" onClick={closeMenu}>
              Rólunk
            </Link>
          </li>
          <li>
            <Link to={routes.registerPage.path} className="btn" onClick={closeMenu}>
              Regisztráció
            </Link>
          </li>
          <li>
            <Link to={routes.loginPage.path} className="btn login-btn" onClick={closeMenu}>
              Bejelentkezés
            </Link>
          </li>
        </ul>
        <div
          className={`icon menu-btn ${isMenuOpen ? "hide" : ""}`}
          onClick={toggleMenu}
        >
          <i className="ri-menu-3-line"></i>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
