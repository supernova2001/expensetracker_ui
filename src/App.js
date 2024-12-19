import React, { useState, useEffect } from 'react';
import Router from './routes/router';
import routes from './routes/routes';
import Link from './routes/link';
import "./style.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userEmail = localStorage.getItem('userEmail');
      setIsLoggedIn(!!userEmail);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <div className="navigationBar">
      <nav className="items">
        {!isLoggedIn && (
          <>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/login">Login</Link></p>
            <p><Link to="/register">Register</Link></p>
          </>
        )}
        {isLoggedIn && (
          <>
            <p><Link to="/dashboard">Dashboard</Link></p>
            <p><Link to="/expenses">Expenses</Link></p>
            <p><Link to="/expense-goals">Financial Goals</Link></p>
            <p><a onClick={handleLogout}>Logout</a></p>
          </>
        )}
      </nav>
      <Router routes={routes} />
    </div>
  );
}

export default App;