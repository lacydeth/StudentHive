import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import WorkCard from "../../components/WorkCard/WorkCard";
import styles from "./Works.module.css";
import Title from "../../components/Title/Title";
import Footer from "../../components/Footer/Footer";

type WorkCardData = {
  id: number;
  title: string;
  salary: string;
  location: string;
  category: string;
  image: string;
  hourlyRate: number;
  createdAt: string;
};

const Works = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [workCards, setWorkCards] = useState<WorkCardData[]>([]);
  const [filteredWorkCards, setFilteredWorkCards] = useState<WorkCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const shiftsPerPage = 8;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 820);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get("https://localhost:7067/api/general/workcards")
      .then((response) => {
        setWorkCards(response.data);
        setFilteredWorkCards(response.data);
      })
      .catch((error) => console.error("Error fetching work cards:", error));

    axios
      .get("https://localhost:7067/api/organization/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    axios
      .get("https://localhost:7067/api/general/cities")
      .then((response) => setLocations(response.data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  useEffect(() => {
    const sortData = [...filteredWorkCards];

    switch (sortOption) {
      case "hourlyRateAsc":
        sortData.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "hourlyRateDesc":
        sortData.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "createdAtAsc":
        sortData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "createdAtDesc":
        sortData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    setFilteredWorkCards(sortData);
  }, [sortOption]);

  const handleSearch = () => {
    const filtered = workCards.filter((work) => {
      const matchesTitle = work.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? work.category === selectedCategory : true;
      const matchesLocation = selectedLocation ? work.location === selectedLocation : true;
      return matchesTitle && matchesCategory && matchesLocation;
    });
    setFilteredWorkCards(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLocation("");
    setFilteredWorkCards(workCards);
    setCurrentPage(1); 
  };

  const indexOfLastShift = currentPage * shiftsPerPage;
  const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
  const currentShifts = filteredWorkCards.slice(indexOfFirstShift, indexOfLastShift);
  const totalPages = Math.ceil(filteredWorkCards.length / shiftsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
                <input
                  placeholder="Keresés..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className={styles.inputBox}>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Kategória</option>
                  {categories.map((category: { id: number; categoryName: string }) => (
                    <option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputBox}>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                  <option value="">Lokáció</option>
                  {locations.map((location: { city: string }) => (
                    <option key={location.city} value={location.city}>
                      {location.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <hr className={styles.line} />
            <div className={styles.row}>
              <div className={styles.inputBox}>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="" disabled>
                    Rendezés
                  </option>
                  <option value="hourlyRateAsc">Órabér növekvő</option>
                  <option value="hourlyRateDesc">Órabér csökkenő</option>
                  <option value="createdAtAsc">Létrehozás dátuma növekvő</option>
                  <option value="createdAtDesc">Létrehozás dátuma csökkenő</option>
                </select>
              </div>
              <div className={styles.btnGroup}>
                <button className={styles.btn} onClick={handleSearch}>
                  <img src="./search.png" alt="search icon" />
                </button>
                <button className={styles.filter} onClick={handleClearFilters}>
                  Szűrők törlése
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.workCards}>
          {currentShifts.length > 0 ? (
            currentShifts.map((work) => <WorkCard key={work.id} {...work} />)
          ) : (
            <p className={styles.noData}>Nincs elérhető munka.</p>
          )}
        </div>
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Előző
          </button>
          <span>Oldal {currentPage} / {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages || totalPages == 0}>
            Következő
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Works;