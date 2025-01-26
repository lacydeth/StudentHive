import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./AdminSettings.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Title from "../../../components/Title/Title";
import { adminTopLinks } from "../../../utils/routes";
import axios from "axios";
import { getUserIdFromToken } from "../../../utils/authUtils";

const AdminSettings = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userId = getUserIdFromToken();
    if (!userId) {
      setError("Nem található azonosító a tokenben.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek.");
      setMessage(null);
      return;
    }
  
    try {
      const updatedAdminSettings: any = {};
      if (email) updatedAdminSettings.email = email;
      if (password) updatedAdminSettings.password = password;
  
      await axios.put(
        `https://localhost:7067/api/admin/settings/${userId}`,
        updatedAdminSettings
      );
      setMessage("A szervezet adatainak frissítése sikeres!");
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Nem sikerült az adatok frissítése!");
      setMessage(null);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={adminTopLinks} />
      <div
        className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <DashboardTitle title="Profil beállítások" icon="./settings.png" subTitle="Profil beállítások" />
        <div className={styles.settingsContent}>
          <Title subTitle="Beállítások" title="Változtasd meg profilod adatait!" />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}
          <form className={styles.settingsForm} onSubmit={handleSubmit}>
            <div className={styles.formWrapper}>
              <div className={styles.inputBox}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <img src="./mail.png" alt="email icon" />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="password"
                  placeholder="Új jelszó"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img src="./key.png" alt="password key icon" />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="password"
                  placeholder="Új jelszó mégegyszer"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <img src="./key.png" alt="password key icon" />
              </div>
            </div>
            <button type="submit" className={styles.saveBtn}>
              mentés
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
