import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./AdminSettings.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import { routes } from "../../../utils/routes";

const AdminSettings = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
  const adminTopLinks = [
    { path: routes.adminPage.path, icon: "./dashboard.png", label: "Kezelőpult" },
    { path: routes.newOrgPage.path, icon: "./more.png", label: "Szövetkezet felvétele" },
    { path: routes.existingOrgPage.path, icon: "./people.png", label: "Meglévő szövetkezetek" },
    { path: routes.adminSettings.path, icon: "./settings.png", label: "Beállítások" },
  ];
  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={adminTopLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Profil beállítások" icon="./settings.png" subTitle="Profil beállítások"/>
        <div className={styles.settingsContent}>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
