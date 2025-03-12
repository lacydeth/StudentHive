import Aos from "aos";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import Title from "../../components/Title/Title";
import "./Index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../utils/routes";

const IndexPage = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const updateAOS = () => {
      const elements = document.querySelectorAll("[data-aos]");
      elements.forEach((el) => {
        if (window.innerWidth < 1000) {
          el.setAttribute("data-aos", "fade-up");
        }
      });
      Aos.refresh();
      axios
        .get("https://localhost:7067/api/organization/categories")
        .then((response) => setCategories(response.data))
        .catch((error) => console.error("Error fetching categories:", error));

      axios
        .get("https://localhost:7067/api/general/cities")
        .then((response) => setLocations(response.data))
        .catch((error) => console.error("Error fetching locations:", error));
    };

    updateAOS();

    window.addEventListener("resize", updateAOS);

    return () => {
      window.removeEventListener("resize", updateAOS);
    };
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (selectedCategory) {
      queryParams.append("category", selectedCategory);
    }
    
    if (selectedLocation) {
      queryParams.append("location", selectedLocation);
    }
  
    navigate(`/works?${queryParams.toString()}`);
  };
  return (
    <div className="home-page">
      <Navbar />
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="hero-text" data-aos="fade-right">
            <h1>Összekapcsoljuk a tehetséget a lehetőségekkel</h1>
            <p>
              Találd meg a tökéletes diákmunkát, vagy alkalmazz képzett jelölteket gyorsan és hatkékonyan.
              Csatlakozz több ezer diákhoz és munkaadóhoz, akik már megtalálták a megfelelő állást a StudentHive-on.
            </p>
            <ul className="hero-features">
              <li>
                <img src="/checkmark.png" alt="Checkmark" />
                <span>500+ Diákmunka elérhető</span>
              </li>
              <li>
                <img src="/checkmark.png" alt="Checkmark" />
                <span>Több, mint 100 megbízható cég</span>
              </li>
              <li>
                <img src="/checkmark.png" alt="Checkmark" />
                <span>Villámgyors jelentkezési folyamat</span>
              </li>
            </ul>
          </div>

          <div className="search-container" data-aos="fade-left">
            <h2>Kezdj bele az álláskeresésbe</h2>
            <div className="job-search">
              <label>Kategória</label>
              <select className="search-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Válassz egy kategóriát..</option>
                  {categories.map((category: { id: number; categoryName: string }) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>

              <label>Város</label>
              <select
                className="search-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Válassz egy várost..</option>
                {locations.map((location: { city: string }) => (
                  <option key={location.city} value={location.city}>
                    {location.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="cta-buttons">
              <button className="search-btn" onClick={handleSearch}>
                Keresés
                <img src="/loupe.png" alt="Search" />
              </button>
              <Link className="secondary-btn" to={routes.organizationRequest.path}>
                Még nincs fiókom
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="benefits-section">
        <Title subTitle="Funkcióink" title="Modern álláskeresés" />
        <div className="benefits-content">
          <div className="benefit-cards" data-aos="fade-up" data-aos-duration="1500">
            <div className="benefit-card">
              <img src="./public-administration.png" alt="Adminisztráció"></img>
              <div className="benefit-title">
                <h2>Egyszerű adminisztráció</h2>
                <p>
                  Minden folyamat egy helyen: könnyen kezelhető rendszer a munkaügyi
                  adminisztrációhoz.
                </p>
              </div>
            </div>
            <div className="benefit-card">
              <img src="./timetable.png" alt="Adminisztráció"></img>
              <div className="benefit-title">
                <h2>Rugalmas időbeosztás</h2>
                <p>
                  Időpontok és műszakok egyszerű tervezése és módosítása valós időben.
                </p>
              </div>
            </div>
            <div className="benefit-card">
              <img src="./budget.png" alt="Adminisztráció"></img>
              <div className="benefit-title">
                <h2>Átlátható pénzügyek</h2>
                <p>
                  Részletes statisztikák és kimutatások a bérek és kiadások nyomon
                  követésére.
                </p>
              </div>
            </div>
            <div className="benefit-card">
              <img src="./contract.png" alt="Szerződés"></img>
              <div className="benefit-title">
                <h2>Szerződéskötés</h2>
                <p>
                  Gyors és egyszerű: automatikus szerződéskötés és módosítás néhány
                  kattintással.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="about-section">
        <div className="about-left" data-aos="fade-right" data-aos-duration="1500">
          <img src="./about-team.jpg" className="about-img" />
        </div>
        <div className="about-right" data-aos="fade-left" data-aos-duration="1500">
          <h3>StudentHive története</h3>
          <h2>Miért alapult meg a StudentHive diákmunka fórum?</h2>
            <p>The <strong>StudentHive</strong> diákmunka fórum azzal a céllal jött létre, hogy összekösse a fiatalokat a legjobb munkalehetőségekkel egy könnyen átlátható, modern platformon.</p>

            <p>Az alapítók felismerték, hogy sok diák számára kihívást jelent a megfelelő munka megtalálása, miközben a cégeknek is nehéz elérni a megbízható fiatal munkaerőt. A StudentHive egy olyan közösségi tér, ahol a diákok egyszerűen böngészhetnek az állásajánlatok között, megoszthatják tapasztalataikat, és közvetlenül kapcsolatba léphetnek a munkaadókkal.</p>

            <p>A platform célja, hogy átlátható, gyors és biztonságos lehetőséget nyújtson a diákoknak a munkavállalásra.</p>
        </div>
      </section>
      <section className="role-selection-section">
        <div className="container">
          <div className="role-cards">
            <div className="role-card">
              <div className="role-image-container">
                <img src="/student-image.jpg" alt="Diák" className="role-image"  />
                <div className="role-overlay"></div>
              </div>
              <div className="role-content">
                <h3>Diák vagyok</h3>
                <p>
                  Csatlakozz a StudentHive közösséghez diákként, és találd meg álmaid 
                  diákmunkáját! Böngéssz több száz állásajánlat között, jelentkezz 
                  egyszerűen, és építsd karrieredet már az iskolapadból.
                </p>
                <Link to={routes.registerPage.path} className="role-button">
                  Regisztráció diákként
                  <img src="/right.png" alt="Arrow" className="arrow-icon" />
                </Link>
              </div>
            </div>
            
            <div className="role-card">
              <div className="role-image-container">
                <img src="/company-image.jpg" alt="Iskolaszövetkezet" className="role-image"  />
                <div className="role-overlay"></div>
              </div>
              <div className="role-content">
                <h3>Iskolaszövetkezet vagyok</h3>
                <p>
                  Hirdess állásokat egyszerűen és érj el motivált diákokat azonnal! 
                  Platformunk segítségével gyorsan megtalálhatod a megfelelő jelölteket, 
                  és hatékonyan kezelheted az adminisztrációt.
                </p>
                <Link to={routes.organizationRequest.path} className="role-button">
                  Regisztráció iskolaszövetkezetként
                  <img src="/right.png" alt="Arrow" className="arrow-icon" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default IndexPage;
