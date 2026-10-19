import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { HeaderApp } from './components/HeaderApp'
import { Header2App } from './components/Header2App'
import { BodyApp } from './components/BodyApp'

/** Reporte de citas de nutrición (misma estructura que ReporteVentas): filtros, resumen y cuerpo */
export const App = () => {
  return (
    <div className="p-2">
      <PageBreadCumb title="Reporte de citas"/>
      <HeaderApp/>
      <Header2App/>
      <BodyApp/>
    </div>
  )
}
