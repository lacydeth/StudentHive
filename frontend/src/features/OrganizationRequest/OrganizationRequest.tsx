import Footer from "../../components/Footer/Footer"
import Navbar from "../../components/Navbar/Navbar"
import styles from "./OrganizationRequest.module.css"

const OrganizationRequest = () => {
  return (
    <div className={styles.container}>
        <Navbar/>
        <div className={styles.content}>
            <div className={styles.benefits}>
                <h1>Miért válaszd a StudentHive-ot?</h1>
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <img src="/snap.png"></img>
                        <h2>Kényelmes, gyors és egyszerű munka, illetve műszak kezelés</h2>
                    </div>
                    <div className={styles.card}>
                        <img src="/security.png"></img>
                        <h2>Megbízható szolgáltatás és panaszkezelés</h2>
                    </div>
                    <div className={styles.card}>
                        <img src="/trend.png"></img>
                        <h2>Hatalmas felhasználóbázisunkkal növelheti a diákok számát</h2>
                    </div>
                </div>
            </div>
            <div className={styles.requestSteps}>
                <h1>Hogyan működik?</h1>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <h1>1</h1>
                        <div className={styles.text}>
                            <h1>Igénylés megkezdése</h1>
                            <p>Írjon egy üzenetet az <b>info.studenthive@gmail.com</b> e-mail címre, melyben kérvényezi a szövetkezeti profil létrehozását.</p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <h1>2</h1>
                        <div className={styles.text}>
                            <h1>Profil létrehozása</h1>
                            <p>Egy munkatársunk felveszi önnel a kapcsolatot adatfelvétel céljából, ha ez sikeres létrehozunk önnek egy szövetkezeti profilt.</p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <h1>3</h1>
                        <div className={styles.text}>
                            <h1>Sikeres igénylés</h1>
                            <p>Megadott e-mail címére kiküldjük a profilhoz tartozó jelszót, mellyel be tud lépni és élvezheti a <b>StudentHive</b> előnyeit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default OrganizationRequest