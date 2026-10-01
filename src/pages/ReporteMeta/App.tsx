import { PageBreadCumb } from '@/components/PageBreadCumb/PageBreadCumb'
import { HeaderApp } from './components/HeaderApp'
import { Header2App } from './components/Header2App'
import { BodyApp } from './components/BodyApp'

export const App = () => {
  return (
    <div className="p-2">
      <PageBreadCumb title="Reporte de metas"/>
      <HeaderApp/>
      <Header2App/>
      <BodyApp/>
    </div>
  )
}
