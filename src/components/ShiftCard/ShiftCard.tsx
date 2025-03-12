import { confirmAlert } from "react-confirm-alert";
import styles from "./ShiftCard.module.css"
import axios from "axios";
type ShiftCardProps = {
    id: number;
    title: string;
    shiftStart: string;
    shiftEnd: string;
}

const ShiftCard = ({id, title, shiftStart, shiftEnd}: ShiftCardProps) => {
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
    const handleDelete = () => {
        confirmAction("Biztosan szeretnéd törölni a műszakot?", async () => {
            axios
            .delete(`https://localhost:7067/api/agent/delete-shift/${id}`)
            .catch((error) => console.error("Hiba a törlés során:", error));
            window.location.reload()
        });
    }
    return (
    <div className={styles.card}>
        <h2>{title}</h2>
        <h3>Műszak kezdete</h3>
        <h4><img src="/calendar.png"></img>{shiftStart}</h4>
        <h3>Műszak vége</h3>
        <h4><img src="/calendar.png"></img>{shiftEnd}</h4>
        <button onClick={handleDelete}><img src="/bin.png"></img></button>
    </div>
  )
}

export default ShiftCard