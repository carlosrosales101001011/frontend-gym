import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ButtonCR } from '@/components/Button/ButtonCR'
import IconCR from '@/components/Icons/IconCR'
import type { isOpenModalCustom } from '@/types/props'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
import { useContratoColaboradorStore } from '@/pages/PerfilColaborador/useContratoColaboradorStore'
import { DataCardContratoLaboral } from '@/pages/PerfilColaborador/Tabs/TabContratosLaborales/DataCardContratoLaboral'
import { ModalCustomContratoEmpleado } from '@/pages/PerfilColaborador/Tabs/TabContratosLaborales/ModalCustomContratoEmpleado'

export const TabContratosLaborales = () => {
  const { uid_colaborador } = useParams<{ uid_colaborador: string }>()
  const uid_empleado = uid_colaborador || ''
  const { searcher } = useContratoColaboradorStore(uid_empleado)

  const [isOpenModalCustom, setIsOpenModalCustom] = useState<isOpenModalCustom>({ id: 0, isCopy: false, isOpen: false })
  const onCloseModalCustom = () => {
    setIsOpenModalCustom({ id: 0, isCopy: false, isOpen: false })
  }
  const onOpenModalCustom = (id: number) => {
    setIsOpenModalCustom({ id, isCopy: false, isOpen: true })
  }

  const { get } = useQueryParams()
  const querySearch = get(querys.search) || ''
  const page = Number(get(querys.page))
  const show = Number(get(querys.show))
  useEffect(() => {
    if (!uid_empleado) return
    const ctrl = new AbortController()
    searcher(ctrl.signal).catch(e => {
      if (e.name !== 'CanceledError') console.error(e)
    })
    return () => ctrl.abort()
  }, [uid_empleado, querySearch, page, show])

  return (
    <>
      <ModalCustomContratoEmpleado id={isOpenModalCustom.id} uid_empleado={uid_empleado} show={isOpenModalCustom.isOpen} onHide={onCloseModalCustom} />
      <DataCardContratoLaboral
        uid_empleado={uid_empleado}
        onOpenModalCustom={onOpenModalCustom}
        otrosBotones={
          <ButtonCR label={'Agregar Contrato'} onClick={() => onOpenModalCustom(0)} icon={<IconCR name='plus' size={14} />} />
        }
      />
    </>
  )
}
