import { useState, useEffect } from "react";
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
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");

  useEffect(() => {

    const fetchOrganizationDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token nem található.");
        return;
      }

      try {
        const response = await axios.get("https://localhost:7067/api/organization/organization-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setEmail(data.email || "");
        setName(data.name || "");
        setAddress(data.address || "");
        setContactEmail(data.contactEmail || "");
        setContactPhone(data.contactPhone || "");
      } catch (error: any) {
        toast.error("Nem sikerült betölteni az adatokat!");
      }
    };

    fetchOrganizationDetails();
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token nem található.");
      return;
    }
  
    if (password && password !== confirmPassword) {
      toast.error("A jelszavak nem egyeznek.");
      return;
    }

    if (password && !/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      let passwordErrorMessage = "A jelszónak tartalmaznia kell:";
      
      if (!/[A-Z]/.test(password)) {
        passwordErrorMessage += " legalább egy nagybetűt";
      }
      if (!/\d/.test(password)) {
        passwordErrorMessage += " és legalább egy számot";
      }
      if (password.length < 8) {
        passwordErrorMessage += " és minimum 8 karakter hosszúnak kell lennie";
      }
      
      toast.error(passwordErrorMessage);
      isValid = false;
    }

    if (name !== "" && (name.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]+$/.test(name))) {
      toast.error("A cég neve csak betűket és szóközöket tartalmazhat, és max. 64 karakter lehet.");
      isValid = false;
    }
    

    if (email !== "" && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast.error("Érvénytelen email cím formátum.");
      isValid = false;
    }

    if (contactEmail !== "" && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(contactEmail)) {
      toast.error("Érvénytelen email cím formátum.");
      isValid = false;
    }

    if (contactPhone !== "" && !/^\d{11}$/.test(contactPhone)) {
      toast.error("A telefonszámnak pontosan 11 számjegyből kell állnia.");
      isValid = false;
    }

    if (!isValid) return

    try {
      const OrganizationSettings: any = {};
  
      if (email !== "") OrganizationSettings.email = email;
      if (name !== "") OrganizationSettings.name = name;
      if (address !== "") OrganizationSettings.address = address;
      if (contactEmail !== "") OrganizationSettings.contactEmail = contactEmail;
      if (contactPhone !== "") OrganizationSettings.contactPhone = contactPhone;
  
      if (password) OrganizationSettings.password = password;
  
      await axios.put(
        "https://localhost:7067/api/organization/orgsettings",
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
  

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
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
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                <img src="./key.png" alt="password key icon" />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="text"
                  placeholder="Céges Telefonszám"
                  value={contactPhone}
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
