"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import WorkCard from "../../components/WorkCard/WorkCard";
import styles from "./Works.module.css";
import Title from "../../components/Title/Title";

const Works = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Check screen width and update state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 820);
    handleResize(); // Call it initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.worksContainer}>
      <Navbar />
      <div className={styles.content}>
        <Title subTitle="Munkáink" title="Tekintsd meg az összes elérhető munkát egy helyen!"/>
        {isMobile && (
            <button className={styles.mobileFilterBtn} onClick={() => setShowFilters(!showFilters)}>
                <img src={showFilters ? "./close.png" : "./filter.png"} alt="toggle icon" />
                {!showFilters && " Szűrők"}
                {showFilters && " Bezárás"}
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
          <WorkCard />
          <WorkCard />
          <WorkCard />
          <WorkCard />
          <WorkCard />
          <WorkCard />
        </div>
      </div>
    </div>
  );
};

export default Works;
