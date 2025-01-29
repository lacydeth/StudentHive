import { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./CurrentJobs.module.css";
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
import "./Table.css";
import Dialog from "../../../components/Dialog/Dialog";
import { orgMenuLinks } from "../../../utils/routes";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const CurrentJobs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [rowData, setRowData] = useState<any[]>([]);  // All Jobs
  const [activeJobs, setActiveJobs] = useState<any[]>([]);  // Active Jobs
  const [inactiveJobs, setInactiveJobs] = useState<any[]>([]);  // Inactive Jobs
  const gridRef = useRef<AgGridReact<any>>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7067/api/organization/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const allJobs = response.data.map((job: any) => ({
        ...job,
        categoryName: job.categoryName, // Kategória neve
        agentId: null, // AgentId mindig null
        ourOffer: job.ourOffer, // Description OurOffer
        mainTasks: job.mainTaks, // Description MainTasks
        jobRequirements: job.jobRequirements, // Description JobRequirements
        advantages: job.advantages, // Description Advantages
      }));
      
      // Filter active and inactive jobs
      const active = allJobs.filter((job) => job.isActive);
      const inactive = allJobs.filter((job) => !job.isActive);
      
      setRowData(allJobs);  // Store all jobs
      setActiveJobs(active);  // Store active jobs
      setInactiveJobs(inactive);  // Store inactive jobs
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const deleteJob = async (jobId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7067/api/organization/delete-job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchJobs();
      alert("A munka sikeresen törölve!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Hiba történt a munka törlése során.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    return dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  };

  const Isactive = async (jobId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const updatedStatus = !currentStatus; // Toggle the status
      await axios.patch(
        `https://localhost:7067/api/organization/isactive/${jobId}`,
        { jobId, isActive: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchJobs(); // Reload jobs to reflect the updated status
      alert(`A munka státusza ${updatedStatus ? "aktívvá" : "inaktívvá"} vált!`);
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Hiba történt a státusz frissítése során.");
    }
  };

  const actionCellRenderer = (params: any) => {
    const job = params.data;
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Megtekintés gomb */}
        <button
          onClick={() => {
            toggleDialog();
          }}
          className={styles.actionBtn}
        >
          <img src="./view.png" alt="View" />
        </button>

        {/* Inaktivitás gomb */}
        <button
          onClick={() => {
            Isactive(job.id, job.isActive); // Pass job id and current status
          }}
          className={styles.actionBtn}
        >
          <img src="./view.png" alt="View" />
        </button>

        {/* Törlés gomb */}
        <button
          onClick={() => {
            if (window.confirm("Biztosan törölni szeretnéd ezt a munkát?")) {
              deleteJob(job.id);
            }
          }}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
        >
          <img src="./delete.png" alt="Delete" />
        </button>
      </div>
    );
  };

  const columnDefs = useMemo(
    () => [
      { field: "id", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
      { field: "title", headerName: "Cím", flex: 1.5, minWidth: 150 },
      { field: "categoryName", headerName: "Kategória", flex: 1, minWidth: 120 },
      { field: "city", headerName: "Helyszín", flex: 1.5, minWidth: 150 },
      { field: "address", headerName: "Cím", flex: 1, minWidth: 150 },
      { field: "hourlyRate", headerName: "Órabér", flex: 1, minWidth: 120 },
      { field: "isActive", headerName: "Aktív", flex: 1, minWidth: 120, valueGetter: (params: any) => (params.data.isActive ? "Igen" : "Nem") },
      { field: "ourOffer", headerName: "Ajánlatunk", flex: 1.5, minWidth: 150 },
      { field: "mainTasks", headerName: "Fő Feladatok", flex: 1.5, minWidth: 150 },
      { field: "jobRequirements", headerName: "Munkaköri Követelmények", flex: 2, minWidth: 180 },
      { field: "advantages", headerName: "Előnyök", flex: 1.5, minWidth: 150 },
      {
        headerName: "Műveletek",
        field: "actions",
        cellRenderer: actionCellRenderer,
        width: 150,
      },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle
          title="Létrehozott munkák"
          icon="./briefcase.png"
          subTitle="Létrehozott munkák"
        />
        <div className={styles.currentJobsContent}>
          <Title
            subTitle="Aktív munkák"
            title="Tekintsd meg és kezeld az aktív munkákat!"
          />
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={activeJobs}  // Pass only active jobs here
              columnDefs={columnDefs}
              domLayout="autoHeight"
              pagination={true}
              paginationPageSize={10}
              suppressCellFocus={false}
            />
          </div>
        </div>
        
        <DashboardTitle
          title="Inaktív munkák"
          icon="./briefcase.png"
          subTitle="Inaktív munkák"
        />
        <div className={styles.currentJobsContent}>
          <Title
            subTitle="Inaktív munkák"
            title="Tekintsd meg és kezeld az inaktív munkákat!"
          />
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={inactiveJobs}  // Pass only inactive jobs here
              columnDefs={columnDefs}
              domLayout="autoHeight"
              pagination={true}
              paginationPageSize={10}
              suppressCellFocus={false}
            />
          </div>
        </div>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </div>
    </div>
  );
};

export default CurrentJobs;
