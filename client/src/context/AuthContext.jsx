import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

// React Context lets us share the "logged in user" state across the
// whole app without passing it down through props manually at every
// level (aka "prop drilling"). Any component can call useAuth() to
// read the current user or call login/logout.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — just a shortcut so components write `useAuth()`
// instead of `useContext(AuthContext)` everywhere.
export const useAuth = () => useContext(AuthContext);