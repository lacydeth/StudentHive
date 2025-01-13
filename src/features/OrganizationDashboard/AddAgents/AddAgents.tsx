import SidebarOrg from "../../../components/SidebarOrg/SidebarOrg";
import { useState } from "react";
import styles from "./AddAgents.module.css"

const AddAgents = () => {
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

export default AddAgents