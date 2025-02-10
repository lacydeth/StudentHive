import { useNavigate } from "react-router-dom";
import styles from "./AgentCard.module.css";

export type WorkCardProps = {
  id: number;
  title: string;
  agentName: string;
  location: string;
  category: string;
  image: string;
};

const AgentCard = ({ id, title, agentName, location, category, image }: WorkCardProps) => {
  const navigate = useNavigate();

  const handleShifts = () => {
    navigate(`/shift/${id}`);
  };
  const handleShiftApplications = () => {
    navigate(`/shift-application/${id}`);
  };
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <img src={image} alt="Job category" />
        <div className={styles.textOverlay}>
          <h2>{title}</h2>
          <h3>{agentName}</h3>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.detail}>
          <img src="/location.png" alt="Location icon" /> {location}
        </div>
        <div className={styles.detail}>
          <img src="/list.png" alt="Category icon" /> {category}
        </div>
        <div className={styles.bottomEnd}>
            <button className={styles.btn} onClick={(e) => { e.stopPropagation(); handleShifts(); }}>
                Műszak hozzáadása
            </button>
            <button className={styles.btn} onClick={(e) => { e.stopPropagation(); handleShiftApplications(); }}>
                Jelentkezések
            </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
