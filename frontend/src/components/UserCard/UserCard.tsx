import { useNavigate } from "react-router-dom";
import styles from "./UserCard.module.css";

export type UserCardProps = {
  jobId: number;
  title: string;
  city: string;
  address: string;
  hourlyRate: string;
  imagePath: string;
  organizationName: string;
  categoryName: string;
  agentName: string;
};

const UserCard = ({jobId, title, city,address,imagePath,categoryName, agentName,}: UserCardProps) => {
  const navigate = useNavigate();

  const handleShifts = () => {
    navigate(`/manage-shifts/${jobId}`);
  };
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <img src={imagePath || "/default-job.jpg"} alt="Job category" />
        <div className={styles.textOverlay}>
          <h2>{title}</h2>
          <h3>{agentName || "Nincs kijelölt közvetítő"}</h3>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.detail}>
          <img src="/location.png" alt="Location icon" /> {city}, {address}
        </div>
        <div className={styles.detail}>
          <img src="/list.png" alt="Category icon" /> {categoryName}
        </div>
        <div className={styles.bottomEnd}>
          <button className={styles.btn} onClick={(e) => {e.stopPropagation(); handleShifts();}}>
            Műszak felvétele
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
