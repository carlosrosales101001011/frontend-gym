import httpClient from "@/common/helpers/httpClient";
import { useAppDispatch, useAppSelector } from "@/stores/Store";
import { onSetUsuarioSesion, type UsuarioSesionProps } from "@/stores/sesion/sesionSlice";

/** Usuario logueado: queda en el store para cualquier pantalla (se vuelve a pedir al entrar al Home, por si cambió de sesión) */
export const useSesionStore = () => {
  const dispatch = useAppDispatch()
  const { usuario } = useAppSelector((state) => state.SESION)

  const obtenerUsuarioSesion = async () => {
    try {
      const { data }: { data: UsuarioSesionProps } = await httpClient.get('/user/me')
      dispatch(onSetUsuarioSesion(data))
    } catch (error) {
      console.log(error);
    }
  }

  /** Cambia la contraseña del usuario logueado (PATCH /user/me/password). Si falla, lanza el error del backend */
  const cambiarPassword = async (password_actual: string, password_nueva: string) => {
    await httpClient.patch('/user/me/password', { password_actual, password_nueva })
  }

  return {
    usuario,
    /** "Nombres Apellidos" del usuario logueado ('' mientras carga) */
    nombreUsuario: usuario ? `${usuario.nombres} ${usuario.apellidos}`.trim() : '',
    obtenerUsuarioSesion,
    cambiarPassword,
  }
}
