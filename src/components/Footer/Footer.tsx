import styles from "./Footer.module.css"

const Footer = () => {
    return (
      <div className={styles.footer}>
          <p>&copy; 2025 StudentHive. Minden jog fenntartva.</p>
          <ul>
              <li>Általános Szerződési Feltételek</li>
              <li>Adatkezelési nyilatkozat</li>
          </ul>
      </div>
    )
  }
  
  export default Footer