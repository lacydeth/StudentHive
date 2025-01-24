import { useState } from "react";
import axios from "axios";
import styles from "./Modals.module.css"
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedOrganization = {
      name,
      address,
      contactEmail,
      contactPhone,
    };

    try {
      const response = await axios.put(
        `https://localhost:7067/api/admin/organization/${organization.id}`,
        updatedOrganization
      );
      setSuccess("A szervezet adatainak frissítése sikeres!");
      setError(null); 
    } catch (err) {
      setError("Nem sikerült az adatok frissítése!");
      setSuccess(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Szervezet adatai</h2>
      <form
        className={styles.orgForm}
        onSubmit={handleSubmit}
      >
        <div className={styles.formWrapper}>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="Szervezet neve"
                value={organization.id}
                required readOnly
              />
              <img src="./id-card.png" alt="id card icon" />
            </div>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="Szervezet neve"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <img src="./office-building.png" alt="organization name icon" />
            </div>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="Szervezet címe"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <img src="./location.png" alt="address icon" />
            </div>
            <div className={styles.inputBox}>
              <input
                type="email"
                placeholder="Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <img src="./mail.png" alt="email icon" />
            </div>
            <div className={styles.inputBox}>
              <input
                type="tel"
                placeholder="Telefonszám"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
              <img src="./telephone.png" alt="phone icon" />
            </div>
        </div>
        <div className={styles.footer}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit">
            adatok frissítése
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrgViewModal;
