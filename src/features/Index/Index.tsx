import "./Index.css"
const IndexPage = () => {
  return (
    <div className="home-page">
        <div className="welcome-section">
            <div className="title">
                <h1>StudentHive</h1>
                <h3>Álommunka. Könnyedén. Azonnal.</h3>
            </div>
            <div className="search">
                <h1>Kezdj neki a keresésnek!</h1>
                <div className="job-search">
                    <h4>Munkakör</h4>
                    <select className="search-select">
                        <option value="" disabled selected>Elérhető munkakörök</option>
                    </select>
                </div>
                <button className="search-btn">Keresés<img src="./loupe.png" alt="Kép egy nagyítóról."></img></button>
            </div>
        </div> 
        <div className="benefits-section">
        
        </div>
    </div>
  );
};

export default IndexPage;
