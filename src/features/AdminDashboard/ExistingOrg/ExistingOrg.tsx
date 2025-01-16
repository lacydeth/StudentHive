import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./ExistingOrg.module.css"
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";

const ExistingOrg = () => {

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
        <DashboardTitle title="Meglévő szövetkezetek" icon="./people.png" subTitle="Meglévő szövetkezetek"/>
        <div className={styles.existingOrgContent}>
          <Title
            subTitle="Meglévő szövetkezetek"
            title="Tekintsd meg és módosítsd a szövetkezetek adatait!"
          />

        </div>
      </div>
    </div>
  );
}

export default ExistingOrg