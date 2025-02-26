import { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./CurrentJobs.module.css";
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  PaginationModule,
  ValidationModule
} from "ag-grid-community";
import Dialog from "../../../components/Dialog/Dialog";
import { orgMenuLinks } from "../../../utils/routes";
import JobViewModal from "../../../components/Modals/JobViewModal";
import JobPatchViewModal from "../../../components/Modals/JobPatchViewModal";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  ValidationModule
]);

const CurrentJobs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
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

      setActiveJobs(allJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
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

  const confirmStatusChange = (job: any, currentStatus: boolean) => {
    confirmAlert({
      title: "Megerősítés",
      message: `Biztosan meg szeretnéd változtatni a munka státuszát? ${job.title}`,
      buttons: [
        {
          label: "Igen",
          onClick: () => {
            Isactive(job.id, currentStatus);
          },
        },
        {
          label: "Mégse",
        },
      ],
    });
  };

  const Isactive = async (jobId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const updatedStatus = !currentStatus;

      await axios.patch(
        `https://localhost:7067/api/organization/toggle-job-status/${jobId}`,
        { isActive: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchJobs()
      const updatedJobs = [...activeJobs];
      const jobIndex = updatedJobs.findIndex((job) => job.id === jobId);
      if (jobIndex !== -1) {
        updatedJobs[jobIndex].isActive = updatedStatus;
        setActiveJobs(updatedJobs);
      }

    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const actionCellRenderer = (params: any) => {
    const job = params.data;
    const [isActive, setIsActive] = useState(job.isActive);

    const handleToggleStatus = async () => {
      confirmStatusChange(job, isActive);
    };

    const handleViewJob = () => {
      setDialogContent(
        <JobViewModal job={job} />
      );
      toggleDialog();
    };

    const handlePatchJob = () => {
      setDialogContent(
        <JobPatchViewModal jobId={job.id} />
      );
      toggleDialog();
    };

    return (
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={handleViewJob} className={styles.actionBtn}>
          <img src="./view.png" alt="View" />
        </button>
        <button onClick={handlePatchJob} className={styles.actionBtn}>
          <img src="/briefcase.png" alt="Assign job"/>
        </button>
        <button onClick={handleToggleStatus} className={styles.actionBtn}>
          <img src={isActive ? "./onbutton.png" : "./offbutton.png"} alt={isActive ? "Active" : "Inactive"} />
        </button>
      </div>
    );
  };

  const columnDefs = useMemo(
    () => [
      { field: "id", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
      { field: "title", headerName: "Pozíció", flex: 2, minWidth: 150 },
      { field: "categoryName", headerName: "Kategória", flex: 1.5, minWidth: 120 },
      { field: "city", headerName: "Helyszín", flex: 1, minWidth: 150 },
      { field: "address", headerName: "Cím", flex: 1.5, minWidth: 150 },
      { field: "hourlyRate", headerName: "Órabér", flex: 0.5, minWidth: 120 },
      { field: "isActive", headerName: "Aktív", flex: 0.5, minWidth: 120, valueGetter: (params: any) => (params.data.isActive ? "Igen" : "Nem") },
      {
        headerName: "Műveletek",
        field: "actions",
        cellRenderer: actionCellRenderer,
        width: 250,
      },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div
        className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <DashboardTitle
          title="Létrehozott munkák"
          icon="./briefcase.png"
          subTitle="Létrehozott munkák"
        />
        <div className={styles.currentJobsContent}>
          <Title
            subTitle="Létrehozott munkákat"
            title="Tekintsd meg és kezeld a létrehozott munkákat!"
          />
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", overflowX: "auto", height: "500px" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={activeJobs}
              columnDefs={columnDefs} 
              pagination={true} 
              paginationAutoPageSize={true} 
              suppressCellFocus={false}
              rowHeight={35}
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
