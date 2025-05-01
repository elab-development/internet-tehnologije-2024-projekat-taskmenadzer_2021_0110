import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();

  // Pretvaranje trenutne putanje u niz delova
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Funkcija za generisanje putanje za svaki deo
  const createPath = (index) => {
    return '/' + pathParts.slice(0, index + 1).join('/');
  };

  return (
    <div style={styles.breadcrumb}>
      <Link to="/" style={styles.breadcrumbLink}>
        Početna
      </Link>
      {pathParts.map((part, index) => (
        <span key={index}>
          {' > '}
          <Link to={createPath(index)} style={styles.breadcrumbLink}>
            {decodeURIComponent(part)}
          </Link>
        </span>
      ))}
    </div>
  );
}

const styles = {
  breadcrumb: {
    margin: '16px',
    fontSize: '14px',
    color: '#555',
  },
  breadcrumbLink: {
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default Breadcrumb;
