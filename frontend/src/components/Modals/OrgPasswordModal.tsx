import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Modals.module.css";

type OrgPasswordModalProps = {
  organizationId: number;
};

const OrgPasswordModal = ({ organizationId }: OrgPasswordModalProps) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("A két jelszó nem egyezik!");
      return;
    }

    try {
      await axios.put(
        `https://localhost:7067/api/admin/organization/${organizationId}/password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("A jelszó sikeresen megváltozott!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Nem sikerült a jelszó módosítása!");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Jelszó megváltoztatása</h2>
      <form className={styles.orgForm} onSubmit={handlePasswordChange}>
        <div className={styles.formWrapper}>
          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Új jelszó"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <img src="/key.png" alt="key icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Új jelszó mégegyszer"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <img src="/key.png" alt="key icon" />
          </div>
        </div>
        <div className={styles.footer}>
          <button type="submit">Jelszó megváltoztatása</button>
        </div>
      </form>
    </div>
  );
};

export default OrgPasswordModal;
