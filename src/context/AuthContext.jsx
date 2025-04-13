import { createContext, useContext, useState } from "react";

import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data (e.g., token, role)
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/auth';

  const login = async ({ email, password }) => {
    try {
      // Send login request to backend
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token } = response.data;

      // Store token (e.g., in localStorage or state)
      localStorage.setItem('token', token);
      setUser({ token }); // Update context (you can decode JWT for user info)
      setError(null);

      return true; // Indicate success
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setUser(null);
      throw err; // Let the component handle navigation or errors
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const { fetchData } = useApi("/api/login");

//   const login = async (credentials) => {
//     const response = await fetchData(credentials);
//     if (response?.token) {
//       setUser({ username: response.username });
//     }
//   };

//   const logout = () => setUser(null);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }