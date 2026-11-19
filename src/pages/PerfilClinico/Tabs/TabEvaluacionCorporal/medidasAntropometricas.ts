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

/** Relación cintura-cadera = cintura (cm) / cadera (cm), con 2 decimales; vacío si falta un dato */
export const calcularCinturaCadera = (cintura: Medida, cadera: Medida) => {
  const cmCintura = aNumero(cintura)
  const cmCadera = aNumero(cadera)
  return cmCintura && cmCadera ? (cmCintura / cmCadera).toFixed(2) : ''
}
