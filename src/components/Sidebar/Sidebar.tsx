import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { handleLogout } from "../../utils/authUtils";
import { routes } from "../../utils/routes";

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

  const topLinksFiltered = topLinks.filter(link => link.label !== "Beállítások");
  const bottomLink = topLinks.find(link => link.label === "Beállítások");

  return (
    <div className={styles.sidebarContainer}>
      <i
        className={`ri-${isOpen ? "close-line" : "menu-3-line"}`}
        onClick={toggleSidebar}
      ></i>

      {/* Sidebar */}
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
