import { useState } from "react";
import axios from "axios";
import SidebarOrg from "../../../components/SidebarOrg/SidebarOrg";
import styles from "./NewJob.module.css";
import Title from "../../../components/Title/Title";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

const NewJob = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyrate, setHourlyRate] = useState("");
  const [imagepath, setImagePath] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

      // Send the request with the logged-in user's ID (extracted from the JWT) and the new agent's details
      const response = await axios.post(
        "https://localhost:7067/api/organization/new-job",
        {
          title,
          category,
          location,
          description,
          hourlyrate,
          imagepath
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token to authenticate the request
          },
        }
      );

      console.log("New job created!:", response.data);
      setError(null);
      navigate("/new-job");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <SidebarOrg isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <Title subTitle="Add Job" title="Created a new job!" />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Munka Neve"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <img src="./id-card.png" alt="last name icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Kategória"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <img src="./id-card.png" alt="first name icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Munkavégzés helye"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <img src="./mail.png" alt="email icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Leírás"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <img src="./mail.png" alt="email icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Órabér"
              value={hourlyrate}
              onChange={(e) => setHourlyRate(e.target.value)}
              required
            />
            <img src="./mail.png" alt="email icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="kép url"
              value={imagepath}
              onChange={(e) => setImagePath(e.target.value)}
              required
            />
            <img src="./mail.png" alt="email icon" />
          </div>

          <div className={styles.inputBox}></div>
          <button type="submit" className={styles.registerBtn}>
            Register Agent
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewJob;
