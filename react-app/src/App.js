import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import Prijava from './Prijava';
import Registracija from './Registracija';
import NavigationMenu from './NavigationMenu';
import KanbanBoard from './KanbanBoard';
import Calendar from './Calendar';
import Breadcrumb from './Breadcrumb';

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
    localStorage.removeItem('user_role'); 
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <NavigationMenu isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/taskovi" element={<KanbanBoard />} />
        <Route path="/kalendar" element={<Calendar />} />
        <Route path="/prijava" element={<Prijava onLogin={handleLogin} />} />
        <Route path="/registracija" element={<Registracija onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
