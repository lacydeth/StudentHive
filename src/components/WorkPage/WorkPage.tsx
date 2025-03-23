import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./WorkPage.module.css";
import Navbar from "../Navbar/Navbar";
import { routes } from "../../utils/routes";
import { getUserIdFromToken } from "../../utils/authUtils"; 
import { toast } from 'react-toastify';
import axios from "axios";

type WorkDetails = {
  title: string;
  salary: string;
  city: string;
  address: string;
  category: string;
  image: string;
  ourOffer: string;
  mainTasks: string;
  jobRequirements: string;
  advantages: string;
};

type Review = {
  id: number;
  jobId: number;
  reviewerId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const WorkPage = () => {
  const { id } = useParams();
  const [work, setWork] = useState<WorkDetails | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 0
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`https://localhost:7067/api/general/jobreviews/${id}`);
      setReviews(response.data);
      
      const userId = getUserIdFromToken();
      if (userId) {
        const hasReviewed = response.data.some((review: Review) => review.reviewerId === parseInt(userId));
        setUserHasReviewed(hasReviewed);
      }
    } catch (error) {
      console.error("Hiba a betöltés során:", error);
    }
  };

  useEffect(() => {
    axios
      .get(`https://localhost:7067/api/general/workcards/${id}`)
      .then((response) => setWork(response.data))
      .catch((error) => console.error("Hiba a betöltés során:", error));
    
    fetchReviews();
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setIsApplying(true);
  
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("Nem sikerült azonosítani a felhasználót."); 
        setIsApplying(false);
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Nincs bejelentkezve felhasználó."); 
        setIsApplying(false);
        return;
      }
  
      const response = await axios.post(
        `https://localhost:7067/api/user/apply`,
        {
          jobId: parseInt(id),
          studentId: parseInt(userId),
          Status : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success(response.data.message);  
    } catch (error) {
      toast.error("Már jelentkeztél a munkára!"); 
      console.error(error)
    } finally {
      setIsApplying(false);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview({
      ...newReview,
      comment: e.target.value
    });
  };

  const handleRatingChange = (rating: number) => {
    setNewReview({
      ...newReview,
      rating
    });
  };

  const handleReviewSubmit = async () => {
    if (!id) return;
    if (newReview.rating === 0) {
      toast.error("Kérjük, adjon értékelést (1-5).");
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("Nem sikerült azonosítani a felhasználót.");
        setIsSubmittingReview(false);
        return;
      }
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Nincs bejelentkezve felhasználó.");
        setIsSubmittingReview(false);
        return;
      }
      
      await axios.post(
        `https://localhost:7067/api/general/jobreviews`,
        {
          jobId: parseInt(id),
          reviewerId: parseInt(userId),
          rating: newReview.rating,
          comment: newReview.comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Értékelés sikeresen elküldve!");
      setNewReview({ comment: "", rating: 0 });
      setUserHasReviewed(true);
      fetchReviews();
    } catch (error) {
      toast.error("Hiba történt az értékelés elküldésekor!");
      console.error(error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!work) return <p>Betöltés...</p>;

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
            <Link className={styles.back} to={routes.worksPage.path}>
                <img src="/back.png" alt="back icon" /> Vissza a munkákhoz
            </Link>
            <div className={styles.top}>
                <img src={work.image} alt={work.title} className={styles.image} />
                <div className={styles.textOverlay}>
                    <h1>{work.title}</h1>
                    <h3>{work.salary}</h3>
                </div>
                <div className={styles.buttonOverlay}>
                    <button onClick={handleApply} disabled={isApplying}>
                        {isApplying ? "Jelentkezés folyamatban..." : "Jelentkezem"}
                    </button>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.left}>
                    <div className={styles.section}>
                        <h2>Amit kínálunk</h2>
                        <p>{work.ourOffer}</p>
                    </div>
                    <div className={styles.section}>
                        <h2>Főbb feladatok</h2>
                        <p>{work.mainTasks}</p>
                    </div>
                    <div className={styles.section}>
                        <h2>Elvárásaink</h2>
                        <p>{work.jobRequirements}</p>
                    </div>
                    <div className={styles.section}>
                        <h2>Előnyt jelent</h2>
                        <p>{work.advantages}</p>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.infoCard}>
                        <div className={styles.cardItem}>
                            <img src="/hourly-rate.png" alt="hourly rate icon" />
                            <div className={styles.cardItemText}>
                                <h3>Fizetés</h3>
                                <p>{work.salary}</p>
                            </div>
                        </div>
                        <div className={styles.cardItem}>
                            <img src="/location.png" alt="location icon" />
                            <div className={styles.cardItemText}>
                                <h3>Helyszín</h3>
                                <p>{work.city}, {work.address}</p>
                            </div>
                        </div>
                        <div className={styles.cardItem}>
                            <img src="/list.png" alt="category icon" />
                            <div className={styles.cardItemText}>
                                <h3>Kategória</h3>
                                <p>{work.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.reviewSection}>
              <h2>Értékelések</h2>
              
              {localStorage.getItem("token") && !userHasReviewed ? (
                <div className={styles.sendReview}>
                  <div className={styles.ratingSelector}>
                    <p>Értékelés:</p>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star}
                          className={`${styles.star} ${newReview.rating >= star ? styles.active : ''}`}
                          onClick={() => handleRatingChange(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    placeholder="Írd le véleményed a munkáról..."
                  ></textarea>
                  <button 
                    onClick={handleReviewSubmit}
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? "Küldés folyamatban..." : "Küldés"}
                  </button>
                </div>
              ) : localStorage.getItem("token") && userHasReviewed ? (
                <div className={styles.alreadyReviewed}>
                  <p>Már értékelted ezt a munkát.</p>
                </div>
              ) : null}
              
              <div className={styles.reviewsList}>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <span className={styles.reviewerName}>{review.reviewerName}</span>
                          <span className={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString('hu-HU')}
                          </span>
                        </div>
                        <div className={styles.reviewRating}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noReviews}>Még nincsenek értékelések erre a munkára.</p>
                )}
              </div>
            </div>
        </div>
    </div>
  );
};

export default WorkPage;