import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Prijava from './Prijava';
import Registracija from './Registracija';
import NavigationMenu from './NavigationMenu';
import KanbanBoard from './KanbanBoard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <NavigationMenu isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
      <Route path="/taskovi" element={<KanbanBoard />} />
        <Route path="/prijava" element={<Prijava onLogin={handleLogin} />} />
        <Route path="/registracija" element={<Registracija onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
