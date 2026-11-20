import { create } from 'zustand'

/** Número decimal: lo devuelve el back como número (o texto) y mientras se escribe es texto */
export type Decimal = number | string | null

/** Una fecha del perfil nutricional del paciente (tabla perfil_nutricional) */
export type PerfilNutricional = {
  id: number
  id_cli: number
  /** yyyy-MM-dd */
  fecha: string
  nombrePerfil: string | null
  uid_image_fotoPerfil: string | null
  uid_image_fotoFrente: string | null
  // Hábitos y estilo de vida
  horas_suenio_evida: Decimal
  consumo_agua_evida: Decimal
  consumo_alcohol_evida: string | null
  fuma_evida: boolean | null
  estres_evida: number | null
  actividadDiaria_evida: string | null
  // Ids de terminología separados por coma + lo escrito en "¿Cuál?"
  objetivo_principal: string | null
  objetivo_principal_cuales: string | null
  // Análisis segmental (kg)
  masa_magra_brazoDerecho: Decimal
  grasa_brazoDerecho: Decimal
  masa_magra_brazoIzquierdo: Decimal
  grasa_brazoIzquierdo: Decimal
  masa_magra_tronco: Decimal
  grasa_tronco: Decimal
  masa_magra_piernaDerecha: Decimal
  grasa_piernaDerecha: Decimal
  masa_magra_piernaIzquierda: Decimal
  grasa_piernaIzquierda: Decimal
  // Perímetros (cm)
  medida_cuello: Decimal
  medida_pecho: Decimal
  medida_brazoDerecho: Decimal
  medida_brazoIzquierdo: Decimal
  medida_musloDerecho: Decimal
  medida_musloIzquierdo: Decimal
  // Evaluación antropométrica
  peso: Decimal
  talla: Decimal
  cintura: Decimal
  cadera: Decimal
  // Parámetros de investigación
  tasa_metabolica_basal: Decimal
  nivel_grasa_viceral: Decimal
  porcentaje_obesidad: Decimal
  masa_esqueletica: Decimal
  mineral_oseo: Decimal
  observacion_corporal: string | null
  // Antecedentes: ids separados por coma, "¿Cuáles?" y observación
  antecedentes_personales: string | null
  antecedentes_personales_cuales: string | null
  antecedentes_personales_observacion: string | null
  antecedentes_familiares: string | null
  antecedentes_familiares_cuales: string | null
  antecedentes_familiares_observacion: string | null
  lesiones: string | null
  lesiones_cuales: string | null
  lesiones_observacion: string | null
  alergias: string | null
  alergias_cuales: string | null
  alergias_observacion: string | null
  /** null = No; texto (aunque sea vacío) = Sí. Varias separadas por coma, en el mismo orden que cirugia_fecha */
  cirugia: string | null
  cirugia_fecha: string | null
}

/** Lo que se puede guardar de una fecha (id, id_cli, fecha y nombrePerfil no: se eligen al agregarla) */
export type CampoPerfil = Exclude<keyof PerfilNutricional, 'id' | 'id_cli' | 'fecha' | 'nombrePerfil'>
export type CambiosPerfil = Partial<Pick<PerfilNutricional, CampoPerfil>>

type PerfilNutricionalStore = {
  /** Fechas del paciente, de la más antigua a la más reciente */
  registros: PerfilNutricional[]
  /** Fecha elegida en la fila de fechas (todas las pestañas muestran esta) */
  idSeleccionado: number | null
  /** Lo que se está escribiendo y todavía no se guarda (se guarda al salir del campo) */
  borrador: CambiosPerfil
  cargando: boolean
  setRegistros: (registros: PerfilNutricional[], idSeleccionado: number | null) => void
  seleccionar: (id: number) => void
  setBorrador: (cambios: CambiosPerfil) => void
  quitarDelBorrador: (campos: CampoPerfil[]) => void
  /** Reemplaza una fecha con lo que devolvió el back */
  actualizarRegistro: (registro: PerfilNutricional) => void
  setCargando: (cargando: boolean) => void
}

export const usePerfilNutricionalStore = create<PerfilNutricionalStore>((set) => ({
  registros: [],
  idSeleccionado: null,
  borrador: {},
  cargando: false,
  setRegistros: (registros, idSeleccionado) => set({ registros, idSeleccionado, borrador: {} }),
  seleccionar: (id) => set({ idSeleccionado: id, borrador: {} }),
  setBorrador: (cambios) => set((estado) => ({ borrador: { ...estado.borrador, ...cambios } })),
  quitarDelBorrador: (campos) =>
    set((estado) => {
      const borrador = { ...estado.borrador }
      campos.forEach((campo) => delete borrador[campo])
      return { borrador }
    }),
  actualizarRegistro: (registro) =>
    set((estado) => ({ registros: estado.registros.map((r) => (r.id === registro.id ? registro : r)) })),
  setCargando: (cargando) => set({ cargando }),
}))
