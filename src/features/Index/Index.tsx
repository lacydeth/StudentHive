import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import Title from "../../components/Title/Title";
import "./Index.css";
import { useEffect } from "react";

const IndexPage = () => {
  useEffect(() => {
    const updateAOS = () => {
      const elements = document.querySelectorAll("[data-aos]");
      elements.forEach((el) => {
        if (window.innerWidth < 1000) {
          el.setAttribute("data-aos", "fade-up");
        }
      });
    };

    // Initial call to set the AOS attributes
    updateAOS();

    // Update AOS attributes on resize
    window.addEventListener("resize", updateAOS);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateAOS);
    };
  }, []);

  return (
    <div className="home-page">
      <Navbar />
      <section className="welcome-section">
        <div className="title">
          <h1>StudentHive</h1>
          <h3>Álommunka. Könnyedén. Azonnal.</h3>
        </div>
        <div className="search">
          <h1>Kezdj neki a keresésnek!</h1>
          <div className="job-search">
            <h4>Munkakör</h4>
            <select className="search-select">
              <option value="" disabled selected>
                Elérhető munkakörök
              </option>
            </select>
          </div>
          <button className="search-btn">
            keresés
            <img src="./loupe.png" alt="Kép egy nagyítóról."></img>
          </button>
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
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sunt dolorum
            temporibus atque rem aliquam adipisci nemo natus, modi dolorem. Molestias
            odio eaque quis enim neque temporibus placeat provident distinctio!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias odio eaque
            quis enim neque temporibus placeat provident distinctio!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias odio eaque
            quis enim neque temporibus placeat provident distinctio!
          </p>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default IndexPage;
