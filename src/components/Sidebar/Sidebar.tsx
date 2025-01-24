import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { handleLogout } from "../../utils/authUtils";
import { routes } from "../../utils/routes";

type SidebarProps = {
    isOpen: boolean;
    toggleSidebar: () => void;
  }
const Sidebar = (props: SidebarProps) => {

  return (
    <div className={styles.sidebarContainer}>
      <i
        className={`ri-${props.isOpen ? "close-line" : "menu-3-line"}`}
        onClick={props.toggleSidebar}
      ></i>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${props.isOpen ? styles.open : styles.closed}`}>
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>StudentHive</h1>
          </div>
          <div className={styles.menuList}>
            <div className={styles.top}>
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.adminPage.path}>
                  <img src="./dashboard.png" alt="Dashboard" />
                  Kezelőpult
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.newOrgPage.path}>
                  <img src="./more.png" alt="Add Cooperative" />
                  Szövetkezet felvétele
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.existingOrgPage.path}>
                  <img src="./people.png" alt="Existing Cooperatives" />
                  Meglévő szövetkezetek
                </Link>
              </div>
            </div>

            <div className={styles.bottom}>
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.adminSettings.path}>
                  <img src="./settings.png" alt="Settings" />
                  Beállítások
                </Link>
              </div>
              <div className={styles.menuItem}>
                <button onClick={handleLogout}>
                  <img src="./logout.png" alt="Logout" />
                  kijelentkezés
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
