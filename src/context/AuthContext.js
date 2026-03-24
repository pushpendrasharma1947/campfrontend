import { createContext, useContext, useMemo, useState } from "react";

const TOKEN_STORAGE_KEY = "campuskart_token";

const AuthContext = createContext(null);

function parseToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const user = useMemo(() => parseToken(token), [token]);
  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const login = (newToken) => {
    setToken(newToken);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setToken("");
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
