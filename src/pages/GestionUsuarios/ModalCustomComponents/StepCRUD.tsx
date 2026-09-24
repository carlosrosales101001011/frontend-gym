import React from 'react'
import MultiStateCheckbox from '@/components/MultiStateCheckBox/MultiStateCheckboxCR';
import { type EntidadProps } from '@/pages/GestionUsuarios/store/usuariosSlice';
import { Col, Row } from 'react-bootstrap';
type props ={
    id: number;
    id_entidad:number;
    id_estado_CREATE:number;
    id_estado_READ:number;
    id_estado_UPDATE:number;
    id_estado_DELETE:number;
    handleChange: (index:number, campo: keyof EntidadProps, value: number)=>void;
}
type crudOpt={
    action: string;
    id_estado: number;
    label:keyof EntidadProps
}
export const StepCRUD = ({id, handleChange, id_estado_CREATE, id_estado_DELETE, id_estado_READ, id_estado_UPDATE}:props) => {
    const crudOption:crudOpt[] = [
        {action: 'Crear', id_estado: id_estado_CREATE, label: 'id_estado_CREATE'},
        {action: 'Leer', id_estado: id_estado_READ, label: 'id_estado_READ'},
        {action: 'Editar', id_estado: id_estado_UPDATE, label: 'id_estado_UPDATE'},
        {action: 'Eliminar', id_estado: id_estado_DELETE, label: 'id_estado_DELETE'},
    ]
    return (
    <>
    {
        crudOption.map(crud=>{
            return (
                <Row className='my-1'>
                    <Col lg={4}>
                        {crud.action} 
                    </Col>
                    <Col lg={8}>
                        <MultiStateCheckbox
                            value={crud.id_estado}
                            onChange={(v)=>handleChange(id, `${crud.label}`, v)}
                            options={[
                                { className: 'bg-warning text-black',label: "Pedir permiso", value: 2016  },
                                { className: 'bg-success text-black',label: "Autorizar", value: 2014,styles: {color: 'black', backgroundColor: 'green'}  },
                                { className: 'bg-danger text-black',label: "Denegar", value: 2015 },
                            ]}
                            />
                    </Col>
                </Row>
            )
        })
    }
    </>
  )
}
