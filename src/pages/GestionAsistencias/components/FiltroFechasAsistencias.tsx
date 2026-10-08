import { useEffect, useState } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
import { formatDate } from '@/helpers/FormatDate'

/**
 * Filtro de asistencias por fecha de registro (inicio y fin, ambos inclusive). Al pulsar "Buscar" las fechas
 * quedan en la URL (?fecha_inicio=&fecha_fin=) y la tabla se vuelve a pedir con ellas (ver useCrudhook).
 * Por defecto (sin fechas en la URL): hoy en las dos.
 */
export const FiltroFechasAsistencias = () => {
  const { get, set } = useQueryParams()
  const hoy = formatDate(new Date(), 'yyyy-mm-dd', 'yyyy-mm-dd')
  const sinFechasEnUrl = !get(querys.fechaInicio) && !get(querys.fechaFin)
  // Lo escrito; se aplica recién con "Buscar"
  const [fechaInicio, setFechaInicio] = useState(sinFechasEnUrl ? hoy : get(querys.fechaInicio))
  const [fechaFin, setFechaFin] = useState(sinFechasEnUrl ? hoy : get(querys.fechaFin))

  // Al entrar sin fechas en la URL se aplica el día de hoy (la tabla espera a esto, ver App)
  useEffect(() => {
    if (sinFechasEnUrl) set({ [querys.fechaInicio]: hoy, [querys.fechaFin]: hoy })
  }, [])
  const rangoInvalido = !!fechaInicio && !!fechaFin && fechaInicio > fechaFin

  const buscar = () => {
    if (rangoInvalido) return
    // Vuelve a la primera página con el rango nuevo
    set({ [querys.fechaInicio]: fechaInicio, [querys.fechaFin]: fechaFin, [querys.page]: null })
  }

  return (
    <form
      className="d-flex flex-wrap align-items-start gap-2 mb-2"
      onSubmit={(e) => { e.preventDefault(); buscar() }}
    >
      <div style={{ width: 200 }}>
        <InputCR type="date" label="Fecha de inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
      </div>
      <div style={{ width: 200 }}>
        <InputCR
          type="date"
          label="Fecha de fin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          messageErrors={rangoInvalido ? 'La fecha de fin es anterior a la de inicio' : ''}
        />
      </div>
      <ButtonCR type="submit" label="Buscar" icon={<IconCR name="search" size={14} className="" />} disabled={rangoInvalido} className="mt-2" />
    </form>
  )
}
