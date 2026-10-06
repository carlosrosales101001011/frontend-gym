import IconCR from '@/components/Icons/IconCR'

/** Aviso de las pestañas que usan los datos del colaborador cuando el usuario no tiene uno vinculado */
export const SinColaborador = () => (
  <div className="m-3 p-3 rounded border d-flex align-items-center gap-3">
    <IconCR name="user" size={22} className="" />
    <div>
      <div className="fw-semibold">Este usuario no tiene colaborador vinculado</div>
      <div className="small opacity-75">Vincúlalo en la pestaña "Datos Sistema" (campo Empleado).</div>
    </div>
  </div>
)
