import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./AdminSettings.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";

const AdminSettings = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
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
