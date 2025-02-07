import { useEffect, useState } from "react";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { agentMenuLinks } from "../../../utils/routes";
import styles from "./AgentJobs.module.css";
import AgentCard, { WorkCardProps } from "../../../components/AgentCard/AgentCard";
import { getUserIdFromToken } from "../../../utils/authUtils";
import axios from "axios";

const AgentJobs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [workCards, setWorkCards] = useState<WorkCardProps[]>([]);

  const fetchAgentWorkCards = async () => {
    const agentId = getUserIdFromToken();
    try {
      const response = await axios.get(`https://localhost:7067/api/agent/agent-work-cards?agentId=${agentId}`);

      const mappedWorkCards = response.data.map((card: any) => ({
        id: card.id || card.Id,
        title: card.title || card.Title,
        agentName: card.agentName || card.AgentName,
        location: card.location || card.Location,
        category: card.category || card.Category,
        image: card.image || card.Image,
      }));
      setWorkCards(mappedWorkCards);
    } catch (error) {
      console.error("Error fetching agent work cards:", error);
    }
  };
  
  useEffect(() => {
    fetchAgentWorkCards();
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Munkák" icon="./job-description.png" subTitle="Munkák"/>
        <div className={styles.jobsContainer}>
          <div className={styles.jobsWrapper}>
            {workCards.map((card) => (
              <AgentCard
                key={card.id}
                {...card}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentJobs;