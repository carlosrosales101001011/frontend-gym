import React from "react";
import IconCR from "@/components/Icons/IconCR";
import { useQueryParams } from "@/hook/useQueryParams";
import { querys } from "@/types/parametros";
import { useAppSelector } from "@/stores/Store";

type PaginationProps = {
  totalPages?: number;
  total?:number;
  showItems?:number;
  isUrlPagination?: boolean;
  classNameTablePagination?:string;
};

const Paginacion: React.FC<PaginationProps> = ({ isUrlPagination=true, classNameTablePagination}) => {
  const { set, get } = useQueryParams();
  const page = Number(get(querys.page)||1)
  const show = Number(get(querys.show)||20)
  const { totalShow } = useAppSelector(e=>e.UI)
  const totalPages = Math.max(1, Math.ceil(totalShow / (show || 20)));
  const setPage = (n:number)=>{
    set({page: n})
  }
  const handleShowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e, 'onChange show');
    set({[querys.show]: e.target.value, page: null})
  }
  // console.log({totalPages, totalShow, itemsLen}, 'paginacion');
  
  const handleClick = (p: number, type: string) => {
    if (p < 1 || p > totalPages) return;
    if(p===1){
      set({page: null})
      console.log({type, p, page, show, offset: page*show}, 'pagin');
      return;
    }
    if(isUrlPagination){
      setPage(p)
      console.log({type, p, page, show, offset: page*show}, 'pagin');
      return;
    }
  };
  const getPages = () => {
  const pages: (number | string)[] = [];

  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const firstBlock = [1, 2, 3, 4];
  const lastBlock = [totalPages - 1, totalPages];

  const isInFirst = page <= 4;
  const isInLast = page >= totalPages - 1;

  pages.push(...firstBlock);

  if (!isInFirst && !isInLast) {
    pages.push("...");
    pages.push(page);
    pages.push("...");
  } else {
    pages.push("...");
  }

  pages.push(...lastBlock);

  return pages;
  };

  const pages = getPages();

  return (
    <div className={`${classNameTablePagination} tfoot-actual`}>
      <div
      className={`d-flex justify-content-between p-3`}
      >
          <div className="d-flex justify-content-center">
            <button
              onClick={() => handleClick(page - 1, "prev")}
              disabled={page === 1}
              style={{ border: "none" }}
            >
              <IconCR name="arrowLeft" />
            </button>

            {pages.map((p, i) =>
              p === "..." ? (
                <span key={i} style={{ padding: "2px 8px" }}>
                  ...
                </span>
              ) : (
                <button
                  key={`${p}-${i}`}
                  onClick={() => handleClick(p as number, "page")}
                  style={{
                    fontSize: '12px',
                    padding: "2px 8px",
                    background: p === page ? "#e9d5ff" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: p === page ? "bold" : "normal",
                  }}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => handleClick(page + 1, "next")}
              disabled={page === totalPages}
              style={{ border: "none" }}
            >
              <IconCR name="arrowRight" />
            </button>
          </div>
          <div>
            Mostrando{" "}
            <select value={show} onChange={handleShowChange}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>{" "}
            de {totalShow}
          </div>
      </div>
    </div>
  );
};

export default Paginacion;