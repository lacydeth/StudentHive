import axios from "axios";
import UserNavbar from "../../../components/UserNavbar/UserNavbar";
import styles from "./UserApplications.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../utils/routes";
import ApplicationCard, { ApplicationCardProps } from "../../../components/ApplicationCard/ApplicationCard";
import { toast } from "react-toastify";

const UserApplications = () => {
  const [jobs, setJobs] = useState<ApplicationCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3; 

  const fetchApplications = async () => {
    try {
      const response = await axios.get("https://localhost:7067/api/user/user-applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDelete = async (id: number) => {
    try {
        const response = await axios.delete(
            `https://localhost:7067/api/user/delete-application/${id}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
        );

        if (response.status === 200) {
            toast.success("Jelentkezés sikeresen törölve!");
            fetchApplications();
        }
    } catch (error) {
        console.error("Hiba a törlés során:", error);
        toast.error("Hiba a jelentkezés törlése során!")
    }
};
  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.content}>
        <div className={styles.jobTitle}>
          <h1>Jelentkezéseim</h1>
        </div>
        <div className={styles.cardHolder}>
          {currentJobs.length > 0 ? (
            currentJobs.map((application) => <ApplicationCard key={application.id} {...application} onDelete={handleDelete}/>)
          ) : (
            <p>Nincs leadott jelentkezésed. <Link to={routes.worksPage.path} className={styles.underline}>Kezdj neki a keresésnek.</Link></p>
          )}
        </div>
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Előző
          </button>
          <span>
            Oldal {currentPage} / {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages || totalPages === 0}>
            Következő
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserApplications;