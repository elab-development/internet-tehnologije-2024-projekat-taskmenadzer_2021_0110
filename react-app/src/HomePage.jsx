import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';


const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Hero sekcija */}
      <header className="hero-section">
        <h1 className="hero-title">Task Management Aplikacija</h1>
        <p className="hero-subtitle">
          Organizujte svoje zadatke, timski rad i rokove na jednom mestu.
        </p>
        {!isLoggedIn && (
          <div className="button-container">
            <button
              className="hero-button"
              onClick={() => navigate('/prijava')}
            >
              Prijavi se
            </button>
            <button
              className="hero-button register-button"
              onClick={() => navigate('/registracija')}
            >
              Registruj se
            </button>
          </div>
        )}
      </header>

      

    </div>
  );
};

export default HomePage;
