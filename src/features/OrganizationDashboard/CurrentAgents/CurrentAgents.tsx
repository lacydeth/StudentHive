import Sidebar from "../../../components/Sidebar/Sidebar";
import { orgMenuLinks } from "../../../utils/routes";
import styles from "./CurrentAgents.module.css"
import { useState } from "react";


const CurrentAgents = () => {
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
        <h1>Hello!</h1>
      </div>
    </div>
  );
};

export default CurrentAgents