import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { HeaderApp } from './components/HeaderApp'
import { Header2App } from './components/Header2App'
import { BodyApp } from './components/BodyApp'

/** Reporte de asistencias de clientes (misma estructura que ReporteMeta): filtros, resumen y cuerpo */
export const App = () => {
  return (
    <div className="p-2">
      <PageBreadCumb title="Reporte de asistencia de clientes"/>
      <HeaderApp/>
      <Header2App/>
      <BodyApp/>
    </div>
  )
}
