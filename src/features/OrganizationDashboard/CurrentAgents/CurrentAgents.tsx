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
import { orgMenuLinks } from "../../../utils/routes";
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css";
import OrgPasswordModal from "../../../components/Modals/OrgPasswordModal";
import Dialog from "../../../components/Dialog/Dialog";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const CurrentAgents = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [rowData, setRowData] = useState<any[]>([]);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null)
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
      console.error("Error fetching agents data:", error);
    }
  };

  const toggleAgentStatus = async (Id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`https://localhost:7067/api/organization/toggle-agent-status/${Id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAgents();
    } catch (error) {
      console.error("Error toggling agent status:", error);
    }
  };

  const confirmStatusChange = (user: any) => {
    confirmAlert({
      title: "Megerősítés",
      message: `Biztosan meg szeretnéd változtatni a közvetítő státuszát? ${user.lastName} ${user.firstName}`,
      buttons: [
        {
          label: "Igen",
          onClick: () => toggleAgentStatus(user.id),
        },
        {
          label: "Mégse",
        },
      ],
    });
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const actionCellRenderer = (params: any) => {
    const user = params.data;

    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => confirmStatusChange(user)}
          className={`${styles.actionBtn} ${user.isActive ? styles.deactivateBtn : styles.activateBtn}`}
        >
          {user.isActive == 1 ? <img src="/onbutton.png" alt="Deaktiválás"></img> : <img src="/offbutton.png" alt="Aktiválás"></img>} 
        </button>
        <button
          onClick={() => {
            toggleDialog();
            setDialogContent(<OrgPasswordModal organizationId={user.id} />);
          }}
          className={styles.actionBtn}
        >
          <img src="./key.png" alt="Key" />
        </button>
      </div>
    );
  };

  const toggleDialog = () => {
    if(!dialogRef.current) {
      return;
    }
    return dialogRef.current.hasAttribute("open") ? dialogRef.current.close() : dialogRef.current.showModal()
  };
  
  const columnDefs = useMemo(() => [
    { field: "id", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
    { field: "lastName", headerName: "Vezetéknév", flex: 0.5, minWidth: 100 },
    { field: "firstName", headerName: "Keresztnév", flex: 0.5, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 120 },
    { field: "isActive", headerName: "Aktív", flex: 0.5, minWidth: 100, valueFormatter: (params: any) => (params.value == 1 ? "Igen" : "Nem") },
    {
      headerName: "Műveletek",
      field: "actions",
      cellRenderer: actionCellRenderer,
      width: 200,
    },
  ], []);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={orgMenuLinks} />
      <div
        className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <DashboardTitle
          title="Meglévő közvetítők"
          icon="./people.png"
          subTitle="Meglévő közvetítők"
        />
        <div className={styles.currentJobsContent}>
          <Title
            subTitle="Meglévő Közvetítők"
            title="Tekintsd meg és kezeld az aktuális közvetítőket!"
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

export default CurrentAgents;
