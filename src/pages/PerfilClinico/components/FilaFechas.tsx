import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { formatDate } from '@/helpers/FormatDate'
import { useExportarPdfPerfil } from '../hook/useExportarPdfPerfil'
import { usePerfilNutricional } from '../hook/usePerfilNutricional'
import type { PerfilNutricional } from '../hook/usePerfilNutricionalStore'
import { ModalAgregarFecha } from './ModalAgregarFecha'

/** Ancho fijo de las fechas de los lados: así la elegida queda siempre al centro aunque falte la anterior o la siguiente */
const ANCHO_FECHA = 190
/** Ancho máximo de la elegida (fecha: nombre del perfil): un nombre más largo se corta con … */
const ANCHO_MAX_ELEGIDA = 420

/** La fecha llega como yyyy-MM-dd (o ISO): se muestra 21 junio del 2026 */
const textoFecha = (fecha: string) => formatDate(fecha.slice(0, 10), 'yyyy-mm-dd', 'd MMMM [del] yyyy')

/** Fecha de los lados y, debajo, el nombre del perfil */
const Etiqueta = ({ registro }: { registro: PerfilNutricional }) => (
  <span className="d-flex flex-column lh-sm">
    <span>{textoFecha(registro.fecha)}</span>
    {registro.nombrePerfil && <span className="small fw-normal text-truncate">{registro.nombrePerfil}</span>}
  </span>
)

/**
 * Fila de fechas del perfil nutricional del paciente, todo junto al centro: flecha a la anterior, 3 fechas (anterior,
 * la elegida y la siguiente), flecha a la siguiente y "+" para agregar una fecha (modal con fecha y nombre del perfil).
 * La elegida va en una línea, "fecha: nombre del perfil", con un menú de tres puntos (editar / exportar PDF / eliminar).
 * Click en una fecha de los lados la elige. Todas las pestañas muestran y guardan los datos de la fecha elegida.
 */
export const FilaFechas = () => {
  const { colaborador } = useSelector((state: RootState) => state.PERFIL_COLABORADOR)
  const { registros, registro, cargando, seleccionar, eliminarFecha } = usePerfilNutricional()
  const { exportarPdf, exportando } = useExportarPdfPerfil()
  /** Modal abierto: agregar una fecha nueva o editar la elegida */
  const [modal, setModal] = useState<'agregar' | 'editar' | null>(null)
  const indice = registros.findIndex((r) => r.id === registro?.id)

  /** Pide confirmación y da de baja la fecha elegida (con todos sus datos) */
  const confirmarEliminar = async () => {
    if (!registro) return
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar la fecha?',
      text: `${textoFecha(registro.fecha)}${registro.nombrePerfil ? ` · ${registro.nombrePerfil}` : ''}: se quitarán todos sus datos.`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (isConfirmed) eliminarFecha(registro)
  }

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
          {/* Elegida: al medio, resaltada. El menú va fuera del recuadro: el tema pinta de blanco todo lo que está dentro de bg-primary */}
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: ANCHO_MAX_ELEGIDA, minWidth: 0 }}>
            <span className="text-truncate bg-primary text-white rounded px-3 py-1 fw-bold" title={registro.nombrePerfil ?? undefined}>
              {textoFecha(registro.fecha)}{registro.nombrePerfil && `: ${registro.nombrePerfil}`}
            </span>
            <Dropdown align="end">
              {/* bsPrefix: sin las clases btn / dropdown-toggle (la flecha) que pone react-bootstrap */}
              <Dropdown.Toggle as="button" type="button" bsPrefix="d-flex border-0 bg-transparent p-0" title="Opciones" aria-label="Opciones de la fecha">
                <IconCR name="threeDotsVertical" size={16} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-actual">
                <Dropdown.Item as="button" type="button" className="d-flex align-items-center gap-2 color-mode-actual" onClick={() => setModal('editar')}>
                  <IconCR name="edit" size={14} />
                  Editar
                </Dropdown.Item>
                <Dropdown.Item as="button" type="button" className="d-flex align-items-center gap-2 color-mode-actual" disabled={exportando} onClick={exportarPdf}>
                  <IconCR name="archivoPdf" size={14} />
                  {exportando ? 'Exportando...' : 'Exportar PDF'}
                </Dropdown.Item>
                <Dropdown.Item as="button" type="button" className="d-flex align-items-center gap-2 text-danger" onClick={confirmarEliminar}>
                  <IconCR name="trash" size={14} className="" />
                  Eliminar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
        onClick={() => setModal('agregar')}
      />
      {/* key: al abrir se monta de nuevo con los datos de la fecha a editar (o vacío al agregar) */}
      <ModalAgregarFecha
        key={modal === 'editar' ? `editar-${registro?.id}` : 'agregar'}
        show={modal !== null}
        onHide={() => setModal(null)}
        id_cli={colaborador.id}
        registroEditar={modal === 'editar' ? registro : null}
      />
    </div>
  )
}
