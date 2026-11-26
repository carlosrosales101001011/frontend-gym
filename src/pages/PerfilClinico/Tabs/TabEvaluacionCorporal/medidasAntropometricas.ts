/** Valor de una medida: número guardado o texto que se está escribiendo */
type Medida = number | string | null | undefined

/** Número de una medida (acepta coma decimal); null si está vacía o no es válida */
const aNumero = (medida: Medida) => {
  const texto = String(medida ?? '').trim()
  const numero = Number(texto.replace(',', '.'))
  return texto && Number.isFinite(numero) ? numero : null
}

/** IMC = peso (kg) / talla² (m), con 1 decimal; vacío si falta un dato */
export const calcularImc = (peso: Medida, talla: Medida) => {
  const kg = aNumero(peso)
  const m = aNumero(talla)
  return kg && m ? (kg / (m * m)).toFixed(1) : ''
}

/** Clasificación del IMC (OMS) y su color de Bootstrap: verde normal, amarillo bajo peso o sobrepeso, rojo obesidad */
export const clasificarImc = (imc: string) => {
  const valor = aNumero(imc)
  if (valor === null) return null
  if (valor < 18.5) return { texto: 'Bajo peso', color: 'warning' } as const
  if (valor < 25) return { texto: 'Normal', color: 'success' } as const
  if (valor < 30) return { texto: 'Sobrepeso', color: 'warning' } as const
  return { texto: 'Obesidad', color: 'danger' } as const
}

/** PGC (porcentaje de grasa corporal) = masa grasa corporal (kg) / peso (kg) × 100, con 1 decimal; vacío si falta un dato */
export const calcularPgc = (masaGrasa: Medida, peso: Medida) => {
  const grasa = aNumero(masaGrasa)
  const kg = aNumero(peso)
  return grasa !== null && kg ? ((grasa / kg) * 100).toFixed(1) : ''
}

/** Tramo de una barra de rangos: hasta qué valor llega, su nombre y su color de Bootstrap */
export type RangoMedida = { hasta: number, texto: string, color: 'warning' | 'success' | 'danger' }
/** Escala de una barra: desde dónde empieza y sus tramos de menor a mayor (el último llega hasta el final) */
export type EscalaMedida = { desde: number, rangos: RangoMedida[] }

/** Escala del IMC (OMS), igual que clasificarImc */
export const ESCALA_IMC: EscalaMedida = {
  desde: 15,
  rangos: [
    { hasta: 18.5, texto: 'Bajo peso', color: 'warning' },
    { hasta: 25, texto: 'Normal', color: 'success' },
    { hasta: 30, texto: 'Sobrepeso', color: 'warning' },
    { hasta: 40, texto: 'Obesidad', color: 'danger' },
  ],
}

/** Escala del PGC según el sexo (rangos de InBody): el normal de la mujer es más alto */
export const ESCALA_PGC: Record<'masculino' | 'femenino', EscalaMedida> = {
  masculino: {
    desde: 0,
    rangos: [
      { hasta: 10, texto: 'Bajo', color: 'warning' },
      { hasta: 20, texto: 'Normal', color: 'success' },
      { hasta: 40, texto: 'Alto', color: 'danger' },
    ],
  },
  femenino: {
    desde: 5,
    rangos: [
      { hasta: 18, texto: 'Bajo', color: 'warning' },
      { hasta: 28, texto: 'Normal', color: 'success' },
      { hasta: 50, texto: 'Alto', color: 'danger' },
    ],
  },
}

/** Tramo de la escala donde cae el valor (el primero o el último si se sale); null si no hay valor */
export const clasificarEnEscala = (valor: Medida, { rangos }: EscalaMedida) => {
  const numero = aNumero(valor)
  if (numero === null) return null
  return rangos.find((r) => numero < r.hasta) ?? rangos[rangos.length - 1]
}

/** Relación cintura-cadera = cintura (cm) / cadera (cm), con 2 decimales; vacío si falta un dato */
export const calcularCinturaCadera = (cintura: Medida, cadera: Medida) => {
  const cmCintura = aNumero(cintura)
  const cmCadera = aNumero(cadera)
  return cmCintura && cmCadera ? (cmCintura / cmCadera).toFixed(2) : ''
}
