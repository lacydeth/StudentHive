import { useState } from "react";
import axios from "axios";
import styles from "./AddAgents.module.css";
import Title from "../../../components/Title/Title";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { orgMenuLinks } from "../../../utils/routes";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

const AddAgents = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleRegister = async () => {
    const loggedInUserId = getUserIdFromToken();
    if (!loggedInUserId) {
      setError("User is not authenticated.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await axios.post(
        "https://localhost:7067/api/organization/new-agent",
        {
          firstName,
          lastName,
          newAgentEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Registration successful:", response.data);
      setError(null);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Közvetítő felvétele" icon="./realtor.png" subTitle="Közvetítő felvétele"/>
        <div className={styles.addAgentsContent}>
          <Title subTitle="Közvetítő felvétele" title="Adj hozzá új közvetítőt az alapadatok megadásával!" />
          {error && <p style={{ color: "red" }}>{error}</p>}
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
            </div>

            <div className={styles.inputBox}></div>
            <button type="submit" className={styles.registerBtn}>
              közvetítő felvétele
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAgents;
