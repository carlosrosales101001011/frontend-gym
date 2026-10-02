import { useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import { MultiStateCheckboxCR } from '@/components/MultiStateCheckBox/MultiStateCheckboxCR'
import IconCR from '@/components/Icons/IconCR'
import { useForm } from '@/hook/useForm'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useGestionUsuariosStore } from '../hook/useGestionUsuariosStore'
import type { PermisoEntidadProps } from '../store/usuariosSlice'
import { ACCIONES_CRUD, ESTADO_PERMISO, accionesOtorgables, armarPermisosIniciales, campoEstado, estadoComun, puedeOtorgar, type AccionCrud } from '../helpers/permisosEntidad'
import { PieStep } from '../components/PieStep'

type StepEntidadesProps = {
  setStep: (step: number) => void
  /** Se llama cuando el usuario quedó registrado */
  onGuardado: () => void
}

/** "Todos" es un campo más del form solo para el control; no se guarda */
type FilaPermiso = PermisoEntidadProps & { id_estado_ALL: number }
type FormPermisos = { permisos: FilaPermiso[] }

/** Estados en el orden en que cicla cada control */
const ESTADOS = [
  { value: ESTADO_PERMISO.PERMISO, icon: <IconCR size={13} name="question" />, label: 'Permiso', bgHex: '#FFCB00' },
  { value: ESTADO_PERMISO.AUTORIZADO, icon: <IconCR size={13} name="check" />, label: 'Autorizado', bgHex: 'green' },
  { value: ESTADO_PERMISO.DENEGADO, icon: <IconCR size={13} name="times" />, label: 'Denegado', bgHex: 'red' },
]

/**
 * Paso 3: permisos CRUD del nuevo usuario sobre las entidades de las secciones asignadas.
 * Solo se puede otorgar lo que quien registra tiene autorizado; lo demás queda "Denegado" y bloqueado.
 */
export const StepEntidades = ({ setStep, onGuardado }: StepEntidadesProps) => {
  const { modulosDisponibles, idsSeccionAsignadas, permisosCreador, creadorEsSuperUsuario, guardarUsuario } = useGestionUsuariosStore()
  const { cargar: cargarEntidades, data: opcionesEntidades } = useTerminologiaPersona('entidadSistema')
  const { register, setValue, watch, reset, handleSubmit } = useForm<FormPermisos>({ defaultValues: { permisos: [] } })
  const [guardando, setGuardando] = useState(false)
  const permisos = (watch('permisos') ?? []) as FilaPermiso[]

  useEffect(() => {
    cargarEntidades()
  }, [])

  // Entidades de las secciones asignadas, sin repetir (varias secciones pueden compartir una entidad)
  const idsEntidad = useMemo(() => [...new Set(
    modulosDisponibles
      .flatMap((modulo) => modulo.secciones)
      .filter((seccion) => idsSeccionAsignadas.includes(seccion.id_seccion))
      .flatMap((seccion) => seccion.ids_entidad)
  )], [modulosDisponibles, idsSeccionAsignadas])

  const creadorDe = (idEntidad: number) => permisosCreador.find((permiso) => permiso.id_entidad === idEntidad)
  /** Acciones que quien registra puede otorgar en una entidad (un super usuario, todas) */
  const otorgablesDe = (idEntidad: number) => accionesOtorgables(creadorDe(idEntidad), creadorEsSuperUsuario)

  useEffect(() => {
    const labelEntidad = (id: number) => opcionesEntidades.find((opcion) => opcion.value === id)?.label ?? `Entidad ${id}`
    reset({
      permisos: armarPermisosIniciales(idsEntidad, permisosCreador, labelEntidad, creadorEsSuperUsuario)
        .map((permiso) => ({ ...permiso, id_estado_ALL: estadoComun(permiso, otorgablesDe(permiso.id_entidad)) })),
    })
  }, [idsEntidad, permisosCreador, creadorEsSuperUsuario, opcionesEntidades])

  /** Cambia una acción y recalcula "Todos" */
  const onCambiarAccion = (index: number, accion: AccionCrud, valor: number) => {
    setValue(`permisos.${index}.${campoEstado(accion)}`, valor)
    const fila = { ...permisos[index], [campoEstado(accion)]: valor }
    setValue(`permisos.${index}.id_estado_ALL`, estadoComun(fila, otorgablesDe(fila.id_entidad)))
  }

  /** "Todos": aplica el estado a las acciones que se pueden otorgar */
  const onCambiarTodos = (index: number, valor: number) => {
    setValue(`permisos.${index}.id_estado_ALL`, valor)
    otorgablesDe(permisos[index].id_entidad)
      .forEach((accion) => setValue(`permisos.${index}.${campoEstado(accion)}`, valor))
  }

  const onGuardar = handleSubmit(async (data) => {
    setGuardando(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- "Todos" solo es para el control
    const guardado = await guardarUsuario(data.permisos.map(({ id_estado_ALL, ...permiso }) => permiso))
    setGuardando(false)
    if (guardado) onGuardado()
  })

  return (
    <div>
      {permisos.length === 0 ? (
        <p className="small opacity-75 mb-0">Las secciones asignadas no tienen entidades con permisos que configurar.</p>
      ) : (
        <Table responsive className="mb-0 align-middle">
          <thead>
            <tr>
              <th className="thead-actual">Entidad</th>
              {ACCIONES_CRUD.map(({ key, label }) => <th key={key} className="thead-actual text-center">{label}</th>)}
              <th className="thead-actual text-center">Todos</th>
            </tr>
          </thead>
          <tbody>
            {permisos.map((permiso, index) => {
              const creador = creadorDe(permiso.id_entidad)
              const otorgables = otorgablesDe(permiso.id_entidad)
              return (
                <tr key={permiso.id_entidad}>
                  <td className="tbody-actual">{permiso.label_entidad}</td>
                  {ACCIONES_CRUD.map(({ key }) => (
                    <td key={key} className="tbody-actual">
                      <div className="d-flex justify-content-center">
                        <MultiStateCheckboxCR
                          registration={register(`permisos.${index}.${campoEstado(key)}`, { setValueAs: Number })}
                          value={permiso[campoEstado(key)]}
                          disabled={!puedeOtorgar(creador, key, creadorEsSuperUsuario)}
                          onValueChange={(valor) => onCambiarAccion(index, key, Number(valor))}
                          states={ESTADOS}
                        />
                      </div>
                    </td>
                  ))}
                  <td className="tbody-actual">
                    <div className="d-flex justify-content-center">
                      <MultiStateCheckboxCR
                        registration={register(`permisos.${index}.id_estado_ALL`, { setValueAs: Number })}
                        value={permiso.id_estado_ALL}
                        disabled={otorgables.length === 0}
                        onValueChange={(valor) => onCambiarTodos(index, Number(valor))}
                        states={ESTADOS}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}
      <PieStep
        onAtras={() => setStep(1)}
        labelSiguiente={guardando ? 'Guardando...' : 'Guardar usuario'}
        onSiguiente={onGuardar}
        disabled={guardando}
      />
    </div>
  )
}
