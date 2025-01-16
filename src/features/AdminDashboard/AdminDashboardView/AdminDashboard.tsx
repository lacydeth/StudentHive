import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./AdminDashboard.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";

const AdminDashboard = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        <DashboardTitle title="Admin kezelőpult" icon="./dashboard.png" subTitle="Admin kezelőpult"/>
        <div className={styles.newOrgContent}>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
