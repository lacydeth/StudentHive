import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./AgentDashboard.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from "axios";
import Title from "../../../components/Title/Title";
import { agentMenuLinks } from "../../../utils/routes";

const AgentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [totalOrganizations, setTotalOrganizations] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const totalDataResponse = await axios.get("https://localhost:7067/api/admin/total-organizations-and-users");
        setTotalOrganizations(totalDataResponse.data.totalOrganizations);
        setTotalUsers(totalDataResponse.data.totalUsers);

        const userRegistrationsResponse = await axios.get("https://localhost:7067/api/admin/users-by-month");

        const mappedUserRegistrations = userRegistrationsResponse.data.map((item: any) => ({
          month: `${item.year}-${item.month < 10 ? '0' : ''}${item.month}`,
          registrations: item.userCount
        }));

        setUserRegistrations(mappedUserRegistrations);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Közvetítő kezelőpult" icon="./dashboard.png" subTitle="Közvetítő kezelőpult" />
        <div className={styles.dashboardContent}>
          <Title subTitle="Vezérlőpult" title="Tekintsd meg a legfrissebb statisztikákat!"/>
          <div className={styles.dashboardWrapper}>
            <div className={styles.column}>
              <div className={styles.cardContainer}>
                <div className={styles.infoCard}>
                  <h3>Iskolaszövetkezetek</h3>
                  <p>{totalOrganizations !== null ? totalOrganizations : 'Betöltés...'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h3>Felhasználók</h3>
                  <p>{totalUsers !== null ? totalUsers : 'Betöltés...'}</p>
                </div>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.chart}>
                <h3>Felhasználói regisztációk száma hónapok szerint</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={userRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" name="Regisztrációk száma" dataKey="registrations" stroke="var(--smoothGreen)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
