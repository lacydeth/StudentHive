import { useEffect, useRef, useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import styles from "./ExistingOrg.module.css"
import Title from "../../../components/Title/Title";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "ag-grid-community";
const ExistingOrg = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rowData, setRowData] = useState<any[]>([]);

  const gridApi = useRef(null);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  useEffect(() => {
    fetchOrganizations();
  }, []);
  
  const fetchOrganizations = async () => {
    try {
      const response = await axios.get("https://localhost:7067/api/admin/organizations");
      setRowData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching organizations data:", error);
    }
  };

  const actionCellRenderer = (params: any) => (
    <button
      onClick={() => handleActionClick(params.data)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      <img src="./view.png" alt="View" style={{ width: "20px", height: "20px" }} />
    </button>
  );

  const handleActionClick = (organization: any) => {
    console.log("View details for:", organization);
  };

  const columnDefs = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 100 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "address", headerName: "Address", flex: 2, minWidth: 200 },
    { field: "contactEmail", headerName: "Email", flex: 1.5, minWidth: 180 },
    { field: "contactPhone", headerName: "Phone", flex: 1, minWidth: 120 },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 120 },
    {
      headerName: "Actions",
      field: "actions",
      cellRendererFramework: actionCellRenderer,
      width: 150,
    },
  ];
    useEffect(() => {
    const handleResize = () => {
      if (gridApi.current) {
        gridApi.current.sizeColumnsToFit();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <DashboardTitle title="Meglévő szövetkezetek" icon="./people.png" subTitle="Meglévő szövetkezetek"/>
        <div className={styles.existingOrgContent}>
          <Title
            subTitle="Meglévő szövetkezetek"
            title="Tekintsd meg és módosítsd a szövetkezetek adatait!"
          />
          <div style={{ width: '100%', overflowX: 'auto', minWidth: '600px' }}>
            <div className="ag-theme-alpine">
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                domLayout="autoHeight"
                pagination={true}
                paginationPageSize={10}
                modules={[ClientSideRowModelModule]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExistingOrg