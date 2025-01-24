import { useState } from "react";
import axios from "axios";
import styles from "./Modals.module.css"
type OrgPasswordModalProps = {
  organizationId: number;
};

const OrgPasswordModal = ({ organizationId }: OrgPasswordModalProps) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("A két jelszó nem egyezik!");
      return;
    }

    try {
      const response = await axios.put(
        `https://localhost:7067/api/admin/organization/${organizationId}/password`,
        { newPassword }
      );
      setSuccess("A jelszó sikeresen megváltozott!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Nem sikerült a jelszó módosítása!");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Jelszó megváltoztatása</h2>
      <form
        className={styles.orgForm}
        onSubmit={handlePasswordChange}
      >
        <div className={styles.formWrapper}>
            <div className={styles.inputBox}>
              <input
                type="password"
                placeholder="Új jelszó"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <img src="./key.png" alt="key icon" />
            </div>
            <div className={styles.inputBox}>
              <input
                type="password"
                placeholder="Új jelszó mégegyszer"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img src="./key.png" alt="key icon" />
            </div>
        </div>
        <div className={styles.footer}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit">
            jelszó megváltoztatása
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrgPasswordModal;