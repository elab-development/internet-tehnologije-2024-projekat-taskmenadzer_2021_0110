import React from 'react';
import { NavLink } from 'react-router-dom';

function NavigationMenu({ isLoggedIn, handleLogout }) {
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
          <button onClick={handleLogout} style={styles.logoutButton}>
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
