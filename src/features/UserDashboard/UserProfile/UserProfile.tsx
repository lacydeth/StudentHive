import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./UserProfile.module.css";
import UserNavbar from "../../../components/UserNavbar/UserNavbar";

 const validateForm = ({
  firstName,
  lastName,
  email,
  phone,
  birthName,
  mothersName,
  countryOfBirth,
  placeOfBirth,
  citizenship,
  studentCardNumber,
  bankAccountNumber,
  postalCode,
  city,
  address,
  schoolName,
}: any) => {
  const errors: any = {};

  const validateTextOnly = (value: string, maxLength: number) => {
    return /^[a-zA-Z]+$/.test(value) && value.length <= maxLength;
  };

  if (!validateTextOnly(firstName, 64)) errors.firstName = "Vezetéknév csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(lastName, 64)) errors.lastName = "Keresztnév csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(birthName, 64)) errors.birthName = "Születési név csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(mothersName, 64)) errors.mothersName = "Anyja neve csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(countryOfBirth, 64)) errors.countryOfBirth = "Születési ország csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(placeOfBirth, 64)) errors.placeOfBirth = "Születési hely csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(citizenship, 64)) errors.citizenship = "Állampolgárság csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(city, 64)) errors.city = "Város csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!validateTextOnly(schoolName, 64)) errors.schoolName = "Iskola neve csak karaktereket tartalmazhat és max 64 karakter lehet!";
  if (!/^\d{9}$/.test(phone)) errors.phone = "A telefonszámnak 9 számjegynek kell lennie!";
  if (!/^\d{11}$/.test(studentCardNumber)) errors.studentCardNumber = "Diákigazolványszámnak 11 számjegyűnek kell lennie!";
  if (!/^\d{32}$/.test(bankAccountNumber)) errors.bankAccountNumber = "Bankszámlaszámnak 32 számjegyűnek kell lennie!";
  if (!/^\d{4}$/.test(postalCode)) errors.postalCode = "Irányítószámnak 4 számjegyűnek kell lennie!";
  if (!address) errors.address = "Cím nem lehet üres!";
  if (!email) errors.email = "Email cím nem lehet üres!";

  return errors;
};

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

          const safeDate = (date: string | null) => 
            date ? new Date(date).toISOString().split("T")[0] : "";

          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setEmail(user.email || "");
          setPhone(user.phoneNumber || "");
          setDateOfBirth(safeDate(user.dateOfBirth));
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
          setStudyStartDate(safeDate(user.studyStartDate));
          setStudyEndDate(safeDate(user.studyEndDate));
        }
      } catch (error) {
        toast.error("Hiba az adatok lekérésekor:");
        toast.error("Hiba történt az adatok lekérésekor.");
      }
    };
    fetchUserData();
  }, []);

  const updateUserProfile = async () => {
    const validationErrors = validateForm({
      firstName,
      lastName,
      email,
      phoneNumber,
      birthName,
      mothersName,
      countryOfBirth,
      placeOfBirth,
      gender,
      citizenship,
      studentCardNumber,
      bankAccountNumber,
      postalCode,
      city,
      address,
      schoolName,
    });

   

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Kérjük, javítson minden hibát!");
      return;
    }

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
        dateOfBirth,
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
        studyStartDate,
        studyEndDate,
      };

      const response = await axios.put(
        "https://localhost:7067/api/user/student-details-datas",
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
        <div className={styles.inputBox}><label>Születési Dátum</label><input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} /></div>
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
      <button onClick={updateUserProfile}>Frissítés</button>
    </div>
  </div>
  );
};

export default UserProfile;
