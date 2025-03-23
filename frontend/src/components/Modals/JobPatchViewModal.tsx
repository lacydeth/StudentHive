import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Modals.module.css";
import { toast } from "react-toastify";

type JobPatchViewModalProps = {
  jobId: number;
}

const JobPatchViewModal = ({ jobId }: JobPatchViewModalProps) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string>("");

  useEffect(() => {
    setSelectedAgent(null);
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
        console.error("Hiba a közvetítők betöltése során:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAgent(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAgent === null || currentJobId === "") {
      alert("Kérlek válassz egy közvetítőt és add meg a munkát (Job ID).");
      return;
    }

    try {
      await axios.patch(
        `https://localhost:7067/api/organization/assign-agent/${selectedAgent}/${currentJobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Közvetítő sikeresen hozzárendelve!");
    } catch (error) {
      console.error("Hiba történt a közvetítő hozzárendelésekor:", error);
      toast.error("Hiba történt a közvetítő hozzárendelésekor.");
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
                  {agent.lastName} {agent.firstName}
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
