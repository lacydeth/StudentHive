import { useEffect, useMemo, useRef, useState } from "react";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { agentMenuLinks } from "../../../utils/routes";
import styles from "./AgentStudentList.module.css";
import Title from "../../../components/Title/Title";
import { AgGridReact } from "ag-grid-react";
import Dialog from "../../../components/Dialog/Dialog";
import AgentStudentListViewModal from "../../../components/Modals/AgentStudentListViewModal";
import axios from "axios";
import { getUserIdFromToken } from "../../../utils/authUtils";

const AgentStudentList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null)
  const [rowData, setRowData] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact<any>>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
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
      const response = await axios.get(
        `https://localhost:7067/api/Agent/student-list?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  

  useEffect(() => {
    fetchStudents();
  }, []);

  const actionCellRenderer = (params: any) => {
    const agents = params.data;
    return (
      <div style={{ display: "flex", gap: "15px" }}>
        {/* View Button */}
        <button
          onClick={() => {
            toggleDialog();
            setDialogContent(<AgentStudentListViewModal/>);
          }}
          className={styles.actionBtn}
        >
          <img src="./view.png" alt="View" />
        </button>
        {/* Key Button */}
        <button
          onClick={() => {
            toggleDialog();
            setDialogContent(<AgentStudentListViewModal/>);
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
        { field: "studentId", headerName: "Azonosító", flex: 0.5, minWidth: 100 },
        { field: "firstName", headerName: "Vezetéknév", flex: 1, minWidth: 150 },
        { field: "lastName", headerName: "Keresztnév", flex: 1, minWidth: 200 },
        { field: "email", headerName: "Email", flex: 1.5, minWidth: 180 },
        {
          headerName: "Műveletek",
          field: "actions",
          cellRenderer: actionCellRenderer,
          width: 150,
        },
      ],[]
    );

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={agentMenuLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Diákok Listázása" icon="./realtor.png" subTitle="Diákok Kezelése"/>
        <div className={styles.settingsContent}>
        <div className={styles.existingOrgContent}>
          <Title
            subTitle="Diákok"
            title="Tekintsd meg és módosítsd a diákok adatait!"
          />
          <div className="ag-theme-alpine" style={{ width: "100%", overflowX: "auto" }}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                domLayout="autoHeight"
                pagination={true}
                paginationPageSize={10} suppressCellFocus={false}
              />
          </div>
        </div>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AgentStudentList;