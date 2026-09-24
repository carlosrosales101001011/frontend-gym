import React, { useState } from "react";

interface Detalle {
  id: number;
  id_entidad:number;
  id_estado_CREATE:number;
  id_estado_READ:number;
  id_estado_UPDATE:number;
  id_estado_DELETE:number;
}

interface Venta {
  id: number;
  seccion: string;
  total: number;
  detalles: Detalle[];
}

const data: Venta[] = [
  {
    id: 1,
    seccion: "Flujo de caja",
    total: 2,
    detalles: [
      { id: 1, id_entidad: 1, id_estado_CREATE: 1, id_estado_READ: 1, id_estado_UPDATE: 2, id_estado_DELETE: 0 },
      { id: 2, id_entidad: 2, id_estado_CREATE: 1, id_estado_READ: 1, id_estado_UPDATE: 1, id_estado_DELETE: 0 },
    ],
  },
  {
    id: 2,
    seccion: "Gasto",
    total: 1,
    detalles: [
      { id: 3, id_entidad: 3, id_estado_CREATE: 1, id_estado_READ: 1, id_estado_UPDATE: 4, id_estado_DELETE: 0 },
    ],
  },
];

export default function DataTableSeccion() {
  const [openRow, setOpenRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setOpenRow(openRow === id ? null : id);
  };

  return (
    <div className="container mt-4">

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">

          {/* TABLA PRINCIPAL */}
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Seccion</th>
              <th>Entidades</th>
            </tr>
          </thead>

          <tbody>
            {data.map((venta) => (
              <React.Fragment key={venta.id}>

                {/* FILA PRINCIPAL */}
                <tr>
                  <td className="text-center">
                      <span
                        onClick={() => toggleRow(venta.id)}
                        style={{
                          cursor: "pointer",
                          display: "inline-block",
                          transition: "transform 0.2s",
                          transform:
                            openRow === venta.id
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                        }}
                      >
                        ▶
                      </span>
                  </td>
                  <td>{venta.seccion}</td>
                  <td>{venta.total}</td>
                </tr>

                {/* TABLA HIJA */}
                {openRow === venta.id && (
                  <tr>
                    <td colSpan={5} className="p-3 bg-primary">

                      <div className="border rounded p-3 bg-white">
                        <table className="table table-sm table-striped table-bordered mb-0">
                          <thead className="table-primary">
                            <tr>
                              <th>ID</th>
                              <th>Entidad</th>
                              <th>Crear</th>
                              <th>Leer</th>
                              <th>Actualizar</th>
                              <th>Eliminar</th>
                            </tr>
                          </thead>

                          <tbody>
                            {venta.detalles.map((detalle) => (
                              <tr key={detalle.id}>
                                <td>{detalle.id}</td>
                                <td>{detalle.id_entidad}</td>
                                <td>{detalle.id_estado_CREATE}</td>
                                <td>{detalle.id_estado_READ}</td>
                                <td>{detalle.id_estado_UPDATE}</td>
                                <td>{detalle.id_estado_DELETE}</td>
                              </tr>
                            ))}
                          </tbody>

                        </table>

                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}