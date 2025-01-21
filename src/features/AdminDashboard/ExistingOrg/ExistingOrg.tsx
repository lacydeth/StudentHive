import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./ExistingOrg.module.css";
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule, ModuleRegistry, SizeColumnsToFitGridStrategy } from "ag-grid-community";
import "./Table.css"

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ExistingOrg = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rowData, setRowData] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact<any>>(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7067/api/admin/organizations"
      );
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching organizations data:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const actionCellRenderer = (params: any) => (
    <div style={{ display: "flex", gap: "15px" }}>
      {/* View Button */}
      <button
        onClick={() => handleViewClick(params.data)}
        className={styles.actionBtn}
      >
        <img src="./view.png" alt="View" />
      </button>
      {/* Key Button */}
      <button
        onClick={() => handleKeyClick(params.data)}
        className={styles.actionBtn}
      >
        <img src="./key.png" alt="Key"  />
      </button>
    </div>
  );
  

  const handleViewClick = (organization: any) => {
    console.log("View details for:", organization);
  };
  
  const handleKeyClick = (organization: any) => {
    console.log("Handle key action for:", organization);
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

  const autoSizeStrategy = useMemo<SizeColumnsToFitGridStrategy>(
    () => ({
      type: "fitGridWidth",
      defaultMinWidth: 100,
      columnLimits: [{ colId: "address", minWidth: 200 }],
    }),
    []
  );

  const onGridReady = useCallback(() => {
    gridRef.current!.api.sizeColumnsToFit({
      defaultMinWidth: 100,
      columnLimits: [{ key: "address", minWidth: 200 }],
    });
  }, []);

  const handleResize = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit({
        defaultMinWidth: 100,
        columnLimits: [{ key: "address", minWidth: 200 }],
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
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
                autoSizeStrategy={autoSizeStrategy}
                pagination={true}
                paginationPageSize={10}
                onGridReady={onGridReady}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingOrg;
