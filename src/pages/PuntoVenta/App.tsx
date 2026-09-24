import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import React, { useState } from 'react'
import StepperCR, { type StepperItem } from './components/StepperCR';
import { DetalleVentaApp } from './DetalleVenta/DetalleVentaApp';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { DetalleItemsVentaApp } from './DetalleItemsVenta/DetalleItemsVentaApp';
import { DetallePagosApp } from './DetallePagos/DetallePagosApp';
import { useVentasStore } from './hook/useVentasStore';
import { Loading } from '@/components/Loading/Loading';

export const App = () => {
    const { onRegistrarVenta, loadingVenta } = useVentasStore()

    const [activeStep, setActiveStep] =
        useState(0);

    const steps: StepperItem[] = [
        {
            id: "detail",
            title: "Detalle de la venta",
            subtitle: "Asesor, cliente y datos generales",
        },
        {
            id: "items",
            title: "Agregar ítems",
            subtitle: "Membresías y productos",
        },
        {
            id: "payment",
            title: "Pago",
            subtitle: "Forma de pago y monto",
        },
        // {
        //     id: "confirmation",
        //     title: "Confirmación",
        //     subtitle: "Resumen y registro",
        // },
    ];
    const onStepLast = ()=>{
        setActiveStep(activeStep+1)
    }
    const onStepBefore = ()=>{
        setActiveStep(activeStep-1)
    }
    const onSubmit = async ()=>{
        try {
            const dataVenta = await onRegistrarVenta()
            if (dataVenta) {
                setActiveStep(0)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="page-with-sticky-footer">
          <Loading show={loadingVenta}/>
          <PageBreadCumb title='Nueva venta'/>
            <StepperCR
                steps={steps}
                activeStep={activeStep}
                onStepChange={(index) => {
                    setActiveStep(index);
                }}
                onlyPreviousClickable
            />
                <div className="flex-grow-1 d-flex flex-column p-2" style={{ minHeight: 10}}>
                    {activeStep === 0 && (
                        <div className="h-100 overflow-y-auto overflow-x-hidden">
                            <DetalleVentaApp/>
                        </div>
                    )}

                    {activeStep === 1 && (
                        <div className="flex-grow-1 d-flex flex-column" style={{minHeight: 0}}>
                            <DetalleItemsVentaApp/>
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div className="h-100 overflow-y-auto overflow-x-hidden">
                            <DetallePagosApp/>
                        </div>
                    )}

                    {/* {activeStep === 3 && (
                        <div className="h-100 overflow-y-auto overflow-x-hidden">
                            CONFIRMACIÓN
                        </div>
                    )} */}

                </div>
                <div className='sticky-bottom-1 bg-actual' style={{margin: '0px 70px'}}>
                    {
                        activeStep!==(steps.length-1)? (
                            <>
                                {
                                    activeStep!==0 && (
                                        <ButtonCR style={{width: '50px'}} label={<div style={{width: '180px'}}>{'<---'} Volver</div>} className='' onClick={()=>onStepBefore()}/>
                                    )
                                }
                                <div className='float-end'>
                                    <ButtonCR label={<div style={{width: '180px'}}>Siguiente {'--->'}</div>} onClick={()=>onStepLast()}/>
                                </div>
                            </>
                        ): (
                            <>
                                <ButtonCR label={<div style={{width: '180px'}}>{'<---'} Volver</div>} onClick={()=>onStepBefore()}/>
                                <div className='float-end'>
                                    <ButtonCR label={'Registrar venta'} onClick={()=>onSubmit()}/>
                                </div>
                            </>
                        )
                    }
                </div>
        </div>
    );
}
