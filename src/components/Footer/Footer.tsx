import { Link } from "react-router-dom";
import { routes } from "../../utils/routes";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Rólunk</h4>
          <p className={styles.sectionText}>
            Elősegítjük a diákokat, hogy nagyszerű lehetőségeket találjanak és építsenek karrierjüket.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Oldalak</h4>
          <ul className={styles.linkList}>
            <li><Link to={routes.homePage.path} className={styles.link}>Rólunk</Link></li>
            <li><Link to={routes.worksPage.path} className={styles.link}>Munkák</Link></li>
            <li><Link to={routes.homePage.path} className={styles.link}>Adatkezelés</Link></li>
            <li><Link to={routes.contactPage.path} className={styles.link}>Kapcsolat</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Elérhetőségeink</h4>
          <div className={styles.socialLinks}>
            <div className={styles.socialLink}>
              <img src="./mail.png"></img>info.studenthive@gmail.com
            </div>
            <div className={styles.socialLink}>
              <img src="./telephone.png"></img> +36123456789
            </div>
            <div className={styles.socialLink}>
              <img src="./location.png"></img> Debrecen, Széchenyi u. 58, 4025
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} StudentHive. Minden jog fenntartva.
        </p> 
      </div>
    </footer>
  );
};

export default Footer;