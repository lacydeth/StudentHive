import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar"
import styles from "../Unauthorized/Unauthorized.module.css"
import { routes } from "../../App"

const Unauthorized = () => {
  return (
    <div className={styles.unauthorized}>
        <Navbar/>
        <div className={styles.content}>
            <img src="./warning.png"></img>
            <h1>Hiba</h1>
            <p>Nincs hozzáférésed ehhez az oldalhoz!</p>
            <Link className={styles.back} to={routes.homePage.path}>
              Vissza a főoldalra
            </Link>
        </div>
    </div>
  )
}

export default Unauthorized