import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Title from '../../components/Title/Title';
import { Link } from 'react-router-dom';
import { routes } from '../../App';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const passwordTrimmed = password.trim();
      console.log('Logging in with:', email, passwordTrimmed);
      const response = await axios.post('https://localhost:7067/api/auth/login', {
        email,
        password: passwordTrimmed,
      });
  
      // Extract token and role from the response
      const { token, role } = response.data;
  
      // Store token in localStorage
      localStorage.setItem('token', token);
  
      // Redirect based on role
      if (role === 'Admin') {
        window.location.href = routes.adminPage.path;
      } else if (role === 'User') {
        window.location.href = routes.protectedPage.path;
      } else {
        console.error('Unknown role');
      }
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
      <Navbar />
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
