import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Modals.module.css";

interface JobPatchViewModalProps {
  jobId: number;
}

const JobPatchViewModal: React.FC<JobPatchViewModalProps> = ({ jobId }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string>("");

  useEffect(() => {
    setCurrentJobId(jobId.toString());
  }, [jobId]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("https://localhost:7067/api/organization/agents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAgent(Number(event.target.value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedAgent === null || currentJobId === "") {
      alert("Kérlek válassz egy közvetítőt és add meg a munkát (Job ID).");
      return;
    }

    try {
      const response = await axios.patch(
        `https://localhost:7067/api/organization/assign-agent/${selectedAgent}/${currentJobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Közvetítő sikeresen hozzárendelve:", response.data);
      alert("Közvetítő sikeresen hozzárendelve!");
    } catch (error) {
      console.error("Hiba történt a közvetítő hozzárendelésekor:", error);
      alert("Hiba történt a közvetítő hozzárendelésekor.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Válaszd ki a közvetítőt és rendelj hozzá munkát!</h2>
      <form className={styles.orgForm} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputBox}>
            <select value={selectedAgent || ""} onChange={handleAgentChange} required>
              <option value="" disabled>
                Válassz egy közvetítőt
              </option>
              {agents.map((agent: { id: number; firstName: string; lastName: string }) => (
                <option key={agent.id} value={agent.id}>
                  {agent.firstName} {agent.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.inputBox}>
            <input
              type="text"
              readOnly
              placeholder="Munkakód (Job ID)"
              value={currentJobId}
              required
            />
          </div>
        </div>

        <div className={styles.formWrapper}>
          <button type="submit" className={styles.submitButton}>
            közvetítő hozzárendelése
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPatchViewModal;
