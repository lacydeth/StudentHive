import { useState } from 'react';
import axios from 'axios';
import styles from './Register.module.css';
import Title from '../../components/Title/Title';
import { routes } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const response = await axios.post('https://localhost:7067/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
  
      console.log('Registration successful:', response.data);
      localStorage.setItem('authToken', response.data.token);
      navigate('/login');
      setError(null);

    } catch (error: any) {
      if (error.response && error.response.data) {
        const { code, description } = error.response.data;
        setError(`${code}: ${description}`);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <Navbar />
      <div className={styles.registerContent}>
        <Title subTitle="Regisztráció" title="Regisztrálj új StudentHive fiókot!" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form
          className={styles.registerForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="vezetéknév"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <img src="./id-card.png" alt="last name icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="keresztnév"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <img src="./id-card.png" alt="first name icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <img src="./mail.png" alt="email icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img src="./key.png" alt="password icon" />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="jelszó mégegyszer"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <img src="./key.png" alt="confirm password icon" />
          </div>
          <button type="submit" className={styles.registerBtn}>
            regisztráció
          </button>
        </form>
        <p>
          Már van profilod?{' '}
          <Link className={styles.haveProfile} to={routes.loginPage.path}>
            Lépj be!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
