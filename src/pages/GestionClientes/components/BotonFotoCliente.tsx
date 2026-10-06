import { useRef, type ChangeEvent } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { useFotoPerfil } from '@/pages/perfil/hook/useFotoPerfil'
import type { ClienteProps } from '../store/clientesSlice'

type BotonFotoClienteProps = {
  cliente: ClienteProps
  /** Se llama cuando la foto quedó subida (ej. para refrescar la tabla) */
  onSubida: () => void
}

/**
 * Subida rápida de la foto desde la tabla: el botón abre el selector de archivos y la imagen elegida
 * se sube directo (sin ajustar). "Actualizar foto" si ya tiene una, "Subir foto" si no.
 */
export const BotonFotoCliente = ({ cliente, onSubida }: BotonFotoClienteProps) => {
  const { subiendo, subirFoto } = useFotoPerfil()
  const inputRef = useRef<HTMLInputElement>(null)
  const tieneFoto = !!cliente.url_avatar_ultimo

  const onElegir = async (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir la misma imagen
    if (!archivo) return
    if (await subirFoto({ id: cliente.id, uid_avatar: cliente.uid_avatar }, archivo)) onSubida()
  }

  return (
    <>
      <ButtonCR
        label={subiendo ? 'Subiendo...' : tieneFoto ? 'Actualizar foto' : 'Subir foto'}
        icon={<IconCR name="subir" size={14} className="" />}
        variant="outline-primary"
        className="btn-sm text-nowrap"
        disabled={subiendo}
        onClick={() => inputRef.current?.click()}
      />
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onElegir} />
    </>
  )
}
