import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { duracionRedondeada } from '@/helpers/duracionRedondeada'
import { useRachaCliente } from '../hook/useRachaCliente'

/**
 * Card verde del perfil: desde qué día el cliente está activo sin cortar y cuántas membresías seguidas lleva.
 * Si hoy no tiene una membresía activa no se muestra.
 */
export const CardActivoDesde = () => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { racha, obtenerRacha } = useRachaCliente()

  useEffect(() => {
    if (uid_person) obtenerRacha(uid_person)
  }, [uid_person])

  if (!racha) return null

  return (
    <div className="card-activo-desde" role="status">
      <div className="card-activo-desde__titulo">
        Activo desde hace {duracionRedondeada(racha.diasActivo)}
      </div>
      <div className="card-activo-desde__detalle">
        {racha.cantidad === 1 ? 'Va 1 membresía' : `Va ${racha.cantidad} membresías seguidas`} · 
      </div>
    </div>
  )
}
