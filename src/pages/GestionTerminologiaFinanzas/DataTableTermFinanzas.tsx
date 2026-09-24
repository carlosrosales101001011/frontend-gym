import { useEffect } from 'react'
import { useAppSelector, type RootState } from '@/stores/Store'
import { useTermFinanzasStore } from '@/pages/GestionTerminologiaFinanzas/useTermFinanzasStore'
import TreeViewCR, { type TreeNodeBase } from '@/components/TreeView/TreeViewCR'
import type { TermFinanzasProps } from '@/pages/GestionTerminologiaFinanzas/store/TermFinanzasSlice'


interface DataTableTermFinanzasProps {
  onOpenModalCustom: (id: number, parentId:number) => void
}
 
interface TreeNodeCR extends Omit<TermFinanzasProps, 'id'>, TreeNodeBase<TreeNodeCR> {
  children?: TreeNodeCR[];
}

export const DataTableTermFinanzas = ({ onOpenModalCustom }: DataTableTermFinanzasProps) => {
  const val = useAppSelector((state:RootState)=>state.TERM_FINANZA.termFinanzas)
    const { obtenerTermFinanzas } = useTermFinanzasStore()
    useEffect(() => {
        obtenerTermFinanzas()
    }, [])

  return (
    <div>
        <TreeViewCR<TreeNodeCR>
            data={val as TreeNodeCR[]}
            renderNode={(node, {level}) => (
                <div>
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    >
                    <span>
                        <span className='text-muted'>
                            CONCEPTO
                        </span>
                        <br/>
                        {level===0 && `${node.grupo?.nombre} > `}{node.concepto}
                    </span>
                    <span className='fw-bold'>
                        <span className='text-muted'>
                            TIPO DE MOVIMIENTO
                        </span>
                        <br/>
                            {node.grupo?.id_tipo_movimiento==5022 ? 
                            <span className='text-success bg-success-subtle p-2 rounded'>
                                INGRESO
                            </span>
                            : <span className='text-danger bg-danger-subtle p-2 rounded'>
                                EGRESO
                            </span>}
                        
                    </span>
                    <span>
                        <span className='text-muted'>
                            MONTO PROYECTADO
                        </span>
                        <br/>
                    {node.is_promediado ? 'Promediado' : node.monto_proyectado?.toLocaleString("es-PE")}
                    </span>
                    <span>
                        <span className='text-muted'>
                            FECHA DE INICIO
                        </span>
                        <br/>
                        {node.fecha_inicio}
                    </span>
                    <span>
                        <span className='text-muted'>
                            FECHA DE FIN
                        </span>
                        <br/>
                        {node.is_limit ? node.fecha_fin : 'Sin limite'}
                    </span>
                    </div>
                    
                    <div className='d-flex align-items-center gap-2'>
                        <button className='btn btn-sm btn-primary' onClick={()=>onOpenModalCustom(0, node.id)}>
                            + Agregar Subconcepto
                        </button>
                        <button className='btn btn-sm btn-primary'>
                            Editar
                        </button>
                    </div>
                    <div>
                    </div>
                </div>
                )}
        />
    </div>
  )
}
