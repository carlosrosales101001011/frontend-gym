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

/** Relación cintura-cadera = cintura (cm) / cadera (cm), con 2 decimales; vacío si falta un dato */
export const calcularCinturaCadera = (cintura: Medida, cadera: Medida) => {
  const cmCintura = aNumero(cintura)
  const cmCadera = aNumero(cadera)
  return cmCintura && cmCadera ? (cmCintura / cmCadera).toFixed(2) : ''
}
