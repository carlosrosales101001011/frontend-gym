import React from "react";
import { useQueryParams } from "@/hook/useQueryParams";
import { querys } from "@/types/parametros";
import { PaginacionCR } from "@/components/Paginacion/PaginacionCR";

type PaginationProps = {
  totalPages?: number;
  total?:number;
  showItems?:number;
  isUrlPagination?: boolean;
};

/** Paginación de DataTableCR: página y registros por página en la URL (?page=&show=) */
const Paginacion: React.FC<PaginationProps> = ({ totalPages, total=0, isUrlPagination=true}) => {
  const { set, get } = useQueryParams();
  const page = Number(get(querys.page)||1)
  const show = Number(get(querys.show)||10)

  // La página 1 no va en la URL
  const cambiarPagina = (p: number) => {
    if (!isUrlPagination) return
    set({ page: p === 1 ? null : p })
  }

  return (
    <PaginacionCR
      pagina={page}
      porPagina={show}
      total={total}
      totalPaginas={totalPages}
      onCambiarPagina={cambiarPagina}
      onCambiarPorPagina={(n) => set({ show: n, page: null })}
    />
  );
};

export default Paginacion;
