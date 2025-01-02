import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function NavigationMenu({ isLoggedIn, handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/odjava', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        handleLogout();
        navigate('/'); 
        alert('Uspešno ste se odjavili.');
      } else {
        alert('Greška prilikom odjave. Pokušajte ponovo.');
      }
    } catch (error) {
      console.error('Greška prilikom slanja zahteva za odjavu:', error);
      alert('Greška prilikom odjave. Pokušajte ponovo.');
    }
  };

  return (
    <nav style={styles.navbar}>
      <NavLink
        to="/"
        style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        end
      >
        Početna
      </NavLink>
      {isLoggedIn ? (
        <>
          <NavLink
            to="/taskovi"
            style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Taskovi
          </NavLink>
          <NavLink
            to="/kalendar"
            style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Kalendar
          </NavLink>
          <button onClick={handleLogoutClick} style={styles.logoutButton}>
            Odjavi se
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/prijava"
            style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Prijava
          </NavLink>
          <NavLink
            to="/registracija"
            style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Registracija
          </NavLink>
        </>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '10px 0',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '18px',
  },
  activeLink: {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: '#007BFF',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#333',
    fontSize: '18px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default NavigationMenu;
