import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./NewJob.module.css";
import Title from "../../../components/Title/Title";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { orgMenuLinks } from "../../../utils/routes";
import Sidebar from "../../../components/Sidebar/Sidebar";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";

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
  const [hourlyrate, setHourlyRate] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ourOffer, setOurOffer] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [mainTasks, setMainTasks] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [isFaq1Open, setIsFaq1Open] = useState(false);
  const [isFaq2Open, setIsFaq2Open] = useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7067/api/organization/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Hiba történt a kategóriák betöltése közben.");
      }
    };
    fetchCategories();
  }, []);

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
        "https://localhost:7067/api/organization/new-job",
        {
          title,
          hourlyrate,
          categoryId: selectedCategory,
          city,
          address,
          ourOffer,
          mainTasks,
          jobRequirements,
          advantages
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("New job created!:", response.data);
      setError(null);
      navigate("/current-jobs");
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
        className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
      >
        <DashboardTitle title="Munka létrehozása" icon="./more.png" subTitle="Munka létrehozása" />
        <div className={styles.newJobContent}>
          <Title subTitle="Munka létrehozása" title="Adj hozzá új munkát pár adat megadásával!" />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form
            className={styles.newJobForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <div className={styles.formWrapper}>
              <div className={styles.row}>
                <div className={styles.inputBox}>
                  <input
                    type="text"
                    placeholder="Munka neve"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <img src="./id-card.png" alt="last name icon" />
                </div>
                <div className={styles.inputBox}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Válassz kategóriát...
                    </option>
                    {categories.map((category: { id: number; categoryName: string }) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
              <div className={styles.row}>
                {/* FAQ 1 */}
                <div className={styles.faqElement}>
                  <div className={styles.faqTitle}>
                    <h2>Munkavégzés helye</h2>
                    <img
                      onClick={() => setIsFaq1Open(!isFaq1Open)}
                      src={isFaq1Open ? "./src/assets/minus-sign.png" : "./src/assets/plus-sign.png"}
                    />
                  </div>
                  {isFaq1Open && (
                    <div className={styles.faqContent}>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Város"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                        <img src="./mail.png" alt="city icon" />
                      </div>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Cím"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                        <img src="./mail.png" alt="address icon" />
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ 2 */}
                <div className={styles.faqElement}>
                  <div className={`${styles.faqTitle} ${isFaq2Open ? "open" : ""}`}>
                    <h2>Leírás megadása</h2>
                    <img
                      onClick={() => setIsFaq2Open(!isFaq2Open)}
                      src={isFaq2Open ? "./src/assets/minus-sign.png" : "./src/assets/plus-sign.png"}
                    />
                  </div>
                  {isFaq2Open && (
                    <div className={styles.faqContent}>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Mit adunk?"
                          value={ourOffer}
                          onChange={(e) => setOurOffer(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Főbb feladatok"
                          value={mainTasks}
                          onChange={(e) => setMainTasks(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Munka követelménye"
                          value={jobRequirements}
                          onChange={(e) => setJobRequirements(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Előnyt jelent"
                          value={advantages}
                          onChange={(e) => setAdvantages(e.target.value)}
                          required
                        />
                      </div>

                    </div>
                  )}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputBox}>
                  <input
                    type="number"
                    placeholder="Órabér"
                    value={hourlyrate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                  />
                  <img src="./hourly-rate.png" alt="hourly rate icon" />
                </div>
              </div>
            </div>
            <button type="submit" className={styles.registerBtn}>
              munka létrehozása
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewJob;
