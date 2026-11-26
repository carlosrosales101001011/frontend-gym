import { useEffect, useState, type FormEvent } from 'react'
import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { Card1 } from '@/components/Cards/Card1/Card1'
import { DataTableSimple, type ColumnaSimple } from '@/components/DataTableSimple/DataTableSimple'
import IconCR from '@/components/Icons/IconCR'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useAlergenos, type AlergenoProps } from './hook/useAlergenos'

const ALERGENO_NUEVO: AlergenoProps = { id: 0, valor: '' }

/** Alérgenos: CRUD de sus terminologías (id y valor) */
export const App = () => {
  const { alergenos, cargando, guardando, error, obtenerAlergenos, guardarAlergeno, eliminarAlergeno } = useAlergenos()
  /** Alérgeno del modal (id 0 = nuevo); null = cerrado */
  const [alergeno, setAlergeno] = useState<AlergenoProps | null>(null)

  useEffect(() => {
    obtenerAlergenos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cerrar = () => setAlergeno(null)

  const onGuardar = async (e: FormEvent) => {
    e.preventDefault()
    if (alergeno && await guardarAlergeno(alergeno)) cerrar()
  }

  const columnas: ColumnaSimple<AlergenoProps>[] = [
    { id: 'id', header: 'Id', render: (row) => row.id },
    { id: 'valor', header: 'Valor', render: (row) => row.valor },
    {
      id: 'acciones',
      header: '',
      render: (row) => (
        <div className="d-flex justify-content-end">
          <ButtonCR title="Editar" variant="primary" icon={<IconCR name="edit" size={14} />} onClick={() => setAlergeno(row)} />
          <ButtonCR title="Eliminar" variant="danger" icon={<IconCR name="trash" size={14} />} onClick={() => eliminarAlergeno(row)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageBreadCumb title="Gestión de alérgenos" />
      <Card1 className="view-h-100">
        <Card1.Body className="p-2 position-relative">
          <ButtonCR label="Agregar Nuevo" onClick={() => setAlergeno(ALERGENO_NUEVO)} icon={<IconCR name="plus" size={14} />} />
          <LoadingOverlay show={cargando} interno texto="Cargando alérgenos" />
          {error
            ? <p className="small text-danger text-center mb-0">No se pudieron cargar los alérgenos.</p>
            : <DataTableSimple data={alergenos} columns={columnas} />}
        </Card1.Body>
      </Card1>
      {alergeno && (
        <ModalCR show onHide={cerrar} size="sm" position="center">
          <ModalCR.Header>
            <ModalCR.Title>{alergeno.id ? `Editar alérgeno #${alergeno.id}` : 'Agregar alérgeno'}</ModalCR.Title>
          </ModalCR.Header>
          <ModalCR.Body>
            <form onSubmit={onGuardar}>
              <InputCR label="Valor" name="valor" required maxLength={150} value={alergeno.valor} onChange={(e) => setAlergeno({ ...alergeno, valor: e.target.value })} />
              <div className="d-flex align-items-center mt-3">
                <ButtonCR type="submit" label={guardando ? 'Guardando...' : 'Guardar'} disabled={guardando || !alergeno.valor.trim()} />
                <ButtonCR label="Cancelar" variant="link" onClick={cerrar} disabled={guardando} />
              </div>
            </form>
          </ModalCR.Body>
        </ModalCR>
      )}
    </div>
  )
}
