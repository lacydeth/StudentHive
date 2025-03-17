import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./AdminSettings.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Title from "../../../components/Title/Title";
import { adminTopLinks } from "../../../utils/routes";
import axios from "axios";
import { getUserIdFromToken } from "../../../utils/authUtils";
import { toast } from "react-toastify";
type adminSettinsProps = {
  email?: string;
  password?: string;
}
const AdminSettings = () => {
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
      toast.error("Sikertelen felhasználói azonosítás.")
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("A jelszavak nem egyeznek.")
      return;
    }
  
    try {
      const updatedAdminSettings: adminSettinsProps = {};
      if (email) updatedAdminSettings.email = email;
      if (password) updatedAdminSettings.password = password;
  
      await axios.put(
        "https://localhost:7067/api/admin/settings",
        updatedAdminSettings,
        {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
      );
      toast.success("A szervezet adatainak frissítése sikeres!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Nem sikerült az adatok frissítése!");
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
          <Title subTitle="Beállítások" title="Változtasd meg profilod adatait! Az üresen hagyott mező nem változik." />
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
              Mentés
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
