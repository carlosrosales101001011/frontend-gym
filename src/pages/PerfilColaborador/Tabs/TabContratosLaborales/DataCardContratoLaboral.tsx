import type React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
import { useContratoColaboradorStore } from '@/pages/PerfilColaborador/useContratoColaboradorStore'
import { ContratoLaboralCard } from '@/pages/PerfilColaborador/Tabs/TabContratosLaborales/ContratoLaboralCard'

type Props = {
  uid_empleado: string
  onOpenModalCustom: (id: number) => void
  otrosBotones: React.ReactNode
}

export const DataCardContratoLaboral = ({ uid_empleado, onOpenModalCustom, otrosBotones }: Props) => {
  const { contratosColaborador } = useSelector((state: RootState) => state.CONTRATO_COLABORADOR)
  const { remove } = useContratoColaboradorStore(uid_empleado)

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center mb-2 gap-2">
        {otrosBotones}
      </div>
      {contratosColaborador.length === 0 ? (
        <div className="text-center text-muted py-4">No hay datos disponibles</div>
      ) : (
        <div className="rounded p-2">
        {contratosColaborador.map((contrato) => (
          <ContratoLaboralCard
            key={contrato.id}
            contrato={contrato}
            onEdit={onOpenModalCustom}
            onDelete={remove}
          />
        ))}
        </div>
      )}
    </div>
  )
}
