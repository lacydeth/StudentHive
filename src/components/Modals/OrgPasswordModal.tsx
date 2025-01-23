import { useState } from "react";
import axios from "axios";

type OrgPasswordModalProps = {
  organizationId: number;
};

const OrgPasswordModal = ({ organizationId }: OrgPasswordModalProps) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("A két jelszó nem egyezik!");
      return;
    }

    try {
      const response = await axios.put(
        `https://localhost:7067/api/admin/organization/${organizationId}/password`,
        { newPassword }
      );
      setSuccess("A jelszó sikeresen megváltozott!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Nem sikerült a jelszó módosítása!");
    }
  };

  return (
    <div>
      <h2>Jelszó módosítása</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <div>
        <label htmlFor="newPassword">Új jelszó</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Jelszó megerősítése</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button onClick={handlePasswordChange}>Jelszó módosítása</button>
    </div>
  );
};

export default OrgPasswordModal;