import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRoleFromToken } from "../../utils/authUtils";
import { roleRoutes, routes } from "../../utils/routes";
import websiteLogo from "/logo.png"
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      const response = await axios.post("https://localhost:7067/api/auth/logout");

      if (response.status === 200) {
        localStorage.removeItem("token");
        toast.success("Sikeres kijelentkezés!");
        navigate("/login");
      } else {
        toast.error("Sikertelen kijelentkezés!");
      }
    } catch (error) {
      toast.error("Hiba történt a kijelentkezés közben!");
      console.error("Kijelentkezési hiba:", error);
    }
  };
  return (
    <div className={`navbar ${isMenuOpen ? "show" : ""}${isSticky ? "sticky" : ""}`}>
      <div className="content">
        <div className="logo">
          <Link to={routes.homePage.path} className="btn" onClick={closeMenu}>
            <img src={websiteLogo} alt="Weboldal logója" />
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
            <Link to={routes.worksPage.path} className="btn" onClick={closeMenu}>
              Munkák
            </Link>
          </li>
          <li>
            <Link to={routes.contactPage.path} className="btn" onClick={closeMenu}>
              Kapcsolat
            </Link>
          </li>
          {userRole ? (
            <>
              <li>
                <Link 
                  to={roleRoutes[userRole] || "/"} 
                  className="btn" 
                  onClick={closeMenu}
                >
                  Profil
                </Link>
              </li>

              <li>
                <i onClick={handleLogout} className="btn ri-logout-box-r-line"></i>
              </li>
            </>
          ) : (
            <>
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
