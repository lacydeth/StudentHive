import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Title from '../../components/Title/Title';
import { Link } from 'react-router-dom';
import { routes } from '../../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const passwordTrimmed = password.trim();
      console.log('Logging in with:', email, passwordTrimmed); // Log email and password
      const response = await axios.post('https://localhost:7074/api/auth/login', {
          email,
          password: passwordTrimmed,
      });

      // Handle successful login
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data);
      window.location.href = '/test';
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        console.error('Login failed:', message);
        setError(message || 'An error occurred during login.');
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Title subTitle="Bejelentkezés" title="Lépj be a StudentHive fiókodba!" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form
          className="login-form"
          onSubmit={handleLogin}
        >
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
          <button type="submit" className="login-btn">
            bejelentkezés
          </button>
        </form>
        <p>
          Még nincs profilod?{' '}
          <Link className="have-profile" to={routes.registerPage.path}>
            Regisztrálj!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
