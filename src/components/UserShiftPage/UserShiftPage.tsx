import UserNavbar from "../UserNavbar/UserNavbar";
import styles from "./UserShiftPage.module.css";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Value } from "react-calendar/src/shared/types.js";
import { toast } from "react-toastify";

type ShiftCardProps = {
  id: number;
  startTime: string;
  endTime: string;
  title: string;
  jobId: number;
};

const UserShiftPage = () => {
  const { id } = useParams(); 
  const [date, setDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<ShiftCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const shiftsPerPage = 4; 

  const fetchShifts = async (selectedDate: Date) => {
    try {
        const formattedDate = selectedDate.toLocaleDateString("hu-HU");
        const response = await axios.get(
            `https://localhost:7067/api/user/list-shifts/${id}/date/${formattedDate}`
        );
        setShifts(response.data);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        setShifts([]); 
    }
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (value < today) {
        toast.error("Nem választhatsz múltbeli dátumot!");
        return;
      }
  
      setDate(value);
      setCurrentPage(1);
      fetchShifts(value);
    }
  };

  useEffect(() => {
    fetchShifts(date);
  }, []);

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

  const handleApply = async (shift: ShiftCardProps) => {
    const shiftStartDate = new Date(shift.startTime);
    const now = new Date();
  
    if (shiftStartDate <= now) {
      toast.error("Nem jelentkezhetsz múltbeli műszakra!");
      return;
    }

    try {
      const payload = {
        ShiftId: shift.id,
      };
  
      const response = await axios.post("https://localhost:7067/api/user/apply-shift", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (response.status === 200) {
        toast.success("Sikeres jelentkezés!");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Hiba történt a jelentkezés során.");
      } else {
        toast.error("Hiba történt a jelentkezés során.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.content}>
        <div className={styles.calendar}>
            <div className={styles.calendarTitle}>
              <h2>StudentHive Naptár</h2>
              <p>Válassz egy dátumot amelyik napon dolgozni szeretnél!</p>
            </div>
          <Calendar onChange={handleDateChange} value={date} />
        </div>
        <div className={styles.shifts}>
          <h2>Műszakok: {date.toLocaleDateString("hu-HU")}</h2>
          <div className={styles.shiftContainer}>
            {currentShifts.length > 0 ? (
              currentShifts.map((shift: ShiftCardProps) => (
                <div key={shift.id} className={styles.shiftItem}>
                  <h1>{shift.title}</h1>
                  <h3>Műszak kezdete</h3>
                  <h4><img src="/calendar.png" alt="calendar icon" />{shift.startTime}</h4>
                  <h3>Műszak vége</h3>
                  <h4><img src="/calendar.png" alt="calendar icon" />{shift.endTime}</h4>
                  <button onClick={() => handleApply(shift)}>Jelentkezés</button>
                </div>
              ))
            ) : (
              <p>Nincs elérhető műszak ezen a napon.</p>
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

export default UserShiftPage;