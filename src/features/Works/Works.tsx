"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import WorkCard from "../../components/WorkCard/WorkCard";
import styles from "./Works.module.css";
import Title from "../../components/Title/Title";

type WorkCardData = {
  title: string;
  salary: string;
  location: string;
  category: string;
  image: string;
}

const Works = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [workCards, setWorkCards] = useState<WorkCardData[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 820);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get("https://localhost:7067/api/general/workcards")
      .then((response) => setWorkCards(response.data))
      .catch((error) => console.error("Error fetching work cards:", error));
  }, []);

  return (
    <div className={styles.worksContainer}>
      <Navbar />
      <div className={styles.content}>
        <Title subTitle="Munkáink" title="Tekintsd meg az összes elérhető munkát egy helyen!" />
        {isMobile && (
          <button className={styles.mobileFilterBtn} onClick={() => setShowFilters(!showFilters)}>
            <img src={showFilters ? "./close.png" : "./filter.png"} alt="toggle icon" />
            {!showFilters ? " Szűrők" : " Bezárás"}
          </button>
        )}
        {(showFilters || !isMobile) && (
          <div className={styles.filterOptions}>
            <div className={styles.row}>
              <div className={styles.inputBox}>
                <input placeholder="Keresés..." />
              </div>
              <div className={styles.inputBox}>
                <select>
                  <option value="" disabled selected>
                    Kategória
                  </option>
                </select>
              </div>
              <div className={styles.inputBox}>
                <select>
                  <option value="" disabled selected>
                    Lokáció
                  </option>
                </select>
              </div>
            </div>
            <hr className={styles.line} />
            <div className={styles.row}>
              <div className={styles.inputBox}>
                <select>
                  <option value="" disabled selected>
                    Rendezés
                  </option>
                </select>
              </div>
              <div className={styles.btnGroup}>
                <button className={styles.btn}>
                  <img src="./search.png" alt="search icon" />
                </button>
                <button className={styles.filter}>Szűrők törlése</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.workCards}>
          {workCards.length > 0 ? (
            workCards.map((work, index) => <WorkCard key={index} {...work} />)
          ) : (
            <p className={styles.noData}>Nincs elérhető munka.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Works;
