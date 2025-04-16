import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(function() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function login(username, password) {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', 
        { username:username.trim(), password:password.trim() },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Login response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData; // Return the user data for potential use
    } catch (error) {
      // Enhanced error handling
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Login failed';
      throw new Error(errorMessage);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;