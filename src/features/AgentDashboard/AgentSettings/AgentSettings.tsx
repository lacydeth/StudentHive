import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./AgentSettings.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Title from "../../../components/Title/Title";
import { agentMenuLinks } from "../../../utils/routes";
import axios from "axios";
import { toast } from "react-toastify";

const AgentSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token nem található.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("A jelszavak nem egyeznek.");
      return;
    }
  
    try {
      const updatedAgentSettings: any = {};
      if (email) updatedAgentSettings.email = email;
      if (password) updatedAgentSettings.password = password;
      if (firstname) updatedAgentSettings.firstname = firstname;
      if (lastname) updatedAgentSettings.lastname = lastname;
  
      await axios.put(
        `https://localhost:7067/api/agent/profilesettings`,
        updatedAgentSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("A szervezet adatainak frissítése sikeres!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Nem sikerült az adatok frissítése!");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div
        className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <DashboardTitle title="Profil beállítások" icon="./settings.png" subTitle="Profil beállítások" />
        <div className={styles.settingsContent}>
          <Title subTitle="Beállítások" title="Változtasd meg profilod adatait!" />
          <form className={styles.settingsForm} onSubmit={handleSubmit}>
            <div className={styles.formWrapper}>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  placeholder="Vezetéknév"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <img src="./id-card.png" alt="id-card icon" />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  placeholder="Keresztnév"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <img src="./id-card.png" alt="id-card icon" />
              </div>
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

export default AgentSettings;
