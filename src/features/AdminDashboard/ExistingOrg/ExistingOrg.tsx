import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./ExistingOrg.module.css"

const ExistingOrg = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}>
        <div className={styles.current}>

        </div>
      </div>
    </div>
  )
}

export default ExistingOrg