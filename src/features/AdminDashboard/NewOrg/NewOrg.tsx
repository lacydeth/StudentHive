import { useState } from "react";
import axios from "axios";
import styles from "./NewOrg.module.css";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import { adminTopLinks } from "../../../utils/routes";

const NewOrg = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);

  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewOrganization = async () => {
    if (!orgName || !email || !phoneNumber || !address) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7067/api/admin/new-organization", {
        orgName,
        email,
        phoneNumber,
        address,
        
      });
      setMessage(response.data.message);
      setOrgName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { code, description } = error.response.data;
        setError(`${code}: ${description}`);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };
  return (
    <div className={styles.container}>
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={adminTopLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Szövetkezet felvétele" icon="./more.png" subTitle="Szövetkezet felvétele"/>
        <div className={styles.newOrgContent}>
          <Title
            subTitle="Szövetkezet felvétele"
            title="Add meg a szövetkezet alapvető adatait!"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}
          <form
            className={styles.newOrgForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleNewOrganization();
            }}
          >
            <div className={styles.formWrapper}>
              <div className={styles.formColumn}>
                <div className={styles.inputBox}>
                  <input
                    type="text"
                    placeholder="Szövetkezet neve"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                  <img src="./office-building.png" alt="organization name icon" />
                </div>
                <div className={styles.inputBox}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <img src="./mail.png" alt="email icon" />
                </div>
              </div>
              <div className={styles.formColumn}>
                <div className={styles.inputBox}>
                  <input
                    type="tel"
                    placeholder="Telefonszám"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <img src="./telephone.png" alt="phone icon" />
                </div>
                <div className={styles.inputBox}>
                  <input
                    type="text"
                    placeholder="Szövetkezet címe"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <img src="./location.png" alt="address icon" />
                </div>
              </div>
            </div>
          
            <button type="submit" className={styles.newOrgBtn}>
              szövetkezet felvétele
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOrg;
