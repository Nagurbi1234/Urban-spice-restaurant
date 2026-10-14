import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, try to fetch the current user
  useEffect(() => {
    const token = localStorage.getItem("urban-spice-token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("urban-spice-token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await authService.loginUser(credentials);
    localStorage.setItem("urban-spice-token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.registerUser(payload);
    localStorage.setItem("urban-spice-token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("urban-spice-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
