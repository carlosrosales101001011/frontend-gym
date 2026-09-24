import { Navigate, Route, Routes } from "react-router-dom";
import { ModulosHome } from "@/layouts/Home/ModulosHome";
import { AuthGuard } from "@/routes/guard/AuthGuard";
import { Login } from "@/pages/login/Login";
import { PublicGuard } from "@/routes/guard/PublicGuard";
// import { ProtectedRoutes } from "@/routes/ProtectedRoutes";
import { lazy } from "react";
import { ProfileGuard } from "@/routes/guard/ProfileGuard";
import { ProtectedRoutes } from "@/routes/ProtectedRoutes";
const FlujoCaja = lazy(() => import('@/pages/FlujoCaja'));
const PuntoVenta = lazy(()=>import('@/pages/PuntoVenta'))

// TODO: GESTIONES
const GestionTerminologias = lazy(() => import('@/pages/GestionTerminologias'));
const GestionEntradaMovProducto = lazy(() => import('@/pages/GestionEntradaMovProducto'));
const GestionSalidaMovProducto = lazy(() => import('@/pages/GestionSalidaMovProducto'));
const GestionUsuario = lazy(() => import('@/pages/GestionUsuarios'));
const GestionEgresos = lazy(() => import('@/pages/GestionEgresos'));
const GestionIngresos = lazy(() => import('@/pages/GestionIngreso'));
const GestionProductos = lazy(() => import('@/pages/GestionProductos'));
const GestionMovimientoProductos = lazy(() => import('@/pages/GestionMovimientoAlmacen'));
const GestionSucursal = lazy(() => import('@/pages/GestionSucursal'));
const GestionProveedores = lazy(() => import('@/pages/GestionProveedores'));
const GestionClientes = lazy(() => import('@/pages/GestionClientes'));
const GestionColaboradores = lazy(() => import('@/pages/GestionColaboradores'));
const GestionImpuestos = lazy(() => import('@/pages/GestionImpuestos'));
const GestionCuentasFinancieras = lazy(() => import('@/pages/GestionCuentasFinanciera'));
const GestionTC = lazy(() => import('@/pages/GestionTipoCambio'));
const GestionTermGrupoFinanzas = lazy(() => import('@/pages/GestionTermGrupoFinanzas'));
const GestionTerminologiaFinanzas = lazy(() => import('@/pages/GestionTerminologiaFinanzas'));
// TODO: PERFILES
const Perfil = lazy(() => import('@/pages/perfil'));
const PerfilColaborador = lazy(() => import('@/pages/PerfilColaborador/Index'));
const PerfilCliente = lazy(() => import('@/pages/PerfilCliente/Index'));
//TODO: CONFIGURACIONES APROXI
const GestionModulos = lazy(() => import('@/pages/GestionModulos'));
const GestionSecciones = lazy(() => import('@/pages/GestionSecciones'));
const GestionEntidadxUser = lazy(() => import('@/pages/GestionEntidadxUser'));
const GestionSeccionXmodulouser = lazy(() => import('@/pages/GestionSeccionXmodulouser'));
const GestionSeccionXentidad = lazy(() => import('@/pages/GestionSeccionXentidad'));
const Compras = lazy(() => import('@/pages/GestionSeccionXentidad'));
const GestionAlmacen = lazy(() => import('@/pages/GestionAlmacen'));
const GestionPromociones = lazy(() => import('@/pages/GestionPromociones'));
const GestionProgramasEntrenamiento = lazy(()=>import('@/pages/GestionProgramasEntrenamiento'))
const SemanasDeProgramasEntrenamiento = lazy(() => import('@/pages/GestionPromociones'));
const ReporteVentas = lazy(() => import('@/pages/DataVentas'));
const SeguimientoMembresia = lazy(() => import('@/pages/SeguimientoMembresia'));
const AgendaNutricionista = lazy(() => import('@/pages/AgendaNutricionista'));
const ExtensionRegalos = lazy(() => import('@/pages/GestionExtensionRegalos'));
// const InformacionEmpresa = lazy(() => import('@/pages/InformacionEmpresa'));
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path=":uid_mod/*" element={<ProtectedRoutes/>}>
            {/* INVENTARIO */}
            <Route path="punto-venta" element={<PuntoVenta/>}/>
            <Route path="gestion-proveedores" element={<GestionProveedores/>}/>
            <Route path="gestion-productos" element={<GestionProductos/>}/>
            <Route path="gestion-movimientos" element={<GestionMovimientoProductos/>}/>
            <Route path="entrada-productos-almacen" element={<GestionEntradaMovProducto/>}/>
            <Route path="salida-productos-almacen" element={<GestionSalidaMovProducto/>}/>
            <Route path="gestion-sucursales" element={<GestionSucursal/>}/>
            <Route path="gestion-almacen" element={<GestionAlmacen/>}/>
            <Route path="gestion-promociones" element={<GestionPromociones/>}/>
            {/*  */}
            <Route path="gestion-terminologia" element={<GestionTerminologias/>}/>
            <Route path="gestion-usuario" element={<GestionUsuario/>}/>
            <Route path="gestion-gasto" element={<GestionEgresos/>}/>
            <Route path="flujo-caja" element={<FlujoCaja/>}/>
            <Route path="gestion-ingreso" element={<GestionIngresos/>}/>
            <Route path="gestion-cuentas-financieras" element={<GestionCuentasFinancieras/>}/>
            <Route path="gestion-tc" element={<GestionTC/>}/>
            <Route path="gestion-impuestos" element={<GestionImpuestos/>}/>
            <Route path="terminologias-financieras" element={<GestionTermGrupoFinanzas/>}/>
            <Route path="terminologias-grupos-financieros" element={<GestionTerminologiaFinanzas/>}/>
            <Route path="gestion-modulos" element={<GestionModulos/>}/>
            <Route path="gestion-secciones" element={<GestionSecciones/>}/>
            <Route path="gestion-entidad-user" element={<GestionEntidadxUser/>}/>
            <Route path="gestion-seccion-modulouser" element={<GestionSeccionXmodulouser/>}/>
            <Route path="gestion-seccion-entidad" element={<GestionSeccionXentidad/>}/>
            <Route path="realizar-compra" element={<Compras/>}/>
            <Route path="gestion-programas" element={<GestionProgramasEntrenamiento/>}/>
            <Route path="gestion-semanas-programas" element={<SemanasDeProgramasEntrenamiento/>}/>
            <Route path="reporte-ventas" element={<ReporteVentas/>}/>
            <Route path="seguimiento-membresia" element={<SeguimientoMembresia/>}/>
            <Route path="agenda-nutricionista" element={<AgendaNutricionista/>}/>
            <Route path="extension-regalos" element={<ExtensionRegalos/>}/>
            <Route element={<ProfileGuard gestion="gestion-cliente"/>}>
              <Route path="gestion-clientes" element={<GestionClientes/>}/>
              <Route path="perfil-cliente/:uid_cliente" element={<Perfil/>}/>
            </Route>
            <Route element={<ProfileGuard gestion="gestion-empleados"/>}>
                <Route path="gestion-empleados" element={<GestionColaboradores/>}/>
                <Route path="perfil-colaborador/:uid_colaborador" element={<PerfilColaborador/>}/>
            </Route>
      </Route>
      <Route element={<PublicGuard/>}>
        <Route path="login/*" element={<Login />} /> 
      </Route>
      <Route element={<AuthGuard/>}>
        <Route path="home" element={<ModulosHome />} />
      </Route>
    </Routes>
  )
}
