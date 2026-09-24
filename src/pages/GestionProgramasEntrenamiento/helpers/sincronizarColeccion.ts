// Helper local a GestionProgramasEntrenamiento: las 4 colecciones hijas del programa
// (categorias, sucursales, planes, horarios) se guardan comparando lo que ya existia en
// el backend ("originales") contra lo que hay ahora en el form ("actuales"):
//   - sin id en "actuales"            -> crear
//   - con id en "actuales"            -> actualizar (si se provee la funcion)
//   - con id en "originales" que ya no esta en "actuales" -> eliminar
type ConId = { id?: number };

type AccionesSincronizacion<T extends ConId> = {
  crear: (item: T) => Promise<unknown>,
  actualizar?: (id: number, item: T) => Promise<unknown>,
  eliminar: (id: number) => Promise<unknown>,
}

export const sincronizarColeccion = async <T extends ConId>(
  originales: T[],
  actuales: T[],
  { crear, actualizar, eliminar }: AccionesSincronizacion<T>
) => {
  const idsActuales = new Set(actuales.filter((item) => item.id).map((item) => item.id));
  const aEliminar = originales.filter((item) => item.id && !idsActuales.has(item.id));
  const aCrear = actuales.filter((item) => !item.id);
  const aActualizar = actuales.filter((item) => item.id);

  await Promise.all([
    ...aEliminar.map((item) => eliminar(item.id!)),
    ...aCrear.map((item) => crear(item)),
    ...(actualizar ? aActualizar.map((item) => actualizar(item.id!, item)) : []),
  ]);
}
