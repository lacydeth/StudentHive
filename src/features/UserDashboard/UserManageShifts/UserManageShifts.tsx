import Calendar from "react-calendar"
import UserNavbar from "../../../components/UserNavbar/UserNavbar"
import styles from "./UserManageShifts.module.css"
import axios from "axios";
import { Value } from "react-calendar/src/shared/types.js";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

interface ShiftProps {
  id: string;
  title: string;
  shiftStart: string;
  shiftEnd: string;
  approvedStatus: number;
  jobId: string;
}

const ShiftCard = ({ id, title, shiftStart, shiftEnd, approvedStatus, onDelete }: ShiftProps & { onDelete: (id: string) => void }) => {
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Függőben";
      case 1:
        return "Elfogadva";
      case 2:
        return "Elutasítva";
      default:
        return "Ismeretlen";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return styles.statusPending;
      case 1:
        return styles.statusApproved;
      case 2:
        return styles.statusRejected;
      default:
        return "";
    }
  };

  return (
    <div className={styles.shiftCard}>
      <h3>{title}</h3>
      <div className={styles.shiftDetails}>
        <p><strong>Kezdés:</strong> {formatDateTime(shiftStart)}</p>
        <p><strong>Befejezés:</strong> {formatDateTime(shiftEnd)}</p>
        <p>
          <strong>Állapot:</strong> 
          <span className={getStatusColor(approvedStatus)}>
            {getStatusText(approvedStatus)}
          </span>
        </p>
      </div>
      <button 
        className={styles.deleteButton} 
        onClick={() => onDelete(id)}
        disabled={approvedStatus === 1 || new Date(shiftStart).getTime() - new Date().getTime() < 12 * 60 * 60 * 1000}
      >
        Törlés
      </button>
    </div>
  );
};

const UserManageShifts = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [shifts, setShifts] = useState<ShiftProps[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const shiftsPerPage = 3;

    const fetchShifts = async (selectedDate: Date) => {
      try {
          const formattedDate = selectedDate.toLocaleDateString("hu-HU");
          const token = localStorage.getItem("token");
          const response = await axios.get(
              `https://localhost:7067/api/user/list-user-shifts/date/${formattedDate}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
          );
          setShifts(response.data);
      } catch (error) {
          console.error("Error fetching shifts:", error);
          setShifts([]); 
      }
    };
  
    useEffect(() => {
      fetchShifts(date);
    }, []);

    const handleDateChange = (value: Value) => {
      if (value instanceof Date) {
        setDate(value);
        fetchShifts(value);
        setCurrentPage(1); // Reset to first page when date changes
      }
    };

    const handleDeleteShift = async (shiftId: string) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://localhost:7067/api/user/delete-shift/${shiftId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        toast.success("Műszak sikeresen törölve!");
        fetchShifts(date); 
      } catch (error: any) {
        console.error("Error deleting shift:", error);
        
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Hiba történt a műszak törlésekor!");
        }
      }
    };

    const indexOfLastShift = currentPage * shiftsPerPage;
    const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
    const currentShifts = shifts.slice(indexOfFirstShift, indexOfLastShift);
    const totalPages = Math.ceil(shifts.length / shiftsPerPage);

    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.content}>
        <div className={styles.jobTitle}>
          <h1>Műszakjaim</h1>
        </div>
        <div className={styles.userShifts}>
          <div className={styles.calendar}>
            <h2>StudentHive Naptár</h2>
            <Calendar onChange={handleDateChange} value={date} />
          </div>
          <div className={styles.shiftsContainer}>
            <h2>Műszakok: {date.toLocaleDateString("hu-HU")}</h2>
            {currentShifts.length > 0 ? (
              currentShifts.map((shift) => (
                <ShiftCard 
                  key={shift.id} 
                  {...shift} 
                  onDelete={handleDeleteShift} 
                />
              ))
            ) : (
              <p>Nincs műszak a kiválasztott napon.</p>
            )}
            {shifts.length > shiftsPerPage && (
              <div className={styles.pagination}>
                <button onClick={prevPage} disabled={currentPage === 1}>
                  Előző
                </button>
                <span>
                  Oldal {currentPage} / {totalPages}
                </span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                  Következő
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManageShifts;