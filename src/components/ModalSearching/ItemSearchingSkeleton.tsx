// Anchos distintos por fila para que las tarjetas de carga no se vean idénticas
const ANCHOS_NOMBRE = ['55%', '40%', '65%', '48%', '60%', '45%']
const ANCHOS_DATOS = ['75%', '60%', '80%', '70%', '65%', '78%']

type ItemSearchingSkeletonProps = {
  /** Posición en la lista (cambia el ancho de las barras) */
  indice?: number
  /** Igual que ItemSearching: sin la línea de DNI/email/teléfono */
  soloNombre?: boolean
}

/** Tarjeta de carga con la forma de ItemSearching: avatar, nombre y datos (estilos en _Skeleton.scss) */
export const ItemSearchingSkeleton = ({ indice = 0, soloNombre = false }: ItemSearchingSkeletonProps) => (
  <div className="d-flex align-items-center w-100 p-2" aria-hidden="true">
    <span className="skeleton-cr skeleton-cr--circulo" style={{ width: 40, height: 40 }} />
    <div className="mx-2 flex-grow-1">
      <span className="skeleton-cr" style={{ width: ANCHOS_NOMBRE[indice % ANCHOS_NOMBRE.length], height: 13 }} />
      {!soloNombre && (
        <span className="skeleton-cr mt-2" style={{ width: ANCHOS_DATOS[indice % ANCHOS_DATOS.length], height: 10 }} />
      )}
    </div>
    {!soloNombre && <span className="skeleton-cr" style={{ width: 28, height: 10 }} />}
  </div>
)
