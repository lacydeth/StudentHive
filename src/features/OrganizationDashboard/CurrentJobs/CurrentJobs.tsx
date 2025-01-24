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

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const CurrentJobs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact<any>>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://localhost:7067/api/organization/jobs");
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching jobs data:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const actionCellRenderer = (params: any) => {
    const job = params.data;
    return (
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={() => {
            toggleDialog();
          }}
          className={styles.actionBtn}
        >
          <img src="./view.png" alt="View" />
        </button>
      </div>
    );
  };

  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    return dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  };

  const columnDefs = useMemo(
    () => [
      { field: "id", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
      { field: "title", headerName: "Cím", flex: 1.5, minWidth: 150 },
      { field: "category", headerName: "Kategória", flex: 1, minWidth: 120 },
      { field: "location", headerName: "Helyszín", flex: 1.5, minWidth: 150 },
      { field: "hourlyRate", headerName: "Órabér", flex: 1, minWidth: 120 },
      { field: "createdAt", headerName: "Létrehozás", flex: 1, minWidth: 120 },
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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle
          title="Meglévő munkák"
          icon="./briefcase.png"
          subTitle="Aktuális munkák"
        />
        <div className={styles.currentJobsContent}>
          <Title
            subTitle="Meglévő munkák"
            title="Tekintsd meg és kezeld az aktuális munkákat!"
          />
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
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
