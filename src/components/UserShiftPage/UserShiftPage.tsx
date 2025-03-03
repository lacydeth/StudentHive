import UserNavbar from "../UserNavbar/UserNavbar";
import styles from "./UserShiftPage.module.css";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserShiftPage = () => {
  const { id } = useParams(); 
  const [date, setDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState([]);

  const fetchShifts = async (selectedDate: Date) => {
    try {
        const formattedDate = selectedDate.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
        const response = await axios.get(
            `https://localhost:7067/api/user/list-shifts/${id}/date/${formattedDate}`
        );
        setShifts(response.data);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        setShifts([]); 
    }
};

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    fetchShifts(newDate);
  };

  useEffect(() => {
    fetchShifts(date);
  }, []);

  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.content}>
        <h2>Válaszd ki melyik napon szeretnél dolgozni.</h2>
        <Calendar onChange={handleDateChange} value={date} />
        <div className={styles.shifts}>
          <h3>Elérhető műszakok:</h3>
          {shifts.length > 0 ? (
            <ul>
              {shifts.map((shift: any) => (
                <li key={shift.id}>{shift.startTime} - {shift.endTime}</li>
              ))}
            </ul>
          ) : (
            <p>Nincs elérhető műszak ezen a napon.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserShiftPage;
