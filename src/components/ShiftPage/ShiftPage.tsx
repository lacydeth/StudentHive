import { useEffect, useState } from "react";
import { agentMenuLinks, routes } from "../../utils/routes";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./ShiftPage.module.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ShiftCard from "../ShiftCard/ShiftCard";
import { toast } from "react-toastify";

type WorkDetails = {
    title: string;
    salary: string;
    agentName: string;
    city: string;
    address: string;
    category: string;
    image: string;
};

type Shift = {
    id: number;
    title: string;
    shiftStart: string;
    shiftEnd: string;
};

const ShiftPage = () => {
    const { id } = useParams();
    const [work, setWork] = useState<WorkDetails | null>(null);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
    const [shiftStart, setShiftStart] = useState<string>("");
    const [shiftEnd, setEndTime] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const shiftsPerPage = 4; 

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        axios
            .get(`https://localhost:7067/api/agent/work-details/${id}`)
            .then((response) => setWork(response.data))
            .catch((error) => console.error("Error fetching work details:", error));
        
        axios
            .get(`https://localhost:7067/api/agent/manage-shifts/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}})
            .then((response) => setShifts(response.data))
            .catch((error) => console.error("Error fetching updated shifts:", error));
    }, [id]);

    const handleAddShift = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const shiftStartDate = new Date(shiftStart);
        const shiftEndDate = new Date(shiftEnd);
    
        const shiftStartBudapest = shiftStartDate.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
        const shiftEndBudapest = shiftEndDate.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
    
        const shiftData = {
            jobId: id,
            shiftStart: new Date(shiftStartBudapest).toISOString(),
            shiftEnd: new Date(shiftEndBudapest).toISOString(),
        };
    
        try {
            const response = await axios.post("https://localhost:7067/api/agent/add-shift", shiftData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
    
            if (response.status === 200) {
                toast.success(response.data.message);
                setShiftStart("");
                setEndTime("");
                axios
                    .get(`https://localhost:7067/api/agent/manage-shifts/${id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
                    .then((response) => setShifts(response.data))
                    .catch((error) => console.error("Error fetching updated shifts:", error));
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                toast.error(message || "Ismeretlen hiba lépett fel.");
            } else {
                toast.error("Ismeretlen hiba lépett fel.");
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("hu-HU", {
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit"
        });
    };

    const indexOfLastShift = currentPage * shiftsPerPage;
    const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
    const currentShifts = shifts.slice(indexOfFirstShift, indexOfLastShift);

    const nextPage = () => {
        if (currentPage < Math.ceil(shifts.length / shiftsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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
                    <div className={styles.shiftContainer}>
                        {currentShifts.length > 0 ? (
                            currentShifts.map((shift) => (
                                <ShiftCard
                                    key={shift.id}
                                    id={shift.id}
                                    title={shift.title}
                                    shiftStart={formatDate(shift.shiftStart)}
                                    shiftEnd={formatDate(shift.shiftEnd)}
                                />
                            ))
                        ) : (
                            <p>Nincs műszak hozzárendelve.</p>
                        )}
                    </div>
                    <div className={styles.pagination}>
                        <button onClick={prevPage} disabled={currentPage === 1}>
                            Előző
                        </button>
                        <span>Oldal {currentPage}</span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === Math.ceil(shifts.length / shiftsPerPage)}
                        >
                            Következő
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftPage;