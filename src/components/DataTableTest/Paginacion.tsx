import React from "react";
import { useQueryParams } from "@/hook/useQueryParams";
import { querys } from "@/types/parametros";
import { useAppSelector } from "@/stores/Store";
import { PaginacionCR } from "@/components/Paginacion/PaginacionCR";

type PaginationProps = {
  isUrlPagination?: boolean;
  classNameTablePagination?:string;
};

/** Paginación de DataTableTest: página y registros por página en la URL (?page=&show=), total en el store UI */
const Paginacion: React.FC<PaginationProps> = ({ isUrlPagination=true, classNameTablePagination}) => {
  const { set, get } = useQueryParams();
  const page = Number(get(querys.page)||1)
  const show = Number(get(querys.show)||20)
  const { totalShow } = useAppSelector(e=>e.UI)

  // La página 1 no va en la URL
  const cambiarPagina = (p: number) => {
    if (!isUrlPagination) return
    set({ page: p === 1 ? null : p })
  }

  return (
    <div className={classNameTablePagination}>
      <PaginacionCR
        pagina={page}
        porPagina={show}
        total={totalShow}
        onCambiarPagina={cambiarPagina}
        onCambiarPorPagina={(n) => set({ [querys.show]: n, page: null })}
      />
    </div>
  );
};

export default Paginacion;
