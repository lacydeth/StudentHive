import { useState } from 'react';
import axios from 'axios';
import './Register.css';
import Title from '../../components/Title/Title';
import { routes } from '../../App';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7074/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });

      console.log('Registration successful:', response.data);
      setError(null); // Clear any previous error
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
    <div className="register-container">
      <div className="register-content">
        <Title subTitle="Regisztráció" title="Regisztrálj új StudentHive fiókot!" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form
          className="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className="input-box">
            <input
              type="text"
              placeholder="vezetéknév"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <img src="./id-card.png" alt="last name icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="keresztnév"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <img src="./id-card.png" alt="first name icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <img src="./mail.png" alt="email icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img src="./key.png" alt="password icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="jelszó mégegyszer"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <img src="./key.png" alt="confirm password icon" />
          </div>
          <button type="submit" className="register-btn">
            regisztráció
          </button>
        </form>
        <p>
          Már van profilod?{' '}
          <Link className="have-profile" to={routes.loginPage.path}>
            Lépj be!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
