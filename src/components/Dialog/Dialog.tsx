import React, { forwardRef } from "react";
import styles from "./Dialog.module.css";
import axios from "axios";

type DialogProps = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ children, toggleDialog }, ref) => {
    return (
      <dialog
        className={styles.dialog}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
        ref={ref}
      >
        <div className={styles.content}>
          <i
            className="ri-close-line"
            onClick={toggleDialog}
            style={{ cursor: "pointer" }}
          ></i>
          {children}
        </div>
      </dialog>
    );
  }
);

const showJobDetails = (job: any, setDialogContent: React.Dispatch<React.SetStateAction<React.ReactNode>>, toggleDialog: () => void) => {
  setDialogContent(
    <form
      className={styles.jobForm}
      onSubmit={(e) => handleUpdateJob(e, job.id)}
    >
      <div>
        <label>Cím:</label>
        <input type="text" defaultValue={job.title} name="title" />
      </div>
      <div>
        <label>Kategória:</label>
        <input type="text" defaultValue={job.categoryName} name="categoryName" />
      </div>
      <div>
        <label>Város:</label>
        <input type="text" defaultValue={job.city} name="city" />
      </div>
      <div>
        <label>Cím:</label>
        <input type="text" defaultValue={job.address} name="address" />
      </div>
      <div>
        <label>Órabér:</label>
        <input type="number" defaultValue={job.hourlyRate} name="hourlyRate" />
      </div>
      <div>
        <label>Ajánlatunk:</label>
        <textarea defaultValue={job.ourOffer} name="ourOffer" />
      </div>
      <div>
        <label>Fő Feladatok:</label>
        <textarea defaultValue={job.mainTasks} name="mainTasks" />
      </div>
      <div>
        <label>Munkaköri Követelmények:</label>
        <textarea defaultValue={job.jobRequirements} name="jobRequirements" />
      </div>
      <div>
        <label>Előnyök:</label>
        <textarea defaultValue={job.advantages} name="advantages" />
      </div>
      <button type="submit">
        Mentés
      </button>
    </form>
  );
  toggleDialog();
};

const handleUpdateJob = async (e: React.FormEvent, jobId: number) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);

  const updatedJob = {
    title: formData.get("title"),
    categoryName: formData.get("categoryName"),
    city: formData.get("city"),
    address: formData.get("address"),
    hourlyRate: formData.get("hourlyRate"),
    ourOffer: formData.get("ourOffer"),
    mainTasks: formData.get("mainTasks"),
    jobRequirements: formData.get("jobRequirements"),
    advantages: formData.get("advantages"),
  };

  try {
    const token = localStorage.getItem("token");
    await axios.put(`https://localhost:7067/api/organization/update-job/${jobId}`, updatedJob, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("A munka sikeresen frissítve!");
    // You might want to trigger a refetch or close the dialog here
  } catch (error) {
    console.error("Error updating job:", error);
    alert("Hiba történt a frissítés során.");
  }
};

export default Dialog;
