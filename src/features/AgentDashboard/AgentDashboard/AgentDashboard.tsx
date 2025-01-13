import SidebarAgent from "../../../components/SidebarAgent/SidebarAgent";
import styles from "./AgentDashboard.module.css"
import { useState } from "react"


const AgentDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    return (
      <div className={styles.container}>
        <SidebarAgent isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
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

export default AgentDashboard