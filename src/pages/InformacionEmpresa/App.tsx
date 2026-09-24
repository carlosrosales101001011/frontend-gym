import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { useForm } from '@/hook/useForm'
import { initialInfoEmpresa } from '@/pages/InformacionEmpresa/store/infoEmpresaSlice'

export const App = () => {
  const { formState, register } = useForm({defaultValues: initialInfoEmpresa, mode: 'onChange'})
  return (
    <div>
        <form>
            <Row>
                <Col lg={6}>
                    <InputCR {...register("razon_social", {
                    required: "La razón social es obligatoria"
                    })} label="Razón social" name="razon_social" messageErrors={formState.errors.razon_social?.message}/>
                </Col>
                <Col lg={6}>
                    <InputCR {...register("ruc", {
                    required: "El RUC es obligatorio"
                    })} label="RUC" name="ruc" messageErrors={formState.errors.ruc?.message}/>
                </Col>
            </Row>
        </form>
    </div>
  )
}
