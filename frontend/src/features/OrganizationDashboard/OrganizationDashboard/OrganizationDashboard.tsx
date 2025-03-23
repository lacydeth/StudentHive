import { useEffect, useState } from "react";
import styles from "./OrganizationDashboard.module.css";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { orgMenuLinks } from "../../../utils/routes";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Title from "../../../components/Title/Title";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from "axios";
import { getUserIdFromToken } from "../../../utils/authUtils"; // adjust the path as needed

const OrganizationDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [totalJobs, setTotalJobs] = useState<number | null>(null);
  const [jobsCreated, setJobsCreated] = useState<any[]>([]);

  const orgIdFromToken = getUserIdFromToken();
  const orgId = orgIdFromToken ? parseInt(orgIdFromToken, 10) : null;

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!orgId) {
      console.error("No organization id available from token.");
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        const totalDataResponse = await axios.get(`https://localhost:7067/api/organization/total-students-and-jobs/${orgId}`);
        setTotalJobs(totalDataResponse.data.totalJobs);
        setTotalStudents(totalDataResponse.data.totalStudents);

        const jobsCreatedResponse = await axios.get(`https://localhost:7067/api/organization/jobs-created-by-month/${orgId}`);
        const mappedJobsCreated = jobsCreatedResponse.data.map((item: any) => ({
          month: `${item.year}-${item.month < 10 ? '0' : ''}${item.month}`,
          registrations: item.userCount
        }));

        setJobsCreated(mappedJobsCreated);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [orgId]);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <DashboardTitle 
          title="Iskolaszövetkezet kezelőpult" 
          icon="./dashboard.png" 
          subTitle="Iskolaszövetkezet kezelőpult" 
        />
        <div className={styles.dashboardContent}>
          <Title subTitle="Vezérlőpult" title="Tekintsd meg a legfrissebb statisztikákat!" />
          <div className={styles.dashboardWrapper}>
            <div className={styles.column}>
              <div className={styles.cardContainer}>
                <div className={styles.infoCard}>
                  <h3>Csatlakozott diákok</h3>
                  <p>{totalStudents !== null ? totalStudents : 'Betöltés...'}</p>
                </div>
                <div className={styles.infoCard}>
                  <h3>Létrehozott munkák</h3>
                  <p>{totalJobs !== null ? totalJobs : 'Betöltés...'}</p>
                </div>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.chart}>
                <h3>Szövetkezet által létrehozott munkák havi bontásban</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={jobsCreated}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Munkák száma" 
                      dataKey="registrations" 
                      stroke="var(--smoothGreen)" 
                      activeDot={{ r: 8 }} 
                    />
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

export default OrganizationDashboard;
