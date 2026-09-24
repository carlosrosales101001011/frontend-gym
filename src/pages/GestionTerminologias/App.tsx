import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { PageBreadCumb } from "@/components/PageBreadCumb/PageBreadCumb"
import { ButtonCR } from "@/components/Button/ButtonCR";
import IconCR from "@/components/Icons/IconCR";
import { DataTableView } from "@/pages/GestionTerminologias/DataTableView";
import { useGestionTerminologiasStore } from "@/pages/GestionTerminologias/useGestionTerminologiasStore";
import { ModalCustom } from "@/pages/GestionTerminologias/ModalCustom";
import { useFiltroTerminologias } from "@/pages/GestionTerminologias/hook/useFiltroTerminologias";
import { ColumnaEntidades } from "@/pages/GestionTerminologias/components/ColumnaEntidades";
import { ColumnaGrupos } from "@/pages/GestionTerminologias/components/ColumnaGrupos";
import { ColumnaSubgrupos } from "@/pages/GestionTerminologias/components/ColumnaSubgrupos";
import { useAppSelector } from "@/stores/Store";
type propStateModalCustom = {
  id: number;
  isOpen: boolean;
  isCopy:boolean;
}
export const App = () => {
  const [isOpenModalCustom, setisOpenModalCustom] = useState<propStateModalCustom>({id: 0, isOpen: false, isCopy: false})
  const { obtener } = useGestionTerminologiasStore()
  const { terminologias } = useAppSelector(e=>e.TERMINOLOGIA)
  const {
    filtro,
    entidades,
    grupos,
    subgrupos,
    terminologiasFiltradas,
    onSeleccionarEntidad,
    onSeleccionarGrupo,
    onSeleccionarSubgrupo,
  } = useFiltroTerminologias(terminologias)
  const onCloseModalCustom = ()=>{
        setisOpenModalCustom({id: 0, isOpen: false, isCopy: false})
  }
  const onOpenModalCustom = (id:number)=>{
      setisOpenModalCustom({id, isOpen: true, isCopy: false})
  }
  useEffect(() => {
    obtener()
  }, [])
  return (
    <div>
      <PageBreadCumb title={'Gestion Terminologias'}/>
      <Row className="mx-0">
        <Col lg={2}>
          <ColumnaEntidades
            entidades={entidades}
            entidadSeleccionada={filtro.entidad}
            onSeleccionarEntidad={onSeleccionarEntidad}
          />
        </Col>
        <Col lg={2}>
          <ColumnaGrupos
            grupos={grupos}
            grupoSeleccionado={filtro.grupo}
            onSeleccionarGrupo={onSeleccionarGrupo}
          />
        </Col>
        <Col lg={2}>
          <ColumnaSubgrupos
            subgrupos={subgrupos}
            subgrupoSeleccionado={filtro.subgrupo}
            onSeleccionarSubgrupo={onSeleccionarSubgrupo}
          />
        </Col>
        <Col lg={6}>
        <ButtonCR label={'Agregar Nuevo'} onClick={()=>onOpenModalCustom(0)} icon={<IconCR name='plus' size={14}/>}/>
          <DataTableView
            data={terminologiasFiltradas}
            onOpenModalCustom={onOpenModalCustom}
          />
        </Col>
      </Row>
      
      <ModalCustom
        isCopy={isOpenModalCustom.isCopy}
        onHide={()=>onCloseModalCustom()}
        id={isOpenModalCustom.id}
        show={isOpenModalCustom.isOpen}
        valoresIniciales={{
          entidad: filtro.entidad ?? '',
          grupo: filtro.grupo ?? '',
          subgrupo: filtro.subgrupo ?? '',
        }}
      />
    </div>
  )
}
