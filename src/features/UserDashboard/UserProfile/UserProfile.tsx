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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  const [originalDates, setOriginalDates] = useState({
    dateOfBirth: "",
    studyStartDate: "",
    studyEndDate: "",
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
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
  
          setOriginalDates({
            dateOfBirth: user.dateOfBirth || "",
            studyStartDate: user.studyStartDate || "",
            studyEndDate: user.studyEndDate || "",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
        toast.error("Hiba történt az adatok lekérésekor.");
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handlesubmit = async () => {
    try {
      let isValid = true;
  
      if (firstName !== "" && (firstName.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(firstName))) {
        toast.error("A vezetéknév csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }
  
      if (lastName !== "" && (lastName.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(lastName))) {
        toast.error("A keresztnév csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }
  
      if (email !== "" && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        toast.error("Érvénytelen email cím formátum.");
        isValid = false;
      }
  
      if (phoneNumber !== "" && !/^\d{11}$/.test(phoneNumber)) {
        toast.error("A telefonszámnak pontosan 11 számjegyből kell állnia.");
        isValid = false;
      }

      if (birthName !== "" && (birthName.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(birthName))) {
        toast.error("A születési név csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (mothersName !== "" && (mothersName.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(mothersName))) {
        toast.error("A anyja neve csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (countryOfBirth !== "" && (countryOfBirth.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(countryOfBirth))) {
        toast.error("A születési ország csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (placeOfBirth !== "" && (placeOfBirth.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(placeOfBirth))) {
        toast.error("A születési hely csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (gender !== "" && (gender.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(gender))) {
        toast.error("A nem csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (citizenship !== "" && (citizenship.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(citizenship))) {
        toast.error("Az állampolgárság csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (studentCardNumber !== "" && !/^\d{11}$/.test(studentCardNumber)) {
        toast.error("A diákigazolványszám pontosan 11 számjegyből kell állnia.");
        isValid = false;
      }

      if (bankAccountNumber !== "" && !/^\d{8}$/.test(bankAccountNumber)) {
        toast.error("A bankszámlaszámnak pontosan 8 számjegyből kell állnia.");
        isValid = false;
      }

      if (country !== "" && (country.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(country))) {
        toast.error("Az ország csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (postalCode !== "" && !/^\d{4}$/.test(postalCode)) {
        toast.error("Az irányítószámnak pontosan 4 számjegyből kell állnia.");
        isValid = false;
      }

      if (city !== "" && (city.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(city))) {
        toast.error("A város csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (address !== "" && (address.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(address))) {
        toast.error("A cím csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }

      if (schoolName !== "" && (schoolName.length > 64 || !/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(schoolName))) {
        toast.error("Az iskola neve csak betűket tartalmazhat és max. 64 karakter lehet.");
        isValid = false;
      }
      // Ha valamelyik validáció megbukott, akkor nem küldjük el a kérést
      if (!isValid) return;
  
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
      
      setLoading(true);
      const response = await axios.put(
        `https://localhost:7067/api/user/student-details`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        toast.success("A profil sikeresen frissítve!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Hiba az adatok frissítésekor:", error);
      toast.error("Hiba történt az adatok frissítésekor.");
      setLoading(false);
    }
  };

  const renderPersonalInfoTab = () => {
    return (
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h4>Általános információk</h4>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Vezetéknév</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              placeholder="Vezetéknév"
            />
          </div>
          <div className={styles.formField}>
            <label>Keresztnév</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              placeholder="Keresztnév"
            />
          </div>
          <div className={styles.formField}>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email cím"
            />
          </div>
          <div className={styles.formField}>
            <label>Telefonszám</label>
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+36 20 123 4567"
            />
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <h4>Születési adatok</h4>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Születési Dátum</label>
            <input 
              type="date" 
              value={dateOfBirth} 
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label>Születési Név</label>
            <input 
              type="text" 
              value={birthName} 
              onChange={(e) => setBirthName(e.target.value)} 
              placeholder="Születési név"
            />
          </div>
          <div className={styles.formField}>
            <label>Anyja Neve</label>
            <input 
              type="text" 
              value={mothersName} 
              onChange={(e) => setMothersName(e.target.value)} 
              placeholder="Anyja neve"
            />
          </div>
          <div className={styles.formField}>
            <label>Születési Ország</label>
            <input 
              type="text" 
              value={countryOfBirth} 
              onChange={(e) => setCountryOfBirth(e.target.value)} 
              placeholder="Magyarország"
            />
          </div>
          <div className={styles.formField}>
            <label>Születési Hely</label>
            <input 
              type="text" 
              value={placeOfBirth} 
              onChange={(e) => setPlaceOfBirth(e.target.value)} 
              placeholder="Budapest"
            />
          </div>
          <div className={styles.formField}>
            <label>Nem</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Válassz...</option>
              <option value="Férfi">Férfi</option>
              <option value="Nő">Nő</option>
              <option value="Egyéb">Egyéb</option>
            </select>
          </div>
          <div className={styles.formField}>
            <label>Állampolgárság</label>
            <input 
              type="text" 
              value={citizenship} 
              onChange={(e) => setCitizenship(e.target.value)} 
              placeholder="Magyar"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAddressTab = () => {
    return (
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h4>Lakcím információk</h4>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Ország</label>
            <input 
              type="text" 
              value={country} 
              onChange={(e) => setCountry(e.target.value)} 
              placeholder="Magyarország"
            />
          </div>
          <div className={styles.formField}>
            <label>Irányítószám</label>
            <input 
              type="text" 
              value={postalCode} 
              onChange={(e) => setPostalCode(e.target.value)} 
              placeholder="1234"
            />
          </div>
          <div className={styles.formField}>
            <label>Város</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              placeholder="Budapest"
            />
          </div>
          <div className={styles.formField}>
            <label>Cím</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Példa utca 42."
            />
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentsTab = () => {
    return (
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h4>Dokumentumok és azonosítók</h4>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Diákigazolványszám</label>
            <input 
              type="text" 
              value={studentCardNumber} 
              onChange={(e) => setStudentCardNumber(e.target.value)} 
              placeholder="123456789"
            />
          </div>
          <div className={styles.formField}>
            <label>Bankszámlaszám</label>
            <input 
              type="text" 
              value={bankAccountNumber} 
              onChange={(e) => setBankAccountNumber(e.target.value)} 
              placeholder="12345678-12345678-12345678"
            />
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <h4>Tanulmányi információk</h4>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Iskola Neve</label>
            <input 
              type="text" 
              value={schoolName} 
              onChange={(e) => setSchoolName(e.target.value)} 
              placeholder="Példa Egyetem"
            />
          </div>
          <div className={styles.formField}>
            <label>Tanulmány kezdete</label>
            <input 
              type="date" 
              value={studyStartDate} 
              onChange={(e) => setStudyStartDate(e.target.value)} 
            />
          </div>
          <div className={styles.formField}>
            <label>Tanulmány Vége</label>
            <input 
              type="date" 
              value={studyEndDate} 
              onChange={(e) => setStudyEndDate(e.target.value)} 
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.pageWrapper}>
        <div className={styles.jobTitle}>
          <h1>Adataim</h1>
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'personal' ? styles.active : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Személyes adatok
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'address' ? styles.active : ''}`}
              onClick={() => setActiveTab('address')}
            >
              Lakcím
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'documents' ? styles.active : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Dokumentumok
            </button>
          </div>
          
          <div className={styles.formContainer}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Adatok betöltése...</p>
              </div>
            ) : (
              <>
                {activeTab === 'personal' && renderPersonalInfoTab()}
                {activeTab === 'address' && renderAddressTab()}
                {activeTab === 'documents' && renderDocumentsTab()}
                
                <div className={styles.submitButtonContainer}>
                  <button 
                    className={styles.submitButton} 
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Mentés...' : 'Adatok mentése'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;