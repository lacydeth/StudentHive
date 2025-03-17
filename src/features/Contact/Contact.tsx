import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Contact.module.css";
import { toast } from "react-toastify";
import axios from "axios";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "a587178b-0a8c-4d9e-83d6-703134df0a0d");

    try {
      const response = await axios.post("https://api.web3forms.com/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Üzenetét megkaptunk! A lehető legrövidebb időn belül válaszolunk.");
      } else {
        toast.error(response.data.message || "Hiba történt az üzenet küldése közben");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.contactWrapper}>
          <div className={styles.contactInfo}>
            <h1>Vedd fel velünk a kapcsolatot</h1>
            <p>Bármilyen kérdésed lenne vagy segítséget kérnél? Írj nekünk még ma!</p>
            
            <div className={styles.infoSection}>
              <h2>Információk</h2>
              <p>📍 Debrecen, Széchenyi u. 58, 4025</p>
              <p>📞 +36 12 345 6789</p>
              <p>✉️ info.studenthive@gmail.com</p>
            </div>

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="access_key"
                value="a587178b-0a8c-4d9e-83d6-703134df0a0d"
              />
              <input type="hidden" name="subject" value="Új üzenet a StudentHive-tól" />
              <input type="checkbox" name="botcheck" className={styles.hidden} />

              <div className={styles.formGroup}>
                <label htmlFor="name">Teljes név</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Üzenet</label>
                <textarea id="message" name="message" rows={5} required></textarea>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Küldés..." : "Üzenet küldése"}
              </button>
            </form>
          </div>

          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d647.2329026164741!2d21.61643949911079!3d47.5255000200502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e126f604401%3A0x8f271fee14d8556c!2sDebreceni%20SZC%20Mechwart%20Andr%C3%A1s%20G%C3%A9pipari%20%C3%A9s%20Informatikai%20Technikum!5e1!3m2!1shu!2hu!4v1741608395776!5m2!1shu!2hu"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
