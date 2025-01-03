import "./Index.css";

const IndexPage = () => {
  return (
    <div className="home-page">
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
            Keresés
            <img src="./loupe.png" alt="Kép egy nagyítóról."></img>
          </button>
        </div>
      </section>
      <section className="benefits-section">
        <div className="custom-shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#99BC85" fill-opacity="1" d="M0,192L40,202.7C80,213,160,235,240,224C320,213,400,171,480,144C560,117,640,107,720,122.7C800,139,880,181,960,170.7C1040,160,1120,96,1200,74.7C1280,53,1360,75,1400,85.3L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
            </svg>
        </div>
        <div className='title-comp'>
          <p>Funkcióink</p>
          <h2>Modern álláskeresés</h2>
      </div>
        <div className="benefits-content">

        </div>
        <div className="custom-shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#99BC85" fill-opacity="1" d="M0,96L24,122.7C48,149,96,203,144,234.7C192,267,240,277,288,282.7C336,288,384,288,432,240C480,192,528,96,576,80C624,64,672,128,720,149.3C768,171,816,149,864,128C912,107,960,85,1008,106.7C1056,128,1104,192,1152,224C1200,256,1248,256,1296,261.3C1344,267,1392,277,1416,282.7L1440,288L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
            </svg>
        </div>
      </section>
    </div>
  );
};

export default IndexPage;
