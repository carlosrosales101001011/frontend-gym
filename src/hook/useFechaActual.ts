import { useEffect, useState } from "react"

/**
 * Fecha y hora actuales, actualizadas al empezar cada minuto (alineado al reloj: 21:50:00, 21:51:00...).
 * @param activo false = no corre el reloj (devuelve la fecha del montaje)
 */
export const useFechaActual = (activo = true) => {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    if (!activo) return
    let timer: ReturnType<typeof setTimeout>
    const programar = () => {
      const msHastaSiguienteMinuto = 60_000 - (Date.now() % 60_000)
      timer = setTimeout(() => {
        setAhora(new Date())
        programar()
      }, msHastaSiguienteMinuto)
    }
    programar()
    return () => clearTimeout(timer)
  }, [activo])

  return ahora
}
