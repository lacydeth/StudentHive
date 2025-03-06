import styles from "./ShiftApplications.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  PaginationModule,
  ValidationModule
} from "ag-grid-community";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css";
import DashboardTitle from "../DashboardTitle/DashboardTitle";
import Sidebar from "../Sidebar/Sidebar";
import Title from "../Title/Title";
import { agentMenuLinks } from "../../utils/routes";
import { useParams } from "react-router-dom";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  ValidationModule
]);
type ShiftApplicationParams = {
    status?: string;
    shiftStartFilter?: string;
}

const ShiftApplications = () => {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [rowData, setRowData] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [shiftStarts, setShiftStarts] = useState<Date[]>([]);
  const [selectedShiftStart, setSelectedShiftStart] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact<any>>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchApplications = async (status: string, shiftStartFilter?: Date) => {
    const url = `https://localhost:7067/api/agent/shift-applications/${id}`;

    const params: ShiftApplicationParams = {};
    if (status) params.status = status;
    if (shiftStartFilter) params.shiftStartFilter = shiftStartFilter.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });

    try {
      const response = await axios.get(url, {
        params,
        headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}
      });
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchShiftStarts = async () => {
    try {
      const response = await axios.get(`https://localhost:7067/api/agent/shift-starts/${id}`, {
        headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}
      });
      setShiftStarts(response.data);
    } catch (error) {
      console.error("Error fetching shift starts:", error);
    }
  };

  const fetchJobTitle = async () => {
    try {
      const response = await axios.get(`https://localhost:7067/api/agent/job-title/${id}`);
      setJobTitle(response.data.length > 0 ? response.data[0].title : "Nincs adat");
    } catch (error) {
      console.error("Hiba a betöltés során:", error);
      setJobTitle("Hiba történt");
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobTitle();
      fetchShiftStarts();
      fetchApplications(selectedStatus, selectedShiftStart);
    }
  }, [id, selectedStatus, selectedShiftStart]);

  const confirmAction = (message: string, onConfirm: () => void) => {
    confirmAlert({
      title: "Megerősítés",
      message,
      buttons: [
        {
          label: "Igen",
          onClick: onConfirm,
        },
        {
          label: "Mégse",
        },
      ],
    });
  };

  const handleAccept = async (applicationId: number) => {
    confirmAction("Biztosan elfogadod ezt a jelentkezést?", async () => {
      try {
        await axios.patch(
            `https://localhost:7067/api/agent/shift-applications/${applicationId}/accept`,
            {},
            {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
        setRowData((prev) =>
          prev.map((app) =>
            app.applicationId === applicationId ? { ...app, approvedStatus: 1 } : app
          )
        );
      } catch (error) {
        console.error("Error accepting application:", error);
      }
    });
  };

  const handleDecline = async (applicationId: number) => {
    confirmAction("Biztosan elutasítod ezt a jelentkezést?", async () => {
      try {
        await axios.patch(
            `https://localhost:7067/api/agent/shift-applications/${applicationId}/decline`,
            {}, 
            {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
        setRowData((prev) =>
          prev.map((app) =>
            app.applicationId === applicationId ? { ...app, approvedStatus: 2 } : app
          )
        );
      } catch (error) {
        console.error("Error declining application:", error);
      }
    });
  };

  const actionCellRenderer = (params: any) => {
    if (params.data.approvedStatus === 1 || params.data.approvedStatus === 2) {
      return null;
    }
  
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => handleAccept(params.data.applicationId)} className={styles.actionBtn}>
          <img src="/accept.png" alt="Accept" />
        </button>
        <button onClick={() => handleDecline(params.data.applicationId)} className={styles.actionBtn}>
          <img src="/decline.png" alt="Decline" />
        </button>
      </div>
    );
  };
  

  const statusFormatter = (params: { value: 0 | 1 | 2 }) => {
    if (params.value === 0) return "Válaszra vár";
    if (params.value === 1) return "Elfogadva";
    if (params.value === 2) return "Elutasítva";
    return "Ismeretlen";
  };

  const columnDefs = useMemo(
    () => [
      { field: "applicationId", headerName: "Azonosító", flex: 0.5, minWidth: 80 },
      { field: "studentName", headerName: "Diák neve", flex: 1, minWidth: 150 },
      { field: "jobTitle", headerName: "Pozíció", flex: 1, minWidth: 180 },
      { field: "shiftStart", headerName: "Műszak kezdete", flex: 1, minWidth: 180 },
      { field: "shiftEnd", headerName: "Műszak vége", flex: 1, minWidth: 180 },
      { field: "approvedStatus", headerName: "Státusz", flex: 0.8, minWidth: 120, valueFormatter: statusFormatter },
      { headerName: "Műveletek", field: "actions", cellRenderer: actionCellRenderer, width: 150 },
    ],
    []
  );
  const handleShiftStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedShiftStart(selectedValue || null);
  };
  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <DashboardTitle title="Műszak jelentkezések" icon="/resume.png" subTitle={jobTitle || "Betöltés..."} />
        <div className={styles.applicationsContent}>
          <Title subTitle="Műszak jelentkezések" title="Tekintsd meg az elfogadásra váró jelentkezéseket!" />
          <div className={styles.filters}>
            <div className={styles.inputBox}>
                <select value={selectedShiftStart || ""} onChange={handleShiftStartChange}>
                    <option value="">Műszak kezdete</option>
                    {shiftStarts.map((shiftStart, idx) => (
                    <option key={idx} value={shiftStart.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" })}>
                        {shiftStart.toLocaleString("hu-HU", { timeZone: "Europe/Budapest" })}
                    </option>
                    ))}
                </select>
            </div>
            <div className={styles.inputBox}>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">Összes</option>
                <option value="0">Válaszra vár</option>
                <option value="1">Elfogadva</option>
                <option value="2">Elutasítva</option>
              </select>
            </div>
          </div>
          <div className="ag-theme-alpine" style={{ width: "100%", overflowX: "auto" }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              pagination={true}
              paginationAutoPageSize={true} 
              suppressCellFocus={false}
              rowHeight={35}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftApplications;
