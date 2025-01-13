import SidebarOrg from "../../../components/SidebarOrg/SidebarOrg"
import styles from "./SettingAgents.module.css"
import { useState } from "react";


const SettingsAgents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <SidebarOrg isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <h1>Hello!</h1>
      </div>
    </div>
  );
};

export default SettingsAgents