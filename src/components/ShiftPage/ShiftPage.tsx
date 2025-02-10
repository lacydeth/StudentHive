import { useEffect, useState } from "react";
import { agentMenuLinks, routes } from "../../utils/routes";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./ShiftPage.module.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

type WorkDetails = {
    title: string;
    salary: string;
    agentName: string;
    city: string;
    address: string;
    category: string;
    image: string;
};

const ShiftPage = () => {
    const { id } = useParams();
    const [work, setWork] = useState<WorkDetails | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
    const [shiftStart, setShiftStart] = useState<string>("");
    const [shiftEnd, setEndTime] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        axios
            .get(`https://localhost:7067/api/agent/work-details/${id}`)
            .then((response) => setWork(response.data))
            .catch((error) => console.error("Error fetching work details:", error));
    }, [id]);

    const handleAddShift = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        const shiftData = {
            jobId: id,
            shiftStart: new Date(shiftStart).toISOString(),
            shiftEnd: new Date(shiftEnd).toISOString(),
        };

        try {
            const response = await axios.post("https://localhost:7067/api/agent/add-shift", shiftData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        
            if (response.status === 200) {
                setMessage(response.data.message);
                setShiftStart("");
                setEndTime("");
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                setError(message || "Ismeretlen hiba lépett fel."); 
            } else {
                setError("Ismeretlen hiba lépett fel.");
            }
        }
        
    };

    if (!work) return <p>Betöltés...</p>;

    return (
        <div className={styles.container}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
            <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <div className={styles.shiftContent}>
                    <Link className={styles.back} to={routes.agentJobs.path}>
                        <img src="/back.png" alt="back icon" /> Vissza a munkákhoz
                    </Link>
                    <div className={styles.top}>
                        <img src={work.image} alt={work.title} className={styles.image} />
                        <div className={styles.textOverlay}>
                            <h1>{work.title}</h1>
                            <h3>{work.agentName}</h3>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.left}>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            {message && <p style={{ color: "green" }}>{message}</p>}
                            <form className={styles.addShift} onSubmit={handleAddShift}>
                                <div className={styles.input}>
                                    <div className={styles.inputBox}>
                                        <label>Műszak kezdete</label>
                                        <input
                                            type="datetime-local"
                                            value={shiftStart}
                                            onChange={(e) => setShiftStart(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputBox}>
                                        <label>Műszak vége</label>
                                        <input
                                            type="datetime-local"
                                            value={shiftEnd}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit">műszak hozzáadása</button>
                            </form>
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
            </div>
        </div>
    );
};

export default ShiftPage;