import { useEffect, useMemo, useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { ModalCustomAvatar } from '@/components/ModalCustomAvatar/ModalCustomAvatar'
import { AvatarFoto } from './AvatarFoto'
import type { AjusteFoto } from './encuadreFoto'

type SelectorFotoProps = {
  /** Foto guardada (al editar); se muestra mientras no se elija otra */
  src?: string | null
  /** Imagen elegida y todavía sin guardar */
  archivo: File | null
  /** Encuadre con el que se muestra la foto (dónde está el círculo) */
  ajuste?: AjusteFoto | null
  /** Imagen elegida en el modal de la foto */
  onChange: (archivo: File) => void
  /** Encuadre elegido en "Ajustar foto" (quien lo usa lo guarda al guardar el formulario) */
  onAjustar: (ajuste: AjusteFoto) => void
  /** "Eliminar foto" en el modal: quien lo usa decide si quita la elegida y/o la guardada */
  onEliminar: () => void
  tamano?: number
}

/**
 * Foto de una persona en un formulario: avatar (foto o silueta) y debajo "Agregar foto" ("Cambiar foto"
 * si ya hay una). Click en el avatar o en el botón abre ModalCustomAvatar para verla, elegir otra,
 * ajustarla o eliminarla. Solo elige el archivo: quien lo usa lo sube al guardar.
 */
export const SelectorFoto = ({ src, archivo, ajuste, onChange, onAjustar, onEliminar, tamano = 140 }: SelectorFotoProps) => {
  const [showModal, setShowModal] = useState(false)
  // Vista previa de la imagen elegida (se libera al cambiarla o al desmontar)
  const previa = useMemo(() => (archivo ? URL.createObjectURL(archivo) : null), [archivo])
  useEffect(() => () => {
    if (previa) URL.revokeObjectURL(previa)
  }, [previa])

  const foto = previa ?? src ?? undefined
  const abrir = () => setShowModal(true)

  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <AvatarFoto src={foto} ajuste={ajuste} tamano={tamano} onClick={abrir} />
      <ButtonCR label={foto ? 'Cambiar foto' : 'Agregar foto'} variant="link" onClick={abrir} />
      <ModalCustomAvatar
        show={showModal}
        onHide={() => setShowModal(false)}
        src={foto}
        ajuste={ajuste}
        onAjustar={(nuevo) => {
          onAjustar(nuevo)
          setShowModal(false)
        }}
        onActualizar={(elegido) => {
          onChange(elegido)
          setShowModal(false)
        }}
        onEliminar={() => {
          onEliminar()
          setShowModal(false)
        }}
      />
    </div>
  )
}
