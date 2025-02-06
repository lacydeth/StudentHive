import DashboardTitle from "../../../../components/DashboardTitle/DashboardTitle";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import { agentMenuLinks } from "../../../../utils/routes";
import styles from "./StudentApplications.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import Title from "../../../../components/Title/Title";
import { AgGridReact } from "ag-grid-react";
import { getUserIdFromToken } from "../../../../utils/authUtils";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const StudentApplications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [rowData, setRowData] = useState<any[]>([]);
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState("");
  const gridRef = useRef<AgGridReact<any>>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchApplications = async (title: string) => {
    const agentId = getUserIdFromToken();
    const url = title
      ? `https://localhost:7067/api/agent/applications?agentId=${agentId}&title=${title}`
      : `https://localhost:7067/api/agent/applications?agentId=${agentId}`;
  
    try {
      const response = await axios.get(url);
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
  
  const fetchWorkTitles = async () => {
    axios
      .get("https://localhost:7067/api/agent/work-titles")
      .then((response) => setWorks(response.data))
      .catch((error) => console.error("Error fetching locations:", error));
  }
  useEffect(()=> {
    fetchWorkTitles();
  })
  useEffect(() => {
    fetchApplications(selectedWork); // Pass selected work to fetch filtered applications
  }, [selectedWork]);
  

  const handleAccept = async (applicationId: number) => {
    try {
      await axios.patch(`https://localhost:7067/api/agent/applications/${applicationId}/accept`);
      setRowData((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId ? { ...app, status: 1 } : app
        )
      );
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handleDecline = async (applicationId: number) => {
    try {
      await axios.patch(`https://localhost:7067/api/agent/applications/${applicationId}/decline`);
      setRowData((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId ? { ...app, status: 2 } : app
        )
      );
    } catch (error) {
      console.error("Error declining application:", error);
    }
  };

  const actionCellRenderer = (params: any) => {
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

  const statusFormatter = (params: any) => {
    if (params.value === 0) return "Válaszra vár";
    return params.value;
  };

  const columnDefs = useMemo(
    () => [
      { field: "applicationId", headerName: "Azonosító", flex: 0.5, minWidth: 80 },
      { field: "studentName", headerName: "Diák neve", flex: 1, minWidth: 150 },
      { field: "jobTitle", headerName: "Pozíció", flex: 1, minWidth: 180 },
      { field: "organization", headerName: "Iskolaszövetkezet", flex: 1, minWidth: 180 },
      { field: "status", headerName: "Státusz", flex: 0.8, minWidth: 120, valueFormatter: statusFormatter },
      { field: "appliedDate", headerName: "Jelentkezés dátuma", flex: 1, minWidth: 150 },
      { headerName: "Műveletek", field: "actions", cellRenderer: actionCellRenderer, width: 150 },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <DashboardTitle title="Jelentkezések" icon="./resume.png" subTitle="Jelentkezések" />
        <div className={styles.applicationsContent}>
          <Title subTitle="Munka jelentkezések" title="Tekintsd meg az elfogadásra váró jelentkezéseket!" />
          <div className={styles.inputBox}>
            <select value={selectedWork} onChange={(e) => setSelectedWork(e.target.value)}>
              <option value="">Kategória</option>
              {works.map((work: { id: number; title: string }) => (
                <option key={work.id} value={work.title}>
                  {work.title}
                </option>
              ))}
            </select>
          </div>
          <div className="ag-theme-alpine" style={{ width: "100%", overflowX: "auto" }}>
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
      </div>
    </div>
  );
};

export default StudentApplications;
