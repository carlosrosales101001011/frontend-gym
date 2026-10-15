import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { useEffect } from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR';
import { DetallePagosApp } from './DetallePagos/DetallePagosApp';
import { useVentasStore } from './hook/useVentasStore';
import { Loading } from '@/components/Loading/Loading';

export const App = () => {
    const { onRegistrarVenta, loadingVenta, asesorSeleccionado, asignarAsesorDeSesion } = useVentasStore()
    // Asesor por defecto: el colaborador del usuario logueado, al entrar y tras registrar (la venta se limpia).
    // Se puede cambiar en el buscador de "Asesor / Vendedor"
    useEffect(() => {
        if (!asesorSeleccionado) asignarAsesorDeSesion()
    }, [asesorSeleccionado])

    const onSubmit = async ()=>{
        try {
            // const dataVenta = 
            await onRegistrarVenta()
            // if (dataVenta) {
            //     setActiveStep(0)
            // }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="page-with-sticky-footer">
          <Loading show={loadingVenta}/>
          <PageBreadCumb title='Nueva venta'/>
          <div className="h-100 overflow-y-auto overflow-x-hidden">
            <DetallePagosApp/>
        </div>
                <ButtonCR label={'Registrar venta'} onClick={()=>onSubmit()}/>
        </div>
    );
}
