import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';

const Prijava = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    fetch('http://127.0.0.1:8000/api/prijava', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": formData.email,
            "password": formData.password
          }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Login successful:', data);
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_role', data.user.role); 
          onLogin();
          navigate('/');
        })
        .catch((error) => {
            console.error('Greška prilikom prijave:', error);
            setErrorMessage('Prijava nije uspela. Proverite email i lozinku.');
        });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleFormSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="auth-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Prijava;
