import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import Title from '../../components/Title/Title';
import Navbar from '../../components/Navbar/Navbar';
import { roleRoutes, routes } from '../../utils/routes';
import { toast } from 'react-toastify';

const Login = () => {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
    }
  }, [location.state?.successMessage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('https://localhost:7067/api/auth/login', {
        email,
        password,
        stayLoggedIn,
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      window.location.href = roleRoutes[role] || routes.homePage.path;

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Váratlan hiba lépett fel.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Navbar />
      <div className={styles.loginContent}>
        <Title subTitle="Bejelentkezés" title="Lépj be a StudentHive fiókodba!" />
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.inputBox}>
            <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <img src="./mail.png" alt="email icon" />
          </div>
          <div className={styles.inputBox}>
            <input type="password" placeholder="jelszó" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <img src="./key.png" alt="password icon" />
          </div>
          <div className={styles.checkbox}>
            <input type="checkbox" checked={stayLoggedIn} onChange={(e) => setStayLoggedIn(e.target.checked)} />
            <span>Maradjak bejelentkezve</span>
          </div>
          <button type="submit" className={styles.loginBtn}>
            bejelentkezés
          </button>
        </form>
        <p>
          Még nincs profilod? <Link className={styles.haveProfile} to={routes.registerPage.path}>Regisztrálj!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
