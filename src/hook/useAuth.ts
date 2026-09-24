import { useContext } from "react";
import { AuthContext } from "@/providers/AuthContext";

// Hook seguro
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};