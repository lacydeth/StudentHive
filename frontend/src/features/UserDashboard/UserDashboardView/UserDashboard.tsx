import { Link, useNavigate } from "react-router-dom"
import styles from "./UserDashboard.module.css"
import { routes } from "../../../utils/routes"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const UserDashboard = () => {
  const [profile, setProfile] = useState<{ firstName: string; lastName: string } | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const response = await axios.get("https://localhost:7067/api/user/profile", {
          headers: { Authorization: `Bearer ${token}`},
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Hiba az adatok lekérdezése közben:", error)
      }
    }
    handleProfile();
  }, [])
  const handleLogout = async () => {
    try {
      const response = await axios.post("https://localhost:7067/api/auth/logout");

      if (response.status === 200) {
        localStorage.removeItem("token");
        toast.success("Sikeres kijelentkezés!");
        navigate("/login");
      } else {
        toast.error("Sikertelen kijelentkezés!");
      }
    } catch (error) {
      toast.error("Hiba történt a kijelentkezés közben!");
      console.error("Kijelentkezési hiba:", error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <img className={styles.profile} src="/user.png" alt="user icon" />
        <h2>{profile ? `${profile.lastName} ${profile.firstName}` : "Betöltés..."}</h2>
        <Link className={styles.userBtn} to={routes.homePage.path}><img src="/home.png" alt="home"/></Link>
        <button className={styles.userBtn} onClick={handleLogout}><img src="/logout.png" alt="logout"/></button>
      </div>
      <div className={styles.cards}>
        <div className={styles.welcomeCard}>
          <div className={styles.imageWrapper}>
            <img src="/work-card.jpg" alt="My jobs" />
          </div>
          <div className={styles.content}>
            <h3>Munkahelyeim</h3>
            <p>Tekintsd meg jelenlegi munkáidat, és jelentkezz műszakokra, mindezt egy könnyen kezelhető felületen.</p>
            <Link className={styles.next} to={routes.userJobs.path}>Tovább a munkáimhoz <img src="/next.png"></img></Link>
          </div>
        </div>
        <div className={styles.welcomeCard}>
          <div className={styles.imageWrapper}>
            <img src="/jobs-card.jpg" alt="Available jobs" />
          </div>
          <div className={styles.content}>
            <h3>Elérhető állások</h3>
            <p>Fedezd fel a legújabb munkalehetőségeket, és jelentkezz a számodra legmegfelelőbb pozíciókra.</p>
            <Link className={styles.next} to={routes.worksPage.path}>Tovább a munkákhoz <img src="/next.png"></img></Link>
          </div>
        </div>
        <div className={styles.welcomeCard}>
          <div className={styles.imageWrapper}>
            <img src="/profile.jpg" alt="Profil" />
          </div>
          <div className={styles.content}>
            <h3>Profilom</h3>
            <p>Tekintsd meg és frissítsd személyes profilodat. Itt láthatod a munkahelyi előzményeidet és egyéb, az álláskereséshez szükséges adatokat.</p>
            <Link className={styles.next} to={routes.userProfile.path}>Tovább a profilomra <img src="/next.png"></img></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
