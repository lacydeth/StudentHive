import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Modals.module.css";

type JobViewModalProps = {
  job: {
    id: string;
    title: string;
    address: string;
    hourlyRate: number;
    city: string;
    ourOffer: string;
    MainTaks: string;
    jobRequirements: string;
    advantages: string;
    categoryId: number;
  };
};

const JobViewModal = ({ job }: JobViewModalProps) => {
  const [title, setTitle] = useState<string>(job.title);
  const [address, setAddress] = useState<string>(job.address);
  const [hourlyRate, setHourlyRate] = useState<number>(job.hourlyRate);
  const [city, setCity] = useState<string>(job.city);
  const [ourOffer, setOurOffer] = useState<string>(job.ourOffer);
  const [MainTaks, setMainTasks] = useState<string>(job.MainTaks);
  const [jobRequirements, setJobRequirements] = useState<string>(job.jobRequirements);
  const [advantages, setAdvantages] = useState<string>(job.advantages);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7067/api/organization/categories");
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const categoryid = job.categoryId;
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request = {
      title,
      categoryid: categoryid.toString(),
      address,
      hourlyRate,
      city,
      ourOffer,
      MainTaks,
      jobRequirements,
      advantages,
    };
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://localhost:7067/api/organization/update-job/${job.id}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("A munkaadatok frissítése sikeres!");
      setError(null);
    } catch (err) {
      setError("Nem sikerült az adatok frissítése!");
      setSuccess(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Munka adatai</h2>
      <form className={styles.orgForm} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Munka címe"
              value={job.id}
              required readOnly
            />
            <img src="./id-card.png" alt="id card icon" />
          </div>

          {/* Read-Only Category */}
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Kategória"
              value={job.categoryId}
              readOnly
            />
            <img src="./category-icon.png" alt="category icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Munka címe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <img src="./office-building.png" alt="job title icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Cím"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <img src="./location.png" alt="address icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="number"
              placeholder="Órabér"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              required
            />
            <img src="./money.png" alt="hourly rate icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Város"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <img src="./location-city.png" alt="city icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              placeholder="Ajánlatunk"
              value={ourOffer}
              onChange={(e) => setOurOffer(e.target.value)}
              required
            />
            <img src="./offer.png" alt="our offer icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              placeholder="Fő Feladatok"
              value={MainTaks}
              onChange={(e) => setMainTasks(e.target.value)}
              required
            />
            <img src="./tasks.png" alt="main tasks icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              placeholder="Munkaköri Követelmények"
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
              required
            />
            <img src="./requirements.png" alt="requirements icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              placeholder="Előnyök"
              value={advantages}
              onChange={(e) => setAdvantages(e.target.value)}
              required
            />
            <img src="./advantages.png" alt="advantages icon" />
          </div>
        </div>

        <div className={styles.footer}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit">Adatok frissítése</button>
        </div>
      </form>
    </div>
  );
};

export default JobViewModal;
