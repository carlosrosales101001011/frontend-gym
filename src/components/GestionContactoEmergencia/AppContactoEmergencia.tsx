import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import type { ContactoEmergenciaProps } from '@/components/GestionContactoEmergencia/contactoEmergenciaSlice'
import { useContactoEmergenciaStore, type ContactoEmergenciaForm } from '@/components/GestionContactoEmergencia/useContactoEmergenciaStore'
import IconCR from '@/components/Icons/IconCR'
import { ModalContactoEmergencia } from '@/components/GestionContactoEmergencia/ModalContactoEmergencia'

/** "Nombres Apellido_paterno Apellido_materno" del contacto */
const nombreCompleto = (contacto: ContactoEmergenciaProps) =>
  [contacto.nombres, contacto.apellido_paterno, contacto.apellido_materno].filter(Boolean).join(' ')

/** Parentesco del contacto (label_cargo lo guarda el backend; tipoPariente solo si viene la relación) */
const parentesco = (contacto: ContactoEmergenciaProps) => contacto.label_cargo || contacto.tipoPariente?.valor || ''

/** Contacto guardado solo en memoria (sin API) */
const aContactoLocal = (datos: ContactoEmergenciaForm, id: number, labelCargo: string): ContactoEmergenciaProps =>
  ({ ...datos, id, label_cargo: labelCargo })

type AppContactoEmergenciaProps = {
  /** uid_contactoEmergencia de la persona (solo con UsarApiPOST) */
  uid_location?: string
  /**
   * true (default): lista, agrega, edita y elimina con la API de contactos de emergencia.
   * false: no llama a ninguna API de contactos; la lista queda en memoria y se informa con onChange
   * (ej. al registrar una persona que todavía no existe en el backend).
   */
  UsarApiPOST?: boolean
  /** Sin API: contactos con los que arranca la lista */
  contactosIniciales?: ContactoEmergenciaForm[]
  /** Sin API: se llama con la lista cada vez que cambia (sin id ni campos del backend) */
  onChange?: (contactos: ContactoEmergenciaForm[]) => void
}

/**
 * Contactos de emergencia de una persona: tabla simple con buscador, orden y paginación en el navegador,
 * y el modal para agregar / editar. Con UsarApiPOST = false trabaja solo en memoria.
 */
export const AppContactoEmergencia = ({ uid_location = '', UsarApiPOST = true, contactosIniciales = [], onChange }: AppContactoEmergenciaProps) => {
  const { deleteContactoEmergenciaxID, obtenerContactosEmergencia, postContactoEmergencia, patchContactoEmergencia, contactosEmergencia } = useContactoEmergenciaStore(uid_location)
  // Modal: undefined = cerrado; null = agregar; contacto = editar
  const [contactoModal, setContactoModal] = useState<ContactoEmergenciaProps | null | undefined>(undefined)

  // Sin API: la lista vive aquí; los ids son negativos y solo sirven para editar / eliminar en memoria
  const [contactosLocales, setContactosLocales] = useState<ContactoEmergenciaProps[]>(() =>
    contactosIniciales.map((contacto, i) => aContactoLocal(contacto, -(i + 1), '')))
  const siguienteIdLocal = useRef(-(contactosIniciales.length + 1))

  useEffect(() => {
    if (UsarApiPOST) obtenerContactosEmergencia()
  }, [uid_location, UsarApiPOST])

  /** Sin API: guarda la lista y avisa al padre solo con los campos del formulario */
  const actualizarLocales = (contactos: ContactoEmergenciaProps[]) => {
    setContactosLocales(contactos)
    onChange?.(contactos.map(({ nombres, apellido_paterno, apellido_materno, telefono, email, observacion, id_cargo }) =>
      ({ nombres, apellido_paterno, apellido_materno, telefono, email, observacion, id_cargo })))
  }

  const guardar = async (datos: ContactoEmergenciaForm, labelCargo: string) => {
    const editando = contactoModal?.id
    if (UsarApiPOST) {
      return editando ? patchContactoEmergencia(editando, datos) : postContactoEmergencia(datos)
    }
    actualizarLocales(editando
      ? contactosLocales.map((contacto) => contacto.id === editando ? aContactoLocal(datos, editando, labelCargo) : contacto)
      : [...contactosLocales, aContactoLocal(datos, siguienteIdLocal.current--, labelCargo)])
    return true
  }

  const eliminar = async (id: number) => {
    if (UsarApiPOST) return deleteContactoEmergenciaxID(id)
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar el contacto?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (isConfirmed) actualizarLocales(contactosLocales.filter((contacto) => contacto.id !== id))
  }

  const columns: ColumnaSimple2<ContactoEmergenciaProps>[] = [
    {
      id: 'nombre',
      header: 'Nombres y apellidos',
      render: (row) => nombreCompleto(row),
      sortValue: (row) => nombreCompleto(row),
      searchValue: (row) => nombreCompleto(row),
    },
    {
      id: 'parentesco',
      header: 'Parentesco',
      render: (row) => parentesco(row) || <span className='opacity-50'>—</span>,
      sortValue: (row) => parentesco(row),
      searchValue: (row) => parentesco(row),
    },
    {
      id: 'telefono',
      header: 'Teléfono',
      render: (row) => row.telefono || <span className='opacity-50'>—</span>,
      searchValue: (row) => row.telefono ?? '',
    },
    {
      id: 'email',
      header: 'Email',
      render: (row) => row.email || <span className='opacity-50'>—</span>,
      searchValue: (row) => row.email ?? '',
    },
    {
      id: 'observacion',
      header: 'Observación',
      render: (row) => row.observacion,
      searchValue: (row) => row.observacion ?? '',
    },
    {
      id: 'acciones',
      header: '',
      render: (row) => (
        <div className='d-flex'>
          <span className='mx-2 cursor-pointer' title='Editar' onClick={() => setContactoModal(row)}>
            <IconCR name='edit' size={14}/>
          </span>
          <span className='mx-2 cursor-pointer' title='Eliminar' onClick={() => eliminar(row.id)}>
            <IconCR name='trash' size={14}/>
          </span>
        </div>
      ),
    },
  ]

  return (
    <div>
        <ButtonCR label={'Agregar contacto de emergencia'} icon={<IconCR name='plus' size={14}/>} onClick={() => setContactoModal(null)}/>
        <div className='mt-2'>
          <DataTableSimple2 mostrarBuscador={false} mostrarTamanoPagina={false} data={UsarApiPOST ? contactosEmergencia : contactosLocales} columns={columns} defaultPageSize={10} />
        </div>
        {/* Se monta al abrirse: el formulario arranca vacío o con el contacto a editar */}
        {contactoModal !== undefined && (
          <ModalContactoEmergencia contacto={contactoModal} onGuardar={guardar} onHide={() => setContactoModal(undefined)} />
        )}
    </div>
  )
}
