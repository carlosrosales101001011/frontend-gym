import { useEffect, useMemo } from 'react'
import { MultiStateCheckboxCR } from '@/components/MultiStateCheckBox/MultiStateCheckboxCR'
import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
import { useForm } from '@/hook/useForm'
import IconCR from '@/components/Icons/IconCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useGestionStore } from '@/pages/GestionUsuarios/useGestionUsuariosStore'

type Props = {
  setStep: (step: number) => void
}

/* ─── Config de columnas ──────────────────────────────────────────────────── */

const CRUD = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT'] as const
type CrudKey = (typeof CRUD)[number]

const COLUMNAS: { key: CrudKey; label: string }[] = [
  { key: 'CREATE', label: 'Crear' },
  { key: 'READ', label: 'Leer' },
  { key: 'UPDATE', label: 'Editar' },
  { key: 'DELETE', label: 'Eliminar' },
  { key: 'EXPORT', label: 'Exportar' },
  { key: 'IMPORT', label: 'Importar' },
]

const valorEstadoCrud = [
  { valor: 2016, label: 'Permiso' },
  { valor: 2014, label: 'Autorizado' },
  { valor: 2015, label: 'Denegado' },
]

const ESTADO_POR_DEFECTO = valorEstadoCrud[0].valor

/* ─── Tipos del form: una fila por entidad ────────────────────────────────── */

export type PermisoRow = {
  id_entidad: number
  id_estado_CREATE: number
  id_estado_READ: number
  id_estado_UPDATE: number
  id_estado_DELETE: number
  id_estado_EXPORT: number
  id_estado_IMPORT: number
  id_estado_ALL: number
}
type FormValues = { permisos: PermisoRow[] }

type CrudPath = `permisos.${number}.id_estado_${CrudKey}`
type AllPath = `permisos.${number}.id_estado_ALL`

const crudPath = (i: number, k: CrudKey): CrudPath => `permisos.${i}.id_estado_${k}`
const allPath = (i: number): AllPath => `permisos.${i}.id_estado_ALL`

/* ─── Componente ──────────────────────────────────────────────────────────── */

export const StepEntidades = ({ setStep }: Props) => {
  const { postUsuario } = useGestionStore()
  const { entidades:entidadesInitial, user} = useSelector((state: RootState) => state.USER)
  const { register, setValue, watch, reset, formState, handleSubmit } =
    useForm<FormValues>({ defaultValues: { permisos: [] } })
const entidades = useMemo(
  () => [
    ...new Map(
      (entidadesInitial ?? [])
        .flatMap((s) => s?.entities ?? [])
        .map((item) => [item.id, item] as const)
    ).values(),
  ],
  [entidadesInitial]
)

  // Fuente de verdad para pintar los controles (modo controlado).
  const permisos = (watch('permisos') ?? []) as PermisoRow[]

  // Cuando llegan las entidades, se arma una fila del form por cada una.
  useEffect(() => {
    if (!entidades.length) return

    reset({
      permisos: entidades.map((entidad) => ({
        id_entidad: entidad.id,
        id_entidad_real: entidad.id_entidad,
        id_estado_CREATE: ESTADO_POR_DEFECTO,
        id_estado_READ: ESTADO_POR_DEFECTO,
        id_estado_UPDATE: ESTADO_POR_DEFECTO,
        id_estado_DELETE: ESTADO_POR_DEFECTO,
        id_estado_EXPORT: ESTADO_POR_DEFECTO,
        id_estado_IMPORT: ESTADO_POR_DEFECTO,
        id_estado_ALL: ESTADO_POR_DEFECTO,
      })),
    })
  }, [entidades])

  const states = [
    {
      value: valorEstadoCrud[0].valor,
      icon: <IconCR size={13} name="question" />,
      label: valorEstadoCrud[0].label,
      bgHex: '#FFCB00',
    },
    {
      value: valorEstadoCrud[1].valor,
      icon: <IconCR size={13} name="check" />,
      label: valorEstadoCrud[1].label,
      bgHex: 'green',
    },
    {
      value: valorEstadoCrud[2].valor,
      icon: <IconCR size={13} name="times" />,
      label: valorEstadoCrud[2].label,
      bgHex: 'red',
    },
  ]

  /** Cambio de una celda CRUD: se guarda y, si las 6 quedan iguales, actualiza "Todos". */
  const onCambiarCrud = (index: number, key: CrudKey, valor: number) => {
    setValue(crudPath(index, key), valor)

    const fila = permisos[index]
    const todasIguales = CRUD.every((k) =>
      k === key ? true : fila?.[`id_estado_${k}`] === valor
    )
    if (todasIguales) setValue(allPath(index), valor)
  }

  /** Cambio de "Todos": propaga el mismo estado a las 6 columnas de esa fila. */
  const onCambiarTodos = (index: number, valor: number) => {
    setValue(allPath(index), valor)
    CRUD.forEach((k) => setValue(crudPath(index, k), valor))
  }

  const onLastStep = handleSubmit((data) => {
    const modulos = entidadesInitial.filter(
        (item, index, self) =>
          index === self.findIndex((x) => x?.id_modulo === item?.id_modulo)
      ).map(item=>{
        return {
          id_modulo: item?.id_modulo
        }
      });
    const seccionesxModulo = entidadesInitial.map(item=>{
      return {
        id_modulouser: item?.id_modulo,
        id_seccion: item?.id,
      }
    })
    postUsuario({...user, fecha_creacion: new Date()}, modulos, seccionesxModulo, data.permisos)
  })
  const onBeforeStep = handleSubmit((data) => {
    console.log('permisos', data.permisos)
    setStep(1)
  })

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Entidad</th>
            {COLUMNAS.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            <th>Todos</th>
          </tr>
        </thead>
        <tbody>
          {entidades.map((entidad, index) => (
            <tr key={entidad.id}>
              <td>{entidad.entidad.valor}</td>

              {COLUMNAS.map(({ key }) => {
                const entidadEstados = entidad?.[`id_estado_${key}`] || ESTADO_POR_DEFECTO
                return(
                  <td key={key}>
                    <div className="m-auto">
                      <MultiStateCheckboxCR
                        registration={register(crudPath(index, key), {
                          setValueAs: Number,
                        })}
                        value={entidadEstados === 2015 || entidadEstados === 2016 ? 2015 : permisos[index]?.[`id_estado_${key}`] ?? ESTADO_POR_DEFECTO}
                        disabled={entidadEstados === 2015 || entidadEstados === 2016}
                        onValueChange={(v) => onCambiarCrud(index, key, Number(v))}
                        errorMessage={formState.errors[crudPath(index, key)]?.message}
                        states={states}
                      />
                    </div>
                  </td>
                )
              }
              )}

              <td>
                <div className="m-auto">
                  <MultiStateCheckboxCR
                    registration={register(allPath(index), { setValueAs: Number })}
                    value={permisos[index]?.id_estado_ALL ?? ESTADO_POR_DEFECTO}
                    onValueChange={(v) => onCambiarTodos(index, Number(v))}
                    errorMessage={formState.errors[allPath(index)]?.message}
                    states={states}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className='float-end'>
        <ButtonCR label={'Aceptar'} onClick={onLastStep}/>
      </div>
      <div className='float-end'>
        <ButtonCR label={'Atras'} variant='link' onClick={onBeforeStep}/>
      </div>
    </div>
  )
}