import { useNavigate } from "react-router-dom";
import styles from "./WorkCard.module.css";

type WorkCardProps = {
  id: number;
  title: string;
  salary: string;
  location: string;
  category: string;
  image: string;
};

const WorkCard = ({ id, title, salary, location, category, image }: WorkCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/works/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.top}>
        <img src={image} alt="Job category" />
        <div className={styles.textOverlay}>
          <h2>{title}</h2>
          <h3>{salary}</h3>
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
          <span className={styles.type}>Diákmunka</span>
          <button className={styles.btn} onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            <img src="/next.png" alt="Next" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
