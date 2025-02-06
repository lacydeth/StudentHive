import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { agentMenuLinks } from "../../../utils/routes";
import styles from "./AgentSettings.module.css"
import { useState } from "react";


const AgentSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Közvetítői beállítások" icon="./settings.png" subTitle="Közvetítői beállítások"/>
        <div className={styles.settingsContent}>

        </div>
      </div>
    </div>
  );
};

export default AgentSettings