import type { OpcionUsuario } from '../hook/useModulosUsuario'

/** "#1009 · Nombres Apellidos (@usuario)": con el id para distinguir a los que se llaman igual */
export const nombreUsuario = (usuario: OpcionUsuario) =>
  `#${usuario.id} · ${`${usuario.nombres} ${usuario.apellidos}`.trim()}${usuario.usuario ? ` (@${usuario.usuario})` : ''}`
