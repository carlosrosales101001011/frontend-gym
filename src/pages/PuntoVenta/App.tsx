import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import React from 'react'
import { ButtonCR } from '@/components/Button/ButtonCR';
import { DetallePagosApp } from './DetallePagos/DetallePagosApp';
import { useVentasStore } from './hook/useVentasStore';
import { Loading } from '@/components/Loading/Loading';

export const App = () => {
    const { onRegistrarVenta, loadingVenta } = useVentasStore()

    // const [activeStep, setActiveStep] =
    //     useState(0);

    // const steps = [
    //     {
    //         title: "Membresías, productos y pago",
    //     },
    // ];
    // const onStepLast = ()=>{
    //     setActiveStep(activeStep+1)
    // }
    // const onStepBefore = ()=>{
    //     setActiveStep(activeStep-1)
    // }
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
