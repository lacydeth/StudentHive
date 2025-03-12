import { useEffect, useMemo, useRef, useState } from "react";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { agentMenuLinks } from "../../../utils/routes";
import styles from "./AgentStudentList.module.css";
import Title from "../../../components/Title/Title";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  PaginationModule,
  ValidationModule
} from "ag-grid-community";
import { apiInstance } from "../../../utils/authUtils";
import { getUserIdFromToken } from "../../../utils/authUtils";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  ValidationModule
]);

const AgentStudentList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact<any>>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      console.error("User is not authenticated or token missing.");
      return;
    }

    try {
      const response = await apiInstance.get(
        `https://localhost:7067/api/Agent/student-list?userId=${userId}`
      );
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const columnDefs = useMemo(
    () => [
      { field: "studentId", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
      { field: "firstName", headerName: "Vezetéknév", flex: 1, minWidth: 150 },
      { field: "lastName", headerName: "Keresztnév", flex: 1, minWidth: 200 },
      { field: "email", headerName: "Email", flex: 1.5, minWidth: 180 },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Diákok" icon="./realtor.png" subTitle="Diákok" />
        <div className={styles.settingsContent}>
          <div className={styles.existingOrgContent}>
            <Title subTitle="Diákok" title="Tekintsd meg és módosítsd a diákok adatait!" />
            <div className="ag-theme-alpine" style={{ width: "100%", overflowX: "auto" }}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                domLayout="autoHeight"
                pagination={true}
                paginationAutoPageSize={true} 
                suppressCellFocus={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentStudentList;
