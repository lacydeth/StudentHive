import { Link } from "react-router-dom";
import styles from "./sidebarOrg.module.css";
import { routes } from "../../App";
import { handleLogout } from "../../utils/authUtils";

type SidebarProps = {
    isOpen: boolean;
    toggleSidebar: () => void;
  }
const SidebarOrg = (props: SidebarProps) => {
  return (
    <div className={styles.sidebarContainer}>
      {/* Sidebar toggle button */}
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
                <Link className={styles.link} to={routes.orgPage.path}>
                  <img src="./dashboard.png" alt="Dashboard" />
                  Kezelőpult
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.orgAddAgent.path}>
                  <img src="./more.png" alt="Add Cooperative" />
                  Közvetítő felvétele
                </Link>
              </div>
              

              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.orgCurrentAgent.path}>
                  <img src="./people.png" alt="Existing Cooperatives" />
                  Meglévő Közvetítők
                </Link>
              </div>
            </div>
            <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.addNewJob.path}>
                  <img src="./more.png" alt="Add Cooperative" />
                  Munka létrehozása
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.currentJobs.path}>
                  <img src="./job.png" alt="Add Cooperative" />
                  Jelenlegi Munkák
                </Link>
              </div>

            <div className={styles.bottom}>
              <div className={styles.menuItem}>
                <Link className={styles.link} to={routes.orgSettings.path}>
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

export default SidebarOrg