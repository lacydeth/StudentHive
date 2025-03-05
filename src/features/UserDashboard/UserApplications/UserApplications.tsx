import UserNavbar from "../../../components/UserNavbar/UserNavbar";
import styles from "./UserApplications.module.css";

const UserApplications = () => {

  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.content}>
        <div className={styles.jobTitle}>
          <h1>Jelentkezéseim</h1>
        </div>
      </div>
    </div>
  );
};

export default UserApplications;