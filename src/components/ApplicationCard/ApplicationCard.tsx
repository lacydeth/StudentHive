import styles from "./ApplicationCard.module.css";

export type ApplicationCardProps = {
    id: number;
    title: string;
    status: 0 | 1 | 2;
    appliedAt: string;
    onDelete?: (id: number) => void;
};

const statusFormatter = (status: 0 | 1 | 2) => {
    if (status === 0) return "Válaszra vár";
    if (status === 1) return "Elfogadva";
    if (status === 2) return "Elutasítva";
    return "Ismeretlen";
};

const ApplicationCard = ({ id, title, status, appliedAt, onDelete }: ApplicationCardProps) => {
    const circleColor =
        status === 0 ? styles.gray :
        status === 1 ? styles.green :
        status === 2 ? styles.red : "";

    return (
        <div className={styles.card}>

            <div className={styles.details}>
                <div className={styles.title}>
                    <div className={`${styles.circle} ${circleColor}`}></div>
                    <h3>{title}</h3>
                </div>
                <p><b>Jelentkezés dátuma:</b> {appliedAt}</p>
                <p><b>Státusz:</b> {statusFormatter(status)}</p>
            </div>

            {status === 0 && onDelete && (
                <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(id)}
                >
                    Visszavonás
                </button>
            )}
        </div>
    );
};

export default ApplicationCard;