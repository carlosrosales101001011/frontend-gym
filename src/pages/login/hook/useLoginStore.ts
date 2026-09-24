import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import httpClient from "@/common/helpers/httpClient";
import { useAuth } from "@/hook/useAuth";

export type LoginValues = {
  email: string;
  password: string;
};

const mensajeError = (error: unknown) =>
  Array.isArray(error) ? error.join(', ') : String(error || 'No se pudo iniciar sesión')

export const useLoginStore = () => {
    const { login: loginAuth, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [errorLogin, setErrorLogin] = useState<string | null>(null);
    const redirectUrl = useMemo(
      () => (location.state && location.state.from ? location.state.from.pathname : '/home'),
      [location.state]
    );

    const login = async (values: LoginValues) => {
      setErrorLogin(null)
      try {
        const { data } = await httpClient.post('/user/login', values)
        loginAuth(data.token)
        navigate(redirectUrl)
      } catch (error) {
        logout()
        setErrorLogin(mensajeError(error))
      }
    }

  return {
    login,
    errorLogin,
  }
}
