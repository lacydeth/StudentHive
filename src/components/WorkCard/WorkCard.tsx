import styles from "./WorkCard.module.css"

const WorkCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <img src="./categories/aruhazi-munka.jpg" alt="Job category" />
        <div className={styles.textOverlay}>
          <h2>Anyagmozgatói munka</h2>
          <h3>2000 Ft/óra</h3>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.detail}>
          <img src="./location.png" alt="Location icon" /> Debrecen
        </div>
        <div className={styles.detail}>
          <img src="./list.png" alt="Category icon" /> Adminisztratív, irodai
        </div>
        <button className={styles.btn}>megtekintés</button>
      </div>
    </div>
  )
}

export default WorkCard
