import { DataTableSimple } from '@/components/DataTableSimple/DataTableSimple';
import IconCR from '@/components/Icons/IconCR';
import type { TerminologiaProps } from '@/pages/GestionTerminologias/store/terminologiasSlice';

type Props ={
  data: TerminologiaProps[];
  onOpenModalCustom: (id: number) => void;
}
export const DataTableView = ({data, onOpenModalCustom}:Props) => {
    const columns = [
        {header: 'Id',id: 0,  render: (row:TerminologiaProps)=>{
            return (
                <>
                {row.id}
                </>
            )
        }},
        {header: 'Valores',id: 1,  render: (row:TerminologiaProps)=>{
            return (
                <>
                {row.valor}
                </>
            )
        }},
        {header: '',
            id: 2, render: (row:TerminologiaProps)=>{
            return (
                    <div className="d-flex">
                        <div onClick={()=>onEdit(row.id)}  style={{width: '28px', height: '28px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}} className="cursor-pointer me-2 bg-primary">
                            <IconCR name="edit" size={14}/>
                        </div>
                        <div onClick={()=>onDelete(row.id)} className='bg-danger cursor-pointer' style={{width: '28px', height: '28px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
                            <IconCR name="delete" size={14}/>
                        </div>
                    </div>
            )
        }},
    ]
    const onEdit = (id:number)=>{
        onOpenModalCustom(id)
    }
    const onDelete = (id:number)=>{
        console.log({id});

    }
  return (
    <div>
            <DataTableSimple data={data} columns={columns}/>
    </div>
  )
}
