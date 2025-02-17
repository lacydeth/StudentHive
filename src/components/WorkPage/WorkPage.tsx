import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./WorkPage.module.css";
import Navbar from "../Navbar/Navbar";
import { routes } from "../../utils/routes";
import { apiInstance } from "../../utils/authUtils"; 
import { getUserIdFromToken } from "../../utils/authUtils"; 
import { ToastContainer, toast } from 'react-toastify';  // Importáld a szükséges komponenseket
import 'react-toastify/dist/ReactToastify.css';  // Importáld a stílusokat
import axios from "axios";

type WorkDetails = {
  title: string;
  salary: string;
  city: string;
  address: string;
  category: string;
  image: string;
  ourOffer: string;
  mainTasks: string;
  jobRequirements: string;
  advantages: string;
};

const WorkPage = () => {
  const { id } = useParams();
  const [work, setWork] = useState<WorkDetails | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    apiInstance
      .get(`https://localhost:7067/api/general/workcards/${id}`)
      .then((response) => setWork(response.data))
      .catch((error) => console.error("Error fetching work details:", error));
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setIsApplying(true);
  
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("Nem sikerült azonosítani a felhasználót.");  // Hiba üzenet
        setIsApplying(false);
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Nincs bejelentkezve felhasználó.");  // Hiba üzenet
        setIsApplying(false);
        return;
      }
  
      const response = await axios.post(
        `https://localhost:7067/api/user/apply`,
        {
          jobId: parseInt(id),
          studentId: parseInt(userId),
          Status : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success(response.data.message);  // Sikeres jelentkezés üzenet
    } catch (error: any) {
      toast.error("Már jelentkezett a munkára!");  // Hiba üzenet
    } finally {
      setIsApplying(false);
    }
  };

  if (!work) return <p>Betöltés...</p>;

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
            <Link className={styles.back} to={routes.worksPage.path}>
                <img src="/back.png" alt="back icon" /> Vissza a munkákhoz
            </Link>
            <div className={styles.top}>
                <img src={work.image} alt={work.title} className={styles.image} />
                <div className={styles.textOverlay}>
                    <h1>{work.title}</h1>
                    <h3>{work.salary}</h3>
                </div>
                <div className={styles.buttonOverlay}>
                    <button onClick={handleApply} disabled={isApplying}>
                        {isApplying ? "Jelentkezés folyamatban..." : "Jelentkezem"}
                    </button>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.left}>
                    <div className={styles.section}>
                        <h2>Amit kínálunk</h2>
                        <p>{work.ourOffer}</p>
                    </div>
                    <div className={styles.section}>
                        <h2>Főbb feladatok</h2>
                        <p>{work.mainTasks}</p>
                    </div>
                    <div className={styles.section}>
                        <h2>Elvárásaink</h2>
                        <p>{work.jobRequirements}</p>
                    </div>
                    <div className={styles.section}>
                        <h2>Előnyt jelent</h2>
                        <p>{work.advantages}</p>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.infoCard}>
                        <div className={styles.cardItem}>
                            <img src="/hourly-rate.png" alt="hourly rate icon" />
                            <div className={styles.cardItemText}>
                                <h3>Fizetés</h3>
                                <p>{work.salary}</p>
                            </div>
                        </div>
                        <div className={styles.cardItem}>
                            <img src="/location.png" alt="location icon" />
                            <div className={styles.cardItemText}>
                                <h3>Helyszín</h3>
                                <p>{work.city}, {work.address}</p>
                            </div>
                        </div>
                        <div className={styles.cardItem}>
                            <img src="/list.png" alt="category icon" />
                            <div className={styles.cardItemText}>
                                <h3>Kategória</h3>
                                <p>{work.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ToastContainer a popup értesítésekhez */}
        <ToastContainer />
    </div>
  );
};

export default WorkPage;
