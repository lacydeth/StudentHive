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
import JobViewModal from "../../../components/Modals/JobViewModal";
import JobPatchViewModal from "../../../components/Modals/JobPatchViewModal";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const CurrentJobs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [inactiveJobs, setInactiveJobs] = useState<any[]>([]);
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
        categoryName: job.categoryName,
        agentId: null,
        ourOffer: job.ourOffer,
        mainTaks: job.mainTaks,
        jobRequirements: job.jobRequirements,
        advantages: job.advantages,
      }));

      const active = allJobs.filter((job) => job.isActive);
      const inactive = allJobs.filter((job) => !job.isActive);

      setActiveJobs(active);
      setInactiveJobs(inactive);
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
      const updatedStatus = !currentStatus;
      await axios.patch(
        `https://localhost:7067/api/organization/isactive/${jobId}`,
        { isActive: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchJobs();
      alert(`A munka státusza ${updatedStatus ? "aktívvá" : "inaktívvá"} vált!`);
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Hiba történt a státusz frissítése során.");
    }
  };

  const actionCellRenderer = (params: any) => {
    const job = params.data;
    const [isActive, setIsActive] = useState(job.isActive);

    const handleToggleStatus = async () => {
      await Isactive(job.id, isActive);
      setIsActive(!isActive);
    };

    const handleViewJob = () => {
      setDialogContent(
        <JobViewModal job={job}/>

      );
      toggleDialog();
    };

    const handlePatchJob = () => {
    setDialogContent(
      <JobPatchViewModal jobId={job.id} />  // Itt adjuk át az ID-t
    );
    toggleDialog();
  };

    

    return (
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={handleViewJob} className={styles.actionBtn}>
          <img src="./view.png" alt="View" />
        </button>

        <button onClick={handleToggleStatus} className={styles.actionBtn}>
          <img src={isActive ? "./onbutton.png" : "./offbutton.png"} alt={isActive ? "Active" : "Inactive"} />
          {isActive ? "Active" : "Inactive"}
        </button>

        <button onClick={handlePatchJob} className={styles.actionBtn}>
        Update
      </button>

        <button
          onClick={() => {
            if (window.confirm("Biztosan törölni szeretnéd ezt a munkát?")) {
              deleteJob(job.id);
            }
          }}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
        >
          <img src="./trashcan.png" alt="Delete" />
          Delete
        </button>
      </div>
    );
  };
  const columnDefs = useMemo(
    () => [
      { field: "id", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
      { field: "categoryId", headerName: "KategoryID", flex: 1.5, minWidth: 150 },
      { field: "categoryName", headerName: "Kategória", flex: 1, minWidth: 120 },
      { field: "title", headerName: "Cím", flex: 1.5, minWidth: 150 },
      { field: "city", headerName: "Helyszín", flex: 1.5, minWidth: 150 },
      { field: "address", headerName: "Cím", flex: 1, minWidth: 150 },
      { field: "hourlyRate", headerName: "Órabér", flex: 1, minWidth: 120 },
      { field: "isActive", headerName: "Aktív", flex: 1, minWidth: 120, valueGetter: (params: any) => (params.data.isActive ? "Igen" : "Nem") },
      { field: "ourOffer", headerName: "Ajánlatunk", flex: 1.5, minWidth: 150 },
      { field: "mainTaks", headerName: "Fő Feladatok", flex: 1.5, minWidth: 150 },
      { field: "jobRequirements", headerName: "Munkaköri Követelmények", flex: 2, minWidth: 180 },
      { field: "advantages", headerName: "Előnyök", flex: 1.5, minWidth: 150 },
      {
        headerName: "Műveletek",
        field: "actions",
        cellRenderer: actionCellRenderer,
        width: 330,
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
              rowData={activeJobs}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              pagination={true}
              paginationPageSize={10}
              suppressCellFocus={false}
              getRowHeight={() =>30}
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
              rowData={inactiveJobs}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              pagination={true}
              paginationPageSize={10}
              suppressCellFocus={false}
              getRowHeight={() =>30}
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
