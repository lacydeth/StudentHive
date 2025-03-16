import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Modals.module.css";

type OrgViewModalProps = {
  organization: {
    id: string;
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    createdAt: string;
  };
};

const OrgViewModal = ({ organization }: OrgViewModalProps) => {
  const [name, setName] = useState<string>(organization.name);
  const [address, setAddress] = useState<string>(organization.address);
  const [contactEmail, setContactEmail] = useState<string>(organization.contactEmail);
  const [contactPhone, setContactPhone] = useState<string>(organization.contactPhone);

  const validateInputs = () => {
    if (!name.trim()) {
      toast.error("A szervezet neve megadása kötelező!");
      return false;
    }
    if (!address.trim()) {
      toast.error("A szervezet címe megadása kötelező!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      toast.error("Érvénytelen email cím!");
      return false;
    }
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(contactPhone)) {
      toast.error("Érvénytelen telefonszám! 10-15 számjegy kell, opcionális '+' előtaggal.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const updatedOrganization = { name, address, contactEmail, contactPhone };

    try {
      const response = await axios.put(
        `https://localhost:7067/api/admin/organization/${organization.id}`,
        updatedOrganization,
        {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
      );
      toast.success(response.data.message || "A szervezet adatainak frissítése sikeres!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Nem sikerült az adatok frissítése!");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Szervezet adatai</h2>
      <form className={styles.orgForm} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputBox}>
            <input type="text" value={organization.id} required readOnly />
            <img src="./id-card.png" alt="id card icon" />
          </div>
          <div className={styles.inputBox}>
            <input type="text" placeholder="Szervezet neve" value={name} onChange={(e) => setName(e.target.value)} required />
            <img src="./office-building.png" alt="organization name icon" />
          </div>
          <div className={styles.inputBox}>
            <input type="text" placeholder="Szervezet címe" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <img src="./location.png" alt="address icon" />
          </div>
          <div className={styles.inputBox}>
            <input type="email" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
            <img src="./mail.png" alt="email icon" />
          </div>
          <div className={styles.inputBox}>
            <input type="tel" placeholder="Telefonszám" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
            <img src="./telephone.png" alt="phone icon" />
          </div>
        </div>
        <div className={styles.footer}>
          <button type="submit">Adatok frissítése</button>
        </div>
      </form>
    </div>
  );
};

export default OrgViewModal;
