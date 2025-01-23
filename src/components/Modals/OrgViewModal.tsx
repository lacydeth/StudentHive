import { useState } from "react";
import axios from "axios";

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
    <div>
      <h2>Organization Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input type="text" value={organization.id} readOnly />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
        <div>
          <label>Created At:</label>
          <input
            type="text"
            value={new Date(organization.createdAt).toLocaleString()}
            readOnly
          />
        </div>
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
        <button type="submit">Frissítés</button>
      </form>
    </div>
  );
};

export default OrgViewModal;
