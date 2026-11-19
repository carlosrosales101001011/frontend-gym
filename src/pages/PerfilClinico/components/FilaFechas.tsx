import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { BtnAdd } from '@/components/Button/buttonsCrud'
import IconCR from '@/components/Icons/IconCR'
import { formatDate } from '@/helpers/FormatDate'
import { usePerfilNutricional } from '../hook/usePerfilNutricional'

/** La fecha llega como yyyy-MM-dd (o ISO): se muestra dd/mm/yyyy */
const textoFecha = (fecha: string) => formatDate(fecha.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy')

/**
 * Fila de fechas del perfil nutricional del paciente: agregar fecha (hoy), flecha a la anterior, 3 fechas
 * (anterior, la elegida al medio y la siguiente) y flecha a la siguiente. Click en una fecha de los lados la elige.
 * Todas las pestañas muestran y guardan los datos de la fecha elegida.
 */
export const FilaFechas = () => {
  const { colaborador } = useSelector((state: RootState) => state.PERFIL_COLABORADOR)
  const { registros, registro, cargando, seleccionar, agregarFecha } = usePerfilNutricional()
  const [agregando, setAgregando] = useState(false)
  const indice = registros.findIndex((r) => r.id === registro?.id)

  const agregar = async () => {
    setAgregando(true)
    await agregarFecha(colaborador.id)
    setAgregando(false)
  }

  /** Fecha a un costado de la elegida; si no hay, el lugar queda vacío para que la del medio no se mueva */
  const lateral = (i: number) => (
    <div className="flex-fill text-center" style={{ flexBasis: 0 }}>
      {registros[i] && (
        <ButtonCR variant="link" className="text-decoration-none opacity-75" label={textoFecha(registros[i].fecha)} onClick={() => seleccionar(registros[i].id)} />
      )}
    </div>
  )

  return (
    <div className="card card-mode-actual p-2 d-flex flex-row align-items-center gap-2">
      <BtnAdd label="Agregar fecha" title="Agrega la fecha de hoy" disabled={agregando || cargando || !colaborador.id} onClick={agregar} />
      <ButtonCR
        variant="light"
        label={<IconCR name="arrowLeft" size={20} />}
        title="Fecha anterior"
        aria-label="Fecha anterior"
        disabled={indice <= 0}
        onClick={() => seleccionar(registros[indice - 1].id)}
      />
      <div className="flex-grow-1 d-flex align-items-center">
        {registro ? (
          <>
            {lateral(indice - 1)}
            {/* Elegida: al medio, resaltada */}
            <div className="flex-fill text-center" style={{ flexBasis: 0 }}>
              <span className="d-inline-block bg-primary text-white rounded px-3 py-1 fw-bold">{textoFecha(registro.fecha)}</span>
            </div>
            {lateral(indice + 1)}
          </>
        ) : (
          <span className="flex-fill text-center small opacity-75">
            {cargando ? 'Cargando fechas...' : 'Sin fechas: agrega una para registrar los datos del paciente.'}
          </span>
        )}
      </div>
      <ButtonCR
        variant="light"
        label={<IconCR name="arrowRight" size={20} />}
        title="Fecha siguiente"
        aria-label="Fecha siguiente"
        disabled={indice === -1 || indice === registros.length - 1}
        onClick={() => seleccionar(registros[indice + 1].id)}
      />
    </div>
  )
}
