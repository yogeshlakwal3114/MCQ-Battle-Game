import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for authentication
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check local storage for stored user info
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
    }
  }, []);

  const login = (email) => {
    // Simulate login logic (API call, etc.)
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
  };

  const logout = () => {
    // Simulate logout logic (clear local storage, etc.)
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
