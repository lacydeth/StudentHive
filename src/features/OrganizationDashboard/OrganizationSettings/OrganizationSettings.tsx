import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { orgMenuLinks } from "../../../utils/routes";
import styles from "./OrganizationSettings.module.css"
import { useState } from "react";


const SettingsAgents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Iskolaszövetkezet beállítások" icon="./settings.png" subTitle="Iskolaszövetkezet beállítások"/>
        <div className={styles.settingsContent}>

        </div>
      </div>
    </div>
  );
};

export default SettingsAgents