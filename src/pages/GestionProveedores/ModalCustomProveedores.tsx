import { ButtonCR } from '@/components/Button/ButtonCR';
import ModalCR from '@/components/Modal/ModalCR';
import { InputCR } from '@/components/TextFields/InputCR';
import { InputSelectCR } from '@/components/TextFields/InputSelectCR';
import { useForm } from '@/hook/useForm';
import type { ProveedorProps } from '@/pages/GestionProveedores/store/proveedorSlice';
import { useEffect } from 'react';
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore';
import { initialStateProveedor } from '@/pages/GestionProveedores/store/proveedorSlice';
import { useProveedoresStore } from '@/pages/GestionProveedores/useProveedoresStore';

interface ModalCustomProveedoresProps {
  id: number;
  onHide: () => void;
  show: boolean;
}

export const ModalCustomProveedores = ({ id, onHide, show }: ModalCustomProveedoresProps) => {
  const { data:datatipoDocumento, cargar:cargarTipoDocumento } = useTerminologiaPersona('TipoDeDocumentoPersona');
  const { data:dataEstadosEntidad, cargar:cargarEstadosEntidad } = useTerminologiaPersona('estadosEntidad');
  const { post, patch, obtenerxID, dataxID } = useProveedoresStore()
  const { formState, register, handleSubmit, reset } = useForm({defaultValues: initialStateProveedor.proveedor, mode: 'onChange'})
  useEffect(() => {
    cargarTipoDocumento();
    cargarEstadosEntidad();
  }, [show])
  const onSubmit = (data: ProveedorProps) => {
    const { id, ...val } = data;
    if (id!==0) {
    patch({...val} as ProveedorProps, id, '')
    }else{
    post({...val} as ProveedorProps)
    }
    onCancelar()
  }
    useEffect(() => {
      if (id!==0 && show) {
        obtenerxID(id)
      }else{
        reset(initialStateProveedor.proveedor);
      }
    }, [show, id])
    
    useEffect(() => {
      if (dataxID && id !== 0) {
        reset({
          ...dataxID
        });
      }else if (id === 0) {
        reset(initialStateProveedor.proveedor);
      }
    }, [dataxID, id]);
  const onCancelar = () => {
    onHide()
    reset(initialStateProveedor.proveedor)
  }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Agregar Proveedor {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
              <InputSelectCR {...register("id_estado", {
                  required: "Este campo es obligatorio"
                })} label='Estado' name='id_estado' options={dataEstadosEntidad} messageErrors={formState.errors.id_estado?.message}/>
              <InputSelectCR {...register("id_tipo_documento", {
                  required: "Este campo es obligatorio"
                })} label='Tipo de documento' name='id_tipo_documento' options={datatipoDocumento} messageErrors={formState.errors.id_tipo_documento?.message}/>
              <InputCR {...register("numero_documento", {
                  required: "Este campo es obligatorio"
                })} label='Número de Documento' name='numero_documento' type='normal' />
              <InputCR {...register("nombres", {
                  required: "Este campo es obligatorio"
                })} label='Razón Social' name='nombres' type='normal' />
              <InputCR {...register("apodo", {
                  required: "Este campo es obligatorio"
                })} label='Nombre Comercial' name='apodo' type='normal' />
              <ButtonCR label='Guardar' type='submit' />
          </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
