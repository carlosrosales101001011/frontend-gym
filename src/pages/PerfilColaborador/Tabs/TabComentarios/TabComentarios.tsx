import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
import { ContainerComentarios } from '@/components/Comentario/ContainerComentarios'

export const TabComentarios = () => {
      const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  return (
    <div className='m-5'>
      <ContainerComentarios uid_location={colaborador.uid_comentario}/>
    </div>
  )
}
