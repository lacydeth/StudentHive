import { useEffect, useState } from "react";
import UserCard, { UserCardProps } from "../../../components/UserCard/UserCard";
import UserNavbar from "../../../components/UserNavbar/UserNavbar";
import styles from "./UserJobs.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { routes } from "../../../utils/routes";

const UserJobs = () => {
  const [jobs, setJobs] = useState<UserCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3; 

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://localhost:7067/api/user/user-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
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

  return (
    <div className={styles.container}>
      <UserNavbar />
      <div className={styles.content}>
        <div className={styles.jobTitle}>
          <h1>Munkahelyeim</h1>
        </div>
        <div className={styles.cardHolder}>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => <UserCard key={job.jobId} {...job} />)
          ) : (
            <p>Nincs munka amire felvettek. <Link to={routes.worksPage.path} className={styles.underline}>Kezdj neki a keresésnek.</Link></p>
          )}
        </div>
        {jobs.length > jobsPerPage && (
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
        )}
        <div className={styles.manageShifts}>
          <div className={styles.details}>
            <h2>Műszakok kezelése</h2>
            <p>Minden felvett műszakod egy helyen. Vess egy pillantást elfogadták-e vagy akár mondd vissza, ha több, mint 12 óra van hátra a kezdetéig.</p>
          </div>
          <Link className={styles.shiftBtn} to={routes.userShifts.path}>Műszakjaim</Link>
        </div>
      </div>
    </div>
  );
};

export default UserJobs;