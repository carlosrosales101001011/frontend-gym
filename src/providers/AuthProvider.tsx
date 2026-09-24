import { useState, useCallback, type ReactNode } from "react";

import { AuthContext, type AuthContextType} from "@/providers/AuthContext";

export const STORAGE_KEY = "auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || null;
});

  const login = useCallback((token:string) => {
    localStorage.setItem(STORAGE_KEY, token);
    setToken(token)
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  const value: AuthContextType = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    );
};
