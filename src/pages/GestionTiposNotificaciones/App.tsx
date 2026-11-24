import { useEffect, useState, type FormEvent } from 'react'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { Card1 } from '@/components/Cards/Card1/Card1'
import { DataTableSimple, type ColumnaSimple } from '@/components/DataTableSimple/DataTableSimple'
import IconCR from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useTiposNotificaciones, type TipoNotificacionProps } from './hook/useTiposNotificaciones'

const TIPO_NUEVO: TipoNotificacionProps = { id: 0, codigo: '', valor: '' }

/** Tipos de notificaciones: CRUD de sus terminologías (id, código y valor) */
export const App = () => {
  const { tipos, cargando, guardando, error, obtenerTipos, guardarTipo, eliminarTipo } = useTiposNotificaciones()
  /** Tipo del modal (id 0 = nuevo); null = cerrado */
  const [tipo, setTipo] = useState<TipoNotificacionProps | null>(null)

  useEffect(() => {
    obtenerTipos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cerrar = () => setTipo(null)

  const onGuardar = async (e: FormEvent) => {
    e.preventDefault()
    if (tipo && await guardarTipo(tipo)) cerrar()
  }

  const columnas: ColumnaSimple<TipoNotificacionProps>[] = [
    { id: 'id', header: 'Id', render: (row) => row.id },
    { id: 'codigo', header: 'Código', render: (row) => row.codigo },
    { id: 'valor', header: 'Valor', render: (row) => row.valor },
    {
      id: 'acciones',
      header: '',
      render: (row) => (
        <div className="d-flex justify-content-end">
          <ButtonCR title="Editar" variant="primary" icon={<IconCR name="edit" size={14} />} onClick={() => setTipo(row)} />
          <ButtonCR title="Eliminar" variant="danger" icon={<IconCR name="trash" size={14} />} onClick={() => eliminarTipo(row)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageBreadCumb title="Tipos de notificaciones" />
      <Card1 className="view-h-100">
        <Card1.Body className="p-2 position-relative">
          <ButtonCR label="Agregar Nuevo" onClick={() => setTipo(TIPO_NUEVO)} icon={<IconCR name="plus" size={14} />} />
          <LoadingOverlay show={cargando} interno texto="Cargando tipos" />
          {error
            ? <p className="small text-danger text-center mb-0">No se pudieron cargar los tipos de notificaciones.</p>
            : <DataTableSimple data={tipos} columns={columnas} />}
        </Card1.Body>
      </Card1>
      {tipo && (
        <ModalCR show onHide={cerrar} size="sm" position="center">
          <ModalCR.Header>
            <ModalCR.Title>{tipo.id ? `Editar tipo #${tipo.id}` : 'Agregar tipo'}</ModalCR.Title>
          </ModalCR.Header>
          <ModalCR.Body>
            <form onSubmit={onGuardar}>
              <InputCR label="Código" name="codigo" required maxLength={150} value={tipo.codigo} onChange={(e) => setTipo({ ...tipo, codigo: e.target.value })} />
              <InputCR label="Valor" name="valor" required maxLength={150} value={tipo.valor} onChange={(e) => setTipo({ ...tipo, valor: e.target.value })} />
              <div className="d-flex align-items-center mt-3">
                <ButtonCR type="submit" label={guardando ? 'Guardando...' : 'Guardar'} disabled={guardando || !tipo.codigo.trim() || !tipo.valor.trim()} />
                <ButtonCR label="Cancelar" variant="link" onClick={cerrar} disabled={guardando} />
              </div>
            </form>
          </ModalCR.Body>
        </ModalCR>
      )}
    </div>
  )
}
