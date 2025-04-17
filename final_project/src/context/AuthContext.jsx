import { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  error: null,
  loading: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  const login = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        url: 'auth/login',
        method: 'POST',
        data: {
          email: data.email,
          password: data.password,
        },
      });
      const { token, user: userData } = response.data;
      console.log('Login response:', response.data);
      localStorage.setItem('token', token);
      setUser({ ...userData, token });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    setLoading(false);
  };

  const contextValue = { user, login, logout, error, loading };
  console.log('AuthProvider context value:', contextValue); // Debug log

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;