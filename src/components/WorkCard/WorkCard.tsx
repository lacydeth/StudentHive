import styles from "./WorkCard.module.css";

type WorkCardProps = {
  title: string;
  salary: string;
  location: string;
  category: string;
  image: string;
}

const WorkCard = ({ title, salary, location, category, image }: WorkCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <img src={image} alt="Job category" />
        <div className={styles.textOverlay}>
          <h2>{title}</h2>
          <h3>{salary}</h3>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.detail}>
          <img src="./location.png" alt="Location icon" /> {location}
        </div>
        <div className={styles.detail}>
          <img src="./list.png" alt="Category icon" /> {category}
        </div>
        <button className={styles.btn}>megtekintés</button>
      </div>
    </div>
  );
};

export default WorkCard;
