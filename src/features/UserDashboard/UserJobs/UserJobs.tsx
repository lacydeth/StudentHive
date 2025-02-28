import { useEffect, useState } from "react";
import Title from "../../../components/Title/Title";
import UserCard, { UserCardProps } from "../../../components/UserCard/UserCard";
import UserNavbar from "../../../components/UserNavbar/UserNavbar";
import styles from "./UserJobs.module.css";
import axios from "axios";

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
        <Title subTitle="Munkahelyeim" title="Tekintsd meg a munkahelyeidet és vállalj műszakokat." />
        <div className={styles.cardHolder}>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => <UserCard key={job.jobId} {...job} />)
          ) : (
            <p>Nincs munka amire felvettek. Kezdj neki a keresésnek.</p>
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

export default UserJobs;