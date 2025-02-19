import { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./ExistingOrg.module.css";
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
import OrgViewModal from "../../../components/Modals/OrgViewModal";
import OrgPasswordModal from "../../../components/Modals/OrgPasswordModal";
import Dialog from "../../../components/Dialog/Dialog";
import { adminTopLinks } from "../../../utils/routes";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ExistingOrg = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1000);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact<any>>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchOrganizations = async () => {
    axios
    .get("https://localhost:7067/api/admin/organizations")
    .then((response) => setRowData(response.data))
    .catch((error) => console.error("Error fetching work cards:", error));
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const actionCellRenderer = (params: any) => {
    const organization = params.data;
    return (
      <div style={{ display: "flex", gap: "15px" }}>
        {/* View Button */}
        <button
          onClick={() => {
            toggleDialog();
            setDialogContent(<OrgViewModal organization={organization} />);
          }}
          className={styles.actionBtn}
        >
          <img src="./view.png" alt="View" />
        </button>
        {/* Key Button */}
        <button
          onClick={() => {
            toggleDialog();
            setDialogContent(<OrgPasswordModal organizationId={organization.id} />);
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
      { field: "name", headerName: "Név", flex: 1, minWidth: 150 },
      { field: "address", headerName: "Cím", flex: 2, minWidth: 200 },
      { field: "contactEmail", headerName: "Email", flex: 1.5, minWidth: 180 },
      { field: "contactPhone", headerName: "Telefonszám", flex: 1, minWidth: 120 },
      { field: "createdAt", headerName: "Létrehozás", flex: 1, minWidth: 120 },
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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} topLinks={adminTopLinks} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle
          title="Meglévő szövetkezetek"
          icon="./people.png"
          subTitle="Meglévő szövetkezetek"
        />
        <div className={styles.existingOrgContent}>
          <Title
            subTitle="Meglévő szövetkezetek"
            title="Tekintsd meg és módosítsd a szövetkezetek adatait!"
          />
          <div className="ag-theme-alpine" style={{ width: "100%", overflowX: "auto" }}>
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

export default ExistingOrg;
