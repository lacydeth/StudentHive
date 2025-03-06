import { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./OrganizationSettings.module.css";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Title from "../../../components/Title/Title";
import { orgMenuLinks } from "../../../utils/routes";
import axios from "axios";
import { toast } from "react-toastify";

const OrganizationSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [contactemail, setContactEmail] = useState<string>("");
  const [contactphone, setContactPhone] = useState<string>("");

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
      const OrganizationSettings: any = {};
      if (email) OrganizationSettings.email = email;
      if (password) OrganizationSettings.password = password;
  
      await axios.put(
        `https://localhost:7067/api/organization/orgsettings`,
        OrganizationSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("A szervezet adatainak frissítése sikeres!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Nem sikerült az adatok frissítése!");
    }
  };

  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault();
     const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token nem található.");
          return;
        }
    try {
      const OrganizationCompanySettings: any = {};
      if (name) OrganizationCompanySettings.name = name;
      if (address) OrganizationCompanySettings.address = address;
      if (contactemail) OrganizationCompanySettings.contactemail = contactemail;
      if (contactphone) OrganizationCompanySettings.contactphone = contactphone;
  
      await axios.put(
        `https://localhost:7067/api/organization/company-settings`,
        OrganizationCompanySettings,
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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
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
          <form className={styles.settingsForm} onSubmit={handleSubmitCompany}>
            <div className={styles.formWrapper}>
              <div className={styles.inputBox}>
                <input
                  type="text" 
                  placeholder="Cég megnevezése"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <img src="./mail.png" alt="email icon" />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  placeholder="Cím"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <img src="./key.png" alt="password key icon" />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="email"
                  placeholder="Céges Email"
                  value={contactemail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                <img src="./key.png" alt="password key icon" />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  placeholder="Céges Telefonszám"
                  value={contactphone}
                  onChange={(e) => setContactPhone(e.target.value)}
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
export default OrganizationSettings;
