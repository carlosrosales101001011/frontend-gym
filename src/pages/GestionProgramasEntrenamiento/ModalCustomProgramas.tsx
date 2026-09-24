import { useEffect, useState } from 'react'
import type { modalCustom } from '@/types/props'
import ModalCR from '@/components/Modal/ModalCR'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import { AppInformacion } from '@/pages/GestionProgramasEntrenamiento/Tabs/TabInformacion/AppInformacion'
import { AppPlanes } from '@/pages/GestionProgramasEntrenamiento/Tabs/TabPlanes/AppPlanes'
import { AppHorarios } from '@/pages/GestionProgramasEntrenamiento/Tabs/TabHorarios/AppHorarios'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { ImageDropZone, type formProp } from '@/components/ImageDropZone/ImageDropZone'
import { getBlobUrl } from '@/helpers/blobUrl'
import { useAppDispatch, useAppSelector } from '@/stores/Store'
import { onResetPrograma } from '@/pages/GestionProgramasEntrenamiento/store/programaSlice'
import { useProgramaEntrenamientoStore } from '@/pages/GestionProgramasEntrenamiento/useProgramaEntrenamientoStore'

export const ModalCustomProgramas = ({show, onHide, id}: modalCustom) => {
    const dispatch = useAppDispatch()
    const producto = useAppSelector((state) => state.PROGRAMA.programa)
    const originales = useAppSelector((state) => state.PROGRAMA.originales)
    const { obtenerProgramaCompleto, guardarProgramaCompleto } = useProgramaEntrenamientoStore()

    const [guardando, setGuardando] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    // resetea el archivo de avatar elegido cada vez que el modal se abre para un programa distinto, sin usar un efecto
    const [avatarKey, setAvatarKey] = useState('')
    const avatarKeyActual = `${show}-${id}`
    if (avatarKey !== avatarKeyActual) {
        setAvatarKey(avatarKeyActual)
        setAvatarFile(null)
    }
    // carga el programa a editar (o limpia el formulario para uno nuevo) cuando el modal se abre
    useEffect(() => {
        if (!show) return
        if (id !== 0) {
            obtenerProgramaCompleto(id)
        } else {
            dispatch(onResetPrograma())
        }
    }, [show, id])

    const onAvatarChange = (event: formProp) => setAvatarFile(event.value.file)
    const avatarPreview = id !== 0 ? (getBlobUrl(producto.url_avatar) ?? null) : null

    const onCancelar = ()=>{
        onHide()
        dispatch(onResetPrograma())
    }
    const onGuardar = async ()=>{
        setGuardando(true)
        try {
            await guardarProgramaCompleto(producto, originales, avatarFile)
            onCancelar()
        } catch (error) {
            console.log(error);
        } finally {
            setGuardando(false)
        }
    }
  return (
    <ModalCR show={show} onHide={onCancelar} position='right' size='lg'>
        <ModalCR.Header>
            <ModalCR.Title>
                {id !== 0 ? 'Editar programa' : 'Nuevo programa'}
            </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <Row>
                <Col lg={3}>
                    <div className="d-flex justify-content-center mb-3">
                        <ImageDropZone
                            name='avatar'
                            initialSrc={avatarPreview}
                            onChange={onAvatarChange}
                            widthZone={160}
                            heightZone={160}
                        />
                    </div>
                </Col>
                <Col lg={9}>
                    <Tabs>
                        <Tab title='Informacion' eventKey={'info-pgm'}>
                            <AppInformacion/>
                        </Tab>
                        <Tab title='Planes(Meses)' eventKey={'planes-pgm'}>
                            <AppPlanes/>
                        </Tab>
                        <Tab title='Horarios' eventKey={'horario-pgm'}>
                            <AppHorarios/>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </ModalCR.Body>
        <ModalCR.Footer>
            <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} onClick={onGuardar} disabled={guardando}/>
        </ModalCR.Footer>
    </ModalCR>
  )
}
