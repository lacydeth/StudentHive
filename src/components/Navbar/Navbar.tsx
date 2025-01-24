import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoleFromToken } from "../../utils/authUtils";
import { routes } from "../../utils/routes";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the user role from the token
    const role = getRoleFromToken();
    setUserRole(role);
  }, []);

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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={`navbar ${isMenuOpen ? "show" : ""}${isSticky ? "sticky" : ""}`}>
      <div className="content">
        <div className="logo">
          <Link to={routes.homePage.path} className="btn" onClick={closeMenu}>
            <img src="./website-logo.png" alt="Weboldal logója." />
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
              Munkák
            </Link>
          </li>

          {userRole ? (
            <li>
              <Link
                to={userRole === "User" ? "/user" : userRole === "Admin" ? "/admin" : "/organization"}
                className="btn highlighted"
                onClick={closeMenu}
              >
                Profil
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to={routes.registerPage.path} className="btn" onClick={closeMenu}>
                  Regisztráció
                </Link>
              </li>
              <li>
                <Link to={routes.loginPage.path} className="btn highlighted" onClick={closeMenu}>
                  Bejelentkezés
                </Link>
              </li>
            </>
          )}
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
