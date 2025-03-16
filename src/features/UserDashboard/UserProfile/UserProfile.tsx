import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./UserProfile.module.css";
import UserNavbar from "../../../components/UserNavbar/UserNavbar";

const UserProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthName, setBirthName] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [countryOfBirth, setCountryOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [studentCardNumber, setStudentCardNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [studyStartDate, setStudyStartDate] = useState("");
  const [studyEndDate, setStudyEndDate] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Nincs bejelentkezve.");
          return;
        }
  
        const response = await axios.get(
          "https://localhost:7067/api/user/student-details-datas",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.data) {
          const user = response.data;
  
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setEmail(user.email || "");
          setPhone(user.phoneNumber || "");
          setDateOfBirth(user.dateOfBirth || "");
          setBirthName(user.birthName || "");
          setMothersName(user.mothersName || "");
          setCountryOfBirth(user.countryOfBirth || "");
          setPlaceOfBirth(user.placeOfBirth || "");
          setGender(user.gender || "");
          setCitizenship(user.citizenship || "");
          setStudentCardNumber(user.studentCardNumber || "");
          setBankAccountNumber(user.bankAccountNumber || "");
          setCountry(user.country || "");
          setPostalCode(user.postalCode || "");
          setCity(user.city || "");
          setAddress(user.address || "");
          setSchoolName(user.schoolName || "");
          setStudyStartDate(user.studyStartDate || "");
          setStudyEndDate(user.studyEndDate || "");
        }
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
        toast.error("Hiba történt az adatok lekérésekor.");
      }
    };
    fetchUserData();
  }, []);
  

  // PUT kérés küldése az adatok frissítéséhez
  const [originalDates, setOriginalDates] = useState({
    dateOfBirth: "",
    studyStartDate: "",
    studyEndDate: "",
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Nincs bejelentkezve.");
          return;
        }
  
        const response = await axios.get(
          "https://localhost:7067/api/user/student-details-datas",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
console.log(response);


        if (response.data) {
          const user = response.data;
  
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setEmail(user.email || "");
          setPhone(user.phoneNumber || "");
          setDateOfBirth(user.dateOfBirth || "");
          setBirthName(user.birthName || "");
          setMothersName(user.mothersName || "");
          setCountryOfBirth(user.countryOfBirth || "");
          setPlaceOfBirth(user.placeOfBirth || "");
          setGender(user.gender || "");
          setCitizenship(user.citizenship || "");
          setStudentCardNumber(user.studentCardNumber || "");
          setBankAccountNumber(user.bankAccountNumber || "");
          setCountry(user.country || "");
          setPostalCode(user.postalCode || "");
          setCity(user.city || "");
          setAddress(user.address || "");
          setSchoolName(user.schoolName || "");
          setStudyStartDate(user.studyStartDate || "");
          setStudyEndDate(user.studyEndDate || "");
  
          // Eredeti dátumok mentése
          setOriginalDates({
            dateOfBirth: user.dateOfBirth || "",
            studyStartDate: user.studyStartDate || "",
            studyEndDate: user.studyEndDate || "",
          });
        }
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
        toast.error("Hiba történt az adatok lekérésekor.");
      }
    };
    fetchUserData();
  }, []);
  
  const handlesubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Nincs bejelentkezve.");
        return;
      }
  
      const updatedData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        dateOfBirth: dateOfBirth === originalDates.dateOfBirth ? null : dateOfBirth,
        birthName,
        mothersName,
        countryOfBirth,
        placeOfBirth,
        gender,
        citizenship,
        studentCardNumber,
        bankAccountNumber,
        country,
        postalCode,
        city,
        address,
        schoolName,
        studyStartDate: studyStartDate === originalDates.studyStartDate ? null : studyStartDate,
        studyEndDate: studyEndDate === originalDates.studyEndDate ? null : studyEndDate,
      };
  
      const response = await axios.put(
        `https://localhost:7067/api/user/student-details`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        toast.success("A profil sikeresen frissítve!");
      }
    } catch (error) {
      console.error("Hiba az adatok frissítésekor:", error);
      toast.error("Hiba történt az adatok frissítésekor.");
    }
  };
  

  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.content}>
        <h3>Személyes Adatok</h3>
        <form className={styles.newJobForm}>
          <div className={styles.inputBox}><label>Vezetéknév</label><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Keresztnév</label><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Telefonszám</label><input type="text" value={phoneNumber} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Születési Dátum</label><input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}  /></div>
          <div className={styles.inputBox}><label>Születési Név</label><input type="text" value={birthName} onChange={(e) => setBirthName(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Anyja Neve</label><input type="text" value={mothersName} onChange={(e) => setMothersName(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Születési Ország</label><input type="text" value={countryOfBirth} onChange={(e) => setCountryOfBirth(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Születési Hely</label><input type="text" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Nem</label><input type="text" value={gender} onChange={(e) => setGender(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Állampolgárság</label><input type="text" value={citizenship} onChange={(e) => setCitizenship(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Diákigazolványszám</label><input type="text" value={studentCardNumber} onChange={(e) => setStudentCardNumber(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Bankszámlaszám</label><input type="text" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Ország</label><input type="text" value={country} onChange={(e) => setCountry(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Irányítószám</label><input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Város</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Cím</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Iskola Neve</label><input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Tanulmány kezdete</label><input type="date" value={studyStartDate} onChange={(e) => setStudyStartDate(e.target.value)} /></div>
          <div className={styles.inputBox}><label>Tanulmány Vége</label><input type="date" value={studyEndDate} onChange={(e) => setStudyEndDate(e.target.value)} /></div>
        </form>
        <button type="submit" onClick={handlesubmit} className="registerBtn">Frissítés</button>
      </div>
    </div>
  );
};

export default UserProfile;
