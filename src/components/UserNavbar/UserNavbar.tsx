import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleLogout } from "../../utils/authUtils";
import { routes } from "../../utils/routes";
import axios from "axios";

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [profile, setProfile] = useState<{ firstName: string; lastName: string } | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("https://localhost:7067/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Hiba az adatok lekérdezése közben:", error);
    }
  };

  useEffect(() => {
    handleProfile();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className={`navbar ${isMenuOpen ? "show" : ""} ${isSticky ? "sticky" : ""}`}>
      <div className="content">
        <div className="user">
          <img className="profile" src="/user.png" alt="user icon" />
          <h2>{profile ? `${profile.lastName} ${profile.firstName}` : "Betöltés..."}</h2>
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
            <Link to={routes.userJobs.path} className="btn" onClick={closeMenu}>
              Munkahelyeim
            </Link>
          </li>
          <li>
            <Link to={routes.userApplications.path} className="btn" onClick={closeMenu}>
              Jelentkezéseim
            </Link>
          </li>
          <li>
            <Link to={routes.userProfile.path} className="btn" onClick={closeMenu}>
              Adataim
            </Link>
          </li>
          <li>
            <i onClick={handleLogout} className="btn ri-logout-box-r-line"></i>
          </li>
        </ul>
        <div className={`icon menu-btn ${isMenuOpen ? "hide" : ""}`} onClick={toggleMenu}>
          <i className="ri-menu-3-line"></i>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
