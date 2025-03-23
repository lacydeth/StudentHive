import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddAgents.module.css";
import Title from "../../../components/Title/Title";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { orgMenuLinks } from "../../../utils/routes";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import { getUserIdFromToken } from "../../../utils/authUtils";

const AddAgents = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");
  const [errors, setErrors] = useState({ firstName: "", lastName: "", newAgentEmail: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = { firstName: "", lastName: "", newAgentEmail: "" };

    if (!/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]{2,}$/.test(firstName)) {
      newErrors.firstName = "A keresztnév legalább 2 karakter hosszú és csak betűket tartalmazhat.";
      valid = false;
    }

    if (!/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]{2,}$/.test(lastName)) {
      newErrors.lastName = "A vezetéknév legalább 2 karakter hosszú és csak betűket tartalmazhat.";
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAgentEmail)) {
      newErrors.newAgentEmail = "Érvényes email címet adj meg.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    const loggedInUserId = getUserIdFromToken();
    if (!loggedInUserId) {
      toast.error("Nem található felhasználói bejelentkezés.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token nem található.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7067/api/organization/new-agent",
        { firstName, lastName, newAgentEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Sikeres regisztráció!");
      setFirstName("");
      setLastName("");
      setNewAgentEmail("");
      setErrors({ firstName: "", lastName: "", newAgentEmail: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ismeretlen hiba lépett fel.");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <DashboardTitle title="Közvetítő felvétele" icon="./realtor.png" subTitle="Közvetítő felvétele" />
        <div className={styles.addAgentsContent}>
          <Title subTitle="Közvetítő felvétele" title="Adj hozzá új közvetítőt az alapadatok megadásával!" />
          <form
            className={styles.addAgentsForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="Vezetéknév"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <img src="./id-card.png" alt="last name icon" />
              {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
            </div>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="Keresztnév"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <img src="./id-card.png" alt="first name icon" />
              {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
            </div>
            <div className={styles.inputBox}>
              <input
                type="email"
                placeholder="Közvetítő email címe"
                value={newAgentEmail}
                onChange={(e) => setNewAgentEmail(e.target.value)}
                required
              />
              <img src="./mail.png" alt="email icon" />
              {errors.newAgentEmail && <span className={styles.error}>{errors.newAgentEmail}</span>}
            </div>

            <button type="submit" className={styles.registerBtn}>
              Közvetítő felvétele
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAgents;
