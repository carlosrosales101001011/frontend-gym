import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGestionUsuariosStore } from "../hook/useGestionUsuariosStore";
import { PanelModulosPersonales } from "../components/PanelModulosPersonales";
import { PieStep } from "../components/PieStep";

type StepModulosPersonalesProps = {
  setStep: (step: number) => void;
  /** Se llama cuando el usuario quedó registrado (este es el último paso mientras "Entidades" está en pausa) */
  onGuardado: () => void;
}

/**
 * Paso 3: todos los módulos personales (id_tipo 2013), marcados por defecto; se pueden desmarcar.
 * Al guardar se registra el usuario con estos módulos (sin secciones) y las secciones elegidas en "Módulos".
 */
export const StepModulosPersonales = ({ setStep, onGuardado }: StepModulosPersonalesProps) => {
  const { modulosPersonales, idsModulosPersonales, idsSeccionAsignadas, obtenerModulosPersonales, asignarModulosPersonales, guardarUsuario } = useGestionUsuariosStore()
  const [guardando, setGuardando] = useState(false)
  const seleccionados = new Set(idsModulosPersonales)

  useEffect(() => {
    obtenerModulosPersonales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cambiar = (idModulo: number, marcado: boolean) =>
    asignarModulosPersonales(marcado ? [...seleccionados, idModulo] : [...seleccionados].filter((id) => id !== idModulo))

  /** Registra el usuario (sin permisos por entidad mientras ese paso está en pausa) */
  const guardar = async () => {
    if (idsSeccionAsignadas.length === 0 && seleccionados.size === 0) {
      await Swal.fire({ icon: 'warning', title: 'Sin módulos', text: 'Asigna al menos una sección o un módulo personal al usuario.' })
      return
    }
    setGuardando(true)
    const guardado = await guardarUsuario([], idsSeccionAsignadas, [...seleccionados])
    setGuardando(false)
    if (guardado) onGuardado()
  }

  return (
    <div>
      <PanelModulosPersonales modulos={modulosPersonales} seleccionados={seleccionados} onCambiar={cambiar} />
      <PieStep
        onAtras={() => setStep(1)}
        labelSiguiente={guardando ? 'Guardando...' : 'Guardar usuario'}
        onSiguiente={guardar}
        disabled={guardando}
      />
    </div>
  );
}
