import { useEffect, useState } from "react";
import ProgramCard from "@/pages/GestionProgramasEntrenamiento/ProgramCard";
import { useAppSelector } from "@/stores/Store";
import { getBlobUrl } from "@/helpers/blobUrl";
import { useProgramaEntrenamientoStore } from "@/pages/GestionProgramasEntrenamiento/useProgramaEntrenamientoStore";

type EstadisticasPrograma = {
  categoria?: string,
  cantidadPlanes: number,
  cantidadHorarios: number,
  cantidadInstructores: number,
}

type props = {
  onOpenModalCustom: (id: number) => void,
}

export const DataCardProgramas = ({ onOpenModalCustom }: props) => {
  const programas = useAppSelector((state) => state.PROGRAMA.programas)
  const [estadisticas, setEstadisticas] = useState<Record<number, EstadisticasPrograma>>({})
  const { obtenerListaProgramas, listarCategoriasPrograma, listarPlanesPrograma, listarHorariosPrograma, eliminarPrograma } = useProgramaEntrenamientoStore()

  useEffect(() => {
    obtenerListaProgramas()
  }, [])

  // Por cada programa listado se traen sus categorias/planes/horarios solo para mostrar
  // los contadores de la tarjeta (el detalle completo se carga recien al editar, ver ModalCustomProgramas)
  useEffect(() => {
    if (programas.length === 0) return
    const cargarEstadisticas = async () => {
      const entradas = await Promise.all(programas.map(async (programa) => {
        const [{ data: categorias }, { data: planes }, { data: horarios }] = await Promise.all([
          listarCategoriasPrograma(programa.id),
          listarPlanesPrograma(programa.id),
          listarHorariosPrograma(programa.id),
        ])
        const estadistica: EstadisticasPrograma = {
          categoria: categorias.lista[0]?.label_categoria,
          cantidadPlanes: planes.total,
          cantidadHorarios: horarios.total,
          cantidadInstructores: new Set(horarios.lista.map((horario) => horario.id_empl)).size,
        }
        return [programa.id, estadistica] as const
      }))
      setEstadisticas(Object.fromEntries(entradas))
    }
    cargarEstadisticas()
  }, [programas])

  const onDelete = async (id: number) => {
    await eliminarPrograma(id)
  }

  if (programas.length === 0) {
    return <div className="program-grid__vacio">Aún no hay programas registrados</div>
  }

  return (
    <div className="program-grid">
      {programas.map((programa) => (
        <ProgramCard
          key={programa.id}
          id={programa.id}
          nombre={programa.nombre}
          descripcion={programa.descripcion}
          categoria={estadisticas[programa.id]?.categoria}
          imagen={getBlobUrl(programa.url_avatar) ?? ''}
          estado={!!programa.estado}
          cantidadPlanes={estadisticas[programa.id]?.cantidadPlanes ?? 0}
          cantidadHorarios={estadisticas[programa.id]?.cantidadHorarios ?? 0}
          cantidadInstructores={estadisticas[programa.id]?.cantidadInstructores ?? 0}
          onClick={onOpenModalCustom}
          onEdit={onOpenModalCustom}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
