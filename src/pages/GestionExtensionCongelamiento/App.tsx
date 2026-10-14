import { useEffect } from "react"
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { useQueryParams } from "@/hook/useQueryParams"
import { querys } from "@/types/parametros"
import { useExtCongelamientoStore } from "@/pages/GestionExtensionCongelamiento/useExtCongelamientoStore"
import { DataTableExtCongelamientos } from "@/pages/GestionExtensionCongelamiento/DataTableExtCongelamientos"

/** Panel de solo lectura con todos los congelamientos registrados */
export const App = () => {
  const { searcher } = useExtCongelamientoStore()

    const { get } = useQueryParams();
    const querySearch = (get(querys.search)||'')
    const queryColumnas = get(querys.columnas)
    const page = Number(get(querys.page))
    const show = Number(get(querys.show))
    useEffect(() => {
      const ctrl = new AbortController();
      searcher(ctrl.signal).catch(e => {
        if (e.name !== 'CanceledError') console.error(e);
      });
      return () => ctrl.abort();
    }, [querySearch, queryColumnas, page, show])
  return (
    <div>
      <PageBreadCumb title={'Extensiones de congelamiento'}/>
          <div>
              <DataTableExtCongelamientos />
          </div>
    </div>
  )
}
