import React, { createContext, useState } from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Function to handle login with role
  const login = (role,name) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Set the currentUser with the authenticated user information
    setCurrentUser({
      name: name, // Replace with the actual username
      // Add any other user information you need
    });
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, userRole, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};