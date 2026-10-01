/**
 * Rutas de perfil (ej. /:url_modulo/perfil-cliente/:uid). No son secciones del menú: ProtectedRoutes no las
 * valida contra las secciones del usuario; las valida ProfileGuard con la sección de gestión que las contiene.
 * Si se agrega una ruta de perfil en routes/index.tsx, va también aquí.
 */
export const RUTAS_PERFIL = ['perfil-usuario', 'perfil-cliente', 'perfil-colaborador']
