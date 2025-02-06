import { useState } from "react";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { agentMenuLinks } from "../../../utils/routes";
import styles from "./AgentShift.module.css";

const AgentShift = () => {
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
        <DashboardTitle title="Műszak Kezelése" icon="./timetable.png" subTitle="Műszak Kezelése"/>
        <div className={styles.settingsContent}>

        </div>
      </div>
    </div>
  );
};

export default AgentShift