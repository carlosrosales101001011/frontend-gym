import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { formatDate } from '@/helpers/FormatDate'
import { usePerfilNutricional } from '../hook/usePerfilNutricional'
import type { PerfilNutricional } from '../hook/usePerfilNutricionalStore'
import { ModalAgregarFecha } from './ModalAgregarFecha'

/** Ancho fijo de cada fecha: así la elegida queda siempre al centro aunque falte la anterior o la siguiente */
const ANCHO_FECHA = 150

/** La fecha llega como yyyy-MM-dd (o ISO): se muestra dd/mm/yyyy */
const textoFecha = (fecha: string) => formatDate(fecha.slice(0, 10), 'yyyy-mm-dd', 'dd/mm/yyyy')

/** Fecha y, debajo, el nombre del perfil */
const Etiqueta = ({ registro }: { registro: PerfilNutricional }) => (
  <span className="d-flex flex-column lh-sm">
    <span>{textoFecha(registro.fecha)}</span>
    {registro.nombrePerfil && <span className="small fw-normal text-truncate">{registro.nombrePerfil}</span>}
  </span>
)

/**
 * Fila de fechas del perfil nutricional del paciente, todo junto al centro: flecha a la anterior, 3 fechas (anterior,
 * la elegida y la siguiente), flecha a la siguiente y "+" para agregar una fecha (modal con fecha y nombre del perfil).
 * Click en una fecha de los lados la elige. Todas las pestañas muestran y guardan los datos de la fecha elegida.
 */
export const FilaFechas = () => {
  const { colaborador } = useSelector((state: RootState) => state.PERFIL_COLABORADOR)
  const { registros, registro, cargando, seleccionar } = usePerfilNutricional()
  const [mostrarModal, setMostrarModal] = useState(false)
  const indice = registros.findIndex((r) => r.id === registro?.id)

  /** Fecha a un costado de la elegida; si no hay, el lugar queda vacío */
  const lateral = (i: number) => (
    <div className="text-center" style={{ width: ANCHO_FECHA }}>
      {registros[i] && (
        <ButtonCR
          variant="link"
          className="text-decoration-none opacity-75 w-100"
          title={registros[i].nombrePerfil ?? undefined}
          label={<Etiqueta registro={registros[i]} />}
          onClick={() => seleccionar(registros[i].id)}
        />
      )}
    </div>
  )

  return (
    <div className="p-2 d-flex flex-row align-items-center justify-content-center gap-2">
      <ButtonCR
        variant="light"
        label={<IconCR name="arrowLeft" size={20} />}
        title="Fecha anterior"
        aria-label="Fecha anterior"
        disabled={indice <= 0}
        onClick={() => seleccionar(registros[indice - 1].id)}
      />
      {registro ? (
        <>
          {lateral(indice - 1)}
          {/* Elegida: al medio, resaltada */}
          <div className="text-center" style={{ width: ANCHO_FECHA }} title={registro.nombrePerfil ?? undefined}>
            <span className="d-inline-block mw-100 bg-primary text-white rounded px-3 py-1 fw-bold">
              <Etiqueta registro={registro} />
            </span>
          </div>
          {lateral(indice + 1)}
        </>
      ) : (
        <span className="text-center small opacity-75 px-3">
          {cargando ? 'Cargando fechas...' : 'Sin fechas: agrega una con + para registrar los datos del paciente.'}
        </span>
      )}
      <ButtonCR
        variant="light"
        label={<IconCR name="arrowRight" size={20} />}
        title="Fecha siguiente"
        aria-label="Fecha siguiente"
        disabled={indice === -1 || indice === registros.length - 1}
        onClick={() => seleccionar(registros[indice + 1].id)}
      />
      <ButtonCR
        variant="primary"
        label={<IconCR name="plus" size={16} />}
        title="Agregar fecha"
        aria-label="Agregar fecha"
        disabled={cargando || !colaborador.id}
        onClick={() => setMostrarModal(true)}
      />
      <ModalAgregarFecha show={mostrarModal} onHide={() => setMostrarModal(false)} id_cli={colaborador.id} />
    </div>
  )
}
