import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./NewOrg.module.css";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import { adminTopLinks } from "../../../utils/routes";

const NewOrg = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const validateInputs = () => {
    if (!orgName.trim()) {
      toast.error("A szövetkezet neve megadása kötelező!");
      return false;
    }
    if (orgName.length > 50) {
      toast.error("A szövetkezet neve legfeljebb 50 karakter lehet!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Érvénytelen email cím!");
      return false;
    }
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Érvénytelen telefonszám! 10-15 számjegy kell, opcionális '+' előtaggal.");
      return false;
    }
    if (!address.trim()) {
      toast.error("A cím megadása kötelező!");
      return false;
    }
    if (address.length > 100) {
      toast.error("A cím legfeljebb 100 karakter lehet!");
      return false;
    }
    return true;
  };

  const handleNewOrganization = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post(
        "https://localhost:7067/api/admin/new-organization",
        { orgName, email, phoneNumber, address },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success(response.data.message || "Szövetkezet sikeresen hozzáadva!");
      setOrgName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        toast.error(message || "Ismeretlen hiba lépett fel.");
      } else {
        toast.error("Ismeretlen hiba lépett fel.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={adminTopLinks} />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <DashboardTitle title="Szövetkezet felvétele" icon="./more.png" subTitle="Szövetkezet felvétele" />
        <div className={styles.newOrgContent}>
          <Title subTitle="Szövetkezet felvétele" title="Add meg a szövetkezet alapvető adatait!" />
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
