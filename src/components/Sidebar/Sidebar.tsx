import { Link, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { routes } from "../../utils/routes";
import axios from "axios";
import { toast } from "react-toastify";

type MenuLink = {
  path: string;
  icon: string;
  label: string;
};

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  topLinks: MenuLink[];
};

const Sidebar = (props: SidebarProps) => {
  const { isOpen, toggleSidebar, topLinks = [] } = props;
  const navigate = useNavigate();
  const topLinksFiltered = topLinks.filter(link => link.label !== "Beállítások");
  const bottomLink = topLinks.find(link => link.label === "Beállítások");
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
    <div className={styles.sidebarContainer}>
      <i
        className={`ri-${isOpen ? "close-line" : "menu-3-line"}`}
        onClick={toggleSidebar}
      ></i>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>StudentHive</h1>
          </div>
          <div className={styles.menuList}>
            <div className={styles.top}>
              {topLinksFiltered.map((link, index) => (
                <div key={index} className={styles.menuItem}>
                  <Link className={styles.link} to={link.path}>
                    <img src={link.icon} alt={link.label} />
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            <div className={styles.bottom}>
              {bottomLink && (
                <div className={styles.menuItem}>
                  <Link className={styles.link} to={bottomLink.path}>
                    <img src={bottomLink.icon} alt={bottomLink.label} />
                    {bottomLink.label}
                  </Link>
                </div>
              )}
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.homePage.path}>
                  <img src="/home.png" alt="home icon" />
                  Vissza a kezdőlapra
                </Link>
              </div>
              <div className={styles.menuItem}>
                <button onClick={handleLogout}>
                  <img src="/logout.png" alt="Logout" />
                  Kijelentkezés
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
