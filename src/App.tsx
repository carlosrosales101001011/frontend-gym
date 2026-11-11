import '@/App.css'
import '@/assets/scss/app.scss';
// import { DataTableView } from '@/pages/Gestion/DataTableView';
import { AppRoutes } from '@/routes';
import { ContenedorAlertasCR } from '@/components/Alerta/AlertaCR';
function App() {
  return (
    <>
    <AppRoutes/>
    <ContenedorAlertasCR/>
    </>
  )
}

export default App
