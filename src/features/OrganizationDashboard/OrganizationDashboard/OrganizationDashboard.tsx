import { useState } from "react";
import styles from "./OrganizationDashboard.module.css";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { orgMenuLinks } from "../../../utils/routes";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Title from "../../../components/Title/Title";

const OrganizationDashboard = () => {
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
        <DashboardTitle title="Iskolaszövetkezet kezelőpult" icon="./dashboard.png" subTitle="Iskolaszövetkezet kezelőpult" />
        <div className={styles.dashboardContent}>
          <Title subTitle="Vezérlőpult" title="Tekintsd meg a legfrissebb statisztikákat!"/>
            <div className={styles.dashboardWrapper}>
            </div>
          </div>  
      </div>
    </div>
  );
};

export default OrganizationDashboard