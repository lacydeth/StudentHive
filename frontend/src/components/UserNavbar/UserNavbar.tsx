import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";
import axios from "axios";
import { toast } from "react-toastify";

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [profile, setProfile] = useState<{ firstName: string; lastName: string } | null>(null);
  const navigate = useNavigate();
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
            <Link to={routes.worksPage.path} className="btn" onClick={closeMenu}>
              Munkák
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
