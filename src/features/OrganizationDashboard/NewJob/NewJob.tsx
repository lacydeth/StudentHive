import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./NewJob.module.css";
import Title from "../../../components/Title/Title";
import { orgMenuLinks } from "../../../utils/routes";
import Sidebar from "../../../components/Sidebar/Sidebar";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import { getUserIdFromToken } from "../../../utils/authUtils";
import { toast } from "react-toastify";


const NewJob = () => {
  const [title, setTitle] = useState("");
  const [hourlyrate, setHourlyRate] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ourOffer, setOurOffer] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [mainTaks, setmainTaks] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [isFaq1Open, setIsFaq1Open] = useState(false);
  const [isFaq2Open, setIsFaq2Open] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("https://localhost:7067/api/organization/categories");
      setCategories(response.data);
      if (response.status != 200) {
        toast.error("Hiba a kategóriák betöltése közben.")
      }
    };
    fetchCategories();
  }, []);

  const handleRegister = async () => {
    const loggedInUserId = getUserIdFromToken();
    if (!loggedInUserId) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found.");
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
          mainTaks,
          jobRequirements,
          advantages
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response?.data?.message);

    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message || "Ismeretlen hiba lépett fel.");
      } else {
        toast.error("Ismeretlen hiba lépett fel.")
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
                  <img src="./job-description.png" alt="last name icon" />
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
                  <div onClick={() => setIsFaq1Open(!isFaq1Open)} className={styles.faqTitle}>
                    <h2>Munkavégzés helye</h2>
                    <img
                      className={styles.faq}
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
                        <img src="./location.png" alt="city icon" />
                      </div>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Utca, házszám"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                        <img src="./location.png" alt="address icon" />
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ 2 */}
                <div className={styles.faqElement}>
                  <div onClick={() => setIsFaq2Open(!isFaq2Open)} className={`${styles.faqTitle} ${isFaq2Open ? "open" : ""}`}>
                    <h2>Leírás megadása</h2>
                    <img
                      className={styles.faq}
                      src={isFaq2Open ? "./src/assets/minus-sign.png" : "./src/assets/plus-sign.png"}
                    />
                  </div>
                  {isFaq2Open && (
                    <div className={styles.faqContent}>
                      <div className={styles.inputBox}>
                        <textarea
                          placeholder="Amit kínálunk"
                          value={ourOffer}
                          onChange={(e) => setOurOffer(e.target.value)}
                          required
                          className={styles.textarea}
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <textarea
                          placeholder="Főbb feladatok"
                          value={mainTaks}
                          onChange={(e) => setmainTaks(e.target.value)}
                          required
                          className={styles.textarea}
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <textarea
                          placeholder="Álláshoz tartozó elvárások"
                          value={jobRequirements}
                          onChange={(e) => setJobRequirements(e.target.value)}
                          required
                          className={styles.textarea}
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <textarea
                          placeholder="Előnyt jelent"
                          value={advantages}
                          onChange={(e) => setAdvantages(e.target.value)}
                          required
                          className={styles.textarea}
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
              Munka létrehozása
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewJob;
