import { useEffect } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from '@/hook/useForm';
import { initialStateTerminologia, type TerminologiaProps } from '@/pages/GestionTerminologias/store/terminologiasSlice';
import { InputCR } from '@/components/TextFields/InputCR';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { useGestionTerminologiasStore } from '@/pages/GestionTerminologias/useGestionTerminologiasStore';

type ValoresInicialesTerminologia = {
  entidad: string;
  grupo: string;
  subgrupo: string;
}

type props = {
  show: boolean;
  onHide:()=>void;
  id: number;
  isCopy:boolean;
  /** Entidad/grupo/subgrupo elegidos en las columnas de filtro; se usan como valor inicial al crear (id 0) y siguen siendo editables */
  valoresIniciales?: ValoresInicialesTerminologia;
}

export const ModalCustom = ({show, onHide, id, isCopy, valoresIniciales}:props) => {
  const { post, obtenerxID, dataxID, patch } = useGestionTerminologiasStore()
  const { register, formState: { errors }, getValues, reset} = useForm<TerminologiaProps>({mode: "onChange",defaultValues: initialStateTerminologia.terminologia })
  useEffect(() => {
    if(id!==0){
      obtenerxID(id)
    }else{
      reset({ ...initialStateTerminologia.terminologia, ...valoresIniciales })
    }
  }, [id, show])

  useEffect(() => {
    if (dataxID && id !== 0) {
      reset({
        ...dataxID
      });
    }else if (id === 0) {
      reset({ ...initialStateTerminologia.terminologia, ...valoresIniciales });
    }
  }, [dataxID, id]);
  const onPostTerminologia = ()=>{
    const { id, ...values } = getValues()
    console.log(id);
    if(id!==0){
      patch(values, id as number, '')
    }else{
      post(values)
    }
  }
  console.log({dataxID, isCopy});
  
  return (
    <Modal show={show} onHide={onHide} size="sm">
      <Modal.Header className="fw-bold"  style={{fontSize: '17px'}}>
          Agregar terminologia {id}
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={12}>
            <InputCR {...register("entidad", {
              required: "La Entidad es obligatoria"
            })} label="Entidad" name="entidad" messageErrors={errors.entidad?.message}/>
          </Col>
          <Col lg={12}>
            <InputCR {...register("grupo", {
              required: "El grupo es obligatorio"
            })} label="Grupo" name="grupo" messageErrors={errors.grupo?.message}/>
          </Col>
          <Col lg={12}>
            <InputCR {...register("subgrupo", {
              required: "El subgrupo es obligatorio"
            })} label="Subgrupo" name="subgrupo" messageErrors={errors.subgrupo?.message}/>
          </Col>
          <Col lg={12}>
            <InputCR {...register("valor", {
              required: "El valor es obligatorio"
            })} label="Valor" name="valor" messageErrors={errors.valor?.message}/>
          </Col>
          <Col lg={12}>
            <ButtonCR label={'Agregar'} onClick={()=>onPostTerminologia()}/>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
