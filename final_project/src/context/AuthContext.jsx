import { createContext, useContext, useState } from "react";
import { useApi } from "../hooks/useApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { fetchData } = useApi("/api/login");

  const login = async (credentials) => {
    const response = await fetchData(credentials);
    if (response?.token) {
      setUser({ username: response.username });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}