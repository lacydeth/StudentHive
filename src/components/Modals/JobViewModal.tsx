import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Modals.module.css";
import { toast } from "react-toastify";

type JobViewModalProps = {
  job: {
    id: number;
    title: string;
    address: string;
    hourlyRate: number;
    city: string;
    ourOffer: string;
    mainTaks: string;
    jobRequirements: string;
    advantages: string;
    categoryId: number;
    categoryName: string;
  };
};

const JobViewModal = ({ job }: JobViewModalProps) => {
  const [title, setTitle] = useState<string>(job.title);
  const [address, setAddress] = useState<string>(job.address);
  const [hourlyRate, setHourlyRate] = useState<number>(job.hourlyRate);
  const [city, setCity] = useState<string>(job.city);
  const [ourOffer, setOurOffer] = useState<string>(job.ourOffer || "");
  const [mainTaks, setMainTasks] = useState<string>(job.mainTaks || "");
  const [jobRequirements, setJobRequirements] = useState<string>(job.jobRequirements || "");
  const [advantages, setAdvantages] = useState<string>(job.advantages || "");
  const [categories, setCategories] = useState<{id: number, categoryName: string}[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(job.categoryId);
  
  useEffect(() => {
    setTitle(job.title);
    setAddress(job.address);
    setHourlyRate(job.hourlyRate);
    setCity(job.city);
    setOurOffer(job.ourOffer || "");
    setMainTasks(job.mainTaks || "");
    setJobRequirements(job.jobRequirements || "");
    setAdvantages(job.advantages || "");
    setSelectedCategoryId(job.categoryId);
  }, [job]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://localhost:7067/api/organization/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (err) {
        console.error("Hiba az adatok betöltése során:", err);
        toast.error("Nem sikerült a kategóriák betöltése!");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request = {
      title,
      categoryId: Number(selectedCategoryId),
      address,
      hourlyRate,
      city,
      ourOffer,
      mainTaks,
      jobRequirements,
      advantages,
    };
    
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://localhost:7067/api/organization/update-job/${job.id}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("A munkaadatok frissítése sikeres!");
    } catch (err) {
      toast.error("Nem sikerült az adatok frissítése!");
      console.log("Hiba az adatok frissítése során:", err)
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
              placeholder="Azonosító"
              value={job.id}
              required readOnly
            />
            <img src="./id-card.png" alt="id card icon" />
          </div>

          <div className={styles.inputBox}>
            <select 
              value={selectedCategoryId} 
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              required
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
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
            <img src="./hourly-rate.png" alt="hourly rate icon" />
          </div>
          
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
            <textarea
              placeholder="Ajánlatunk"
              value={ourOffer} className={styles.textarea}
              onChange={(e) => setOurOffer(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputBox}>
            <textarea
              placeholder="Fő Feladatok"
              value={mainTaks} className={styles.textarea}
              onChange={(e) => setMainTasks(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputBox}>
            <textarea
              placeholder="Munkaköri Követelmények"
              value={jobRequirements} className={styles.textarea}
              onChange={(e) => setJobRequirements(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputBox}>
            <textarea
              placeholder="Előnyök"
              value={advantages} className={styles.textarea}
              onChange={(e) => setAdvantages(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit">Adatok frissítése</button>
      </form>
    </div>
  );
};

export default JobViewModal;