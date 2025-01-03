import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProtectedPage = () => {
  const [protectedData, setProtectedData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        // If no token, redirect to login page
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7074/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProtectedData(response.data);
      } catch (error) {
        setError('Failed to fetch protected data');
        console.error('Error fetching protected data:', error);
      }
    };

    fetchProtectedData();
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Protected Page</h2>
      {protectedData ? (
        <div>
          <h3>Data from Protected API:</h3>
          <pre>{JSON.stringify(protectedData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProtectedPage;
