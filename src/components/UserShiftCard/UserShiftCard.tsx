import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import styles from "./UserShiftCard.module.css";

export type ShiftProps = {
  id: string;
  title: string;
  shiftStart: string;
  shiftEnd: string;
  approvedStatus: number;
  jobId: string;
};

const UserShiftCard = ({ id, title, shiftStart, shiftEnd, approvedStatus, onDelete }: ShiftProps & { onDelete: (id: string) => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);

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
        return "Válaszra vár";
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

  const isDeleteDisabled = () => {
    return (
      approvedStatus === 2 || 
      new Date(shiftStart).getTime() - new Date().getTime() < 12 * 60 * 60 * 1000
    );
  };

  const confirmAction = (message: string, onConfirm: () => void) => {
    confirmAlert({
      title: "Megerősítés",
      message,
      buttons: [
        {
          label: "Igen",
          onClick: onConfirm,
        },
        {
          label: "Mégse",
        },
      ],
    });
  };

  const handleDelete = async () => {
    if (isDeleteDisabled()) return;

    confirmAction("Biztosan törölni szeretnéd ezt a műszakot?", async () => {
      setIsDeleting(true);
      try {
        await onDelete(id);
      } finally {
        setIsDeleting(false);
      }
    });
  };

  const calculateTimeRemaining = () => {
    const now = new Date();
    const start = new Date(shiftStart);
    const diff = start.getTime() - now.getTime();

    if (diff < 0) return "Már elkezdődött";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 12) {
      return `Kevesebb mint 12 óra van hátra (${hours}ó ${minutes}p)`;
    }

    return null;
  };

  const timeRemaining = calculateTimeRemaining();

  return (
    <div className={styles.shiftCard}>
      <div className={styles.cardHeader}>
        <h3>{title}</h3>
      </div>

      <div className={styles.shiftDetails}>
        <p className={styles.timeInfo}>
          <img src="/clock.png" alt="Clock" />
          <b>Kezdés:</b> {formatDateTime(shiftStart)}
        </p>

        <p className={styles.timeInfo}>
          <img src="/clock.png" alt="Clock" />
          <b>Befejezés:</b> {formatDateTime(shiftEnd)}
        </p>

        <div className={styles.statusContainer}>
          <p>
            <b>Állapot:</b>
            <span className={getStatusColor(approvedStatus)}>
              {getStatusText(approvedStatus)}
            </span>
          </p>
        </div>
      </div>

      <div className={styles.cardFooter}>
        {timeRemaining && (
          <p style={{ color: '#dc2626' }}>{timeRemaining}</p>
        )}

        <button 
          className={styles.deleteButton} 
          onClick={handleDelete}
          disabled={isDeleteDisabled() || isDeleting}
        >
          {isDeleting ? "Törlés..." : <>
            <img src='/bin.png' alt="Bin" />
            Törlés
          </>}
        </button>
      </div>
    </div>
  );
};

export default UserShiftCard;
