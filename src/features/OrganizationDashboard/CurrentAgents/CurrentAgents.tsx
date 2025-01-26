import { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./CurrentAgents.module.css";
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

const CurrentAgents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact<any>>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token available");
      }
  
      const response = await axios.get("https://localhost:7067/api/organization/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching jobs data:", error);
    }
  };

  const deleteAgent = async (Id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7067/api/organization/delete-agent/${Id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Sikeres törlés után frissítjük az adatokat
      fetchAgents();
      alert("A közvetytő sikeresen törölve!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Hiba történt a munka törlése során.");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);
  
  const toggleDialog = (user?: any) => {
    if (!dialogRef.current) return;
    setDialogContent(
      user ? (
        <div>
          <p>{`Név: ${user.firstName} ${user.lastName}`}</p>
          <p>{`Email: ${user.email}`}</p>
        </div>
      ) : (
        <p>Dialog content not available</p>
      )
    );
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  };

  // Módosított actionCellRenderer: hozzáadtam a törlés logikát
  function actionCellRenderer(params: any) {
    const user = params.data; // Az aktuális rekord adatai

    return (
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Törlés gomb */}
        <button
          onClick={() => {
            if (window.confirm("Biztosan törölni szeretnéd ezt az ügynököt?")) {
              deleteAgent(user.id); // Meghívjuk a deleteAgent függvényt
            }
          }}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
        >
          <img src="./delete.png" alt="Delete" />
        </button>
      </div>
    );
  }

  const columnDefs = useMemo(() => [
    { field: "id", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
    { field: "firstName", headerName: "Vezetéknév", flex: 0.5, minWidth: 100 },
    { field: "lastName", headerName: "Keresztnév", flex: 1.5, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 120 },
    {
      headerName: "Műveletek",
      field: "actions",
      cellRenderer: actionCellRenderer, // A cellRenderer regisztrálása
      width: 150,
    },
  ], []);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div
        className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <DashboardTitle
          title="Meglévő Közvetítők"
          icon="./briefcase.png"
          subTitle="Aktuális Közvetítők"
        />
        <div className={styles.currentJobsContent}>
          <Title
            subTitle="Meglévő Közvetítők"
            title="Tekintsd meg és kezeld az aktuális Közvetítőket!"
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

export default CurrentAgents;
