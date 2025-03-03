import UserNavbar from "../UserNavbar/UserNavbar"
import styles from "./UserShiftPage.module.css"
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import "./calendar-custom.css"
const UserShiftPage = () => {
  const [date, setDate] = useState(new Date())

  const handleDateChange = (newDate) => {
    setDate(newDate)
    console.log('Selected date:', newDate)
  }

  return (
    <div className={styles.container}>
      <UserNavbar/>
      <div className={styles.content}>
        <h2>Válaszd ki melyik napon szeretnél dolgozni.</h2>
        <Calendar 
          onChange={handleDateChange}
          value={date}
        />
      </div>
    </div>
  )
}

export default UserShiftPage