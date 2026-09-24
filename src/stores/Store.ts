import { configureStore } from "@reduxjs/toolkit";
import { usuariosSlice } from "@/pages/GestionUsuarios/store/usuariosSlice";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { terminologiasSlice } from "@/pages/GestionTerminologias/store/terminologiasSlice";
import { colaboradoresSlice } from "@/pages/GestionColaboradores/store/colaboradoresSlice";
import { clientesSlice } from "@/pages/GestionClientes/store/clientesSlice";
import { perfilColaboradorSlice } from "@/pages/PerfilColaborador/store/perfilColaboradorSlice";
import { comentarioSlice } from "@/components/Comentario/comentarioSlice";
import { contratoColaboradorSlice } from "@/pages/PerfilColaborador/store/contratoColaboradorSlice";;
import { ContactoEmergenciaSlice } from "@/components/GestionContactoEmergencia/contactoEmergenciaSlice";
import { egresosSlice } from "@/pages/GestionEgresos/store/egresosSlice";
import { detalleEgresoSlice } from "@/pages/GestionEgresos/DetalleEgreso/store/detalleEgresoSlice";
import { detallePagoSlice } from "@/pages/GestionEgresos/DetallePago/store/detallePagoSlice";
import { tcSlice } from "@/pages/GestionTipoCambio/store/tipoCambioSlice";
import { cuentasFinancierasSlice } from "@/pages/GestionCuentasFinanciera/store/cuentasFinancieraSlice";
import { termFinanzasSlice } from "@/pages/GestionTerminologiaFinanzas/store/TermFinanzasSlice";
import { moduloSlice } from "@/pages/GestionModulos/store/moduloSlice";
import { impuestosSlice } from "@/pages/GestionImpuestos/store/ImpuestoSlice";
import { productoSlice } from "@/pages/GestionProductos/store/productoSlice";
import { entidadxuserSlice } from "@/pages/GestionEntidadxUser/store/entidadxuserSlice";
import { seccionxmodulouserSlice } from "@/pages/GestionSeccionXmodulouser/store/seccionxmodulouserSlice";
import { SeccionSlice } from "@/pages/GestionSecciones/store/seccionSlice";
import { proveedorSlice } from "@/pages/GestionProveedores/store/proveedorSlice";
import { permisoSlice } from "@/stores/permisos/permisoSlice";
import { grupoFinanzasSlice } from "@/pages/GestionTermGrupoFinanzas/store/grupoFinanzasSlice";
import { uiSlice } from "@/stores/ui/uiSlice";
import { SucursalSlice } from "@/pages/GestionSucursal/store/sucursalSlice";
import { AlmacenSlice } from "@/pages/GestionAlmacen/store/almacenSlice";
import { movProductoSlice } from "@/pages/GestionMovimientoAlmacen/store/movProductoSlice";
import { promocionSlice } from "@/pages/GestionPromociones/store/promocionSlice";
import { programaSlice } from "@/pages/GestionProgramasEntrenamiento/store/programaSlice";
import { ventaSlice } from "@/pages/PuntoVenta/store/ventaSlice";
import { dataVentaSlice } from "@/pages/DataVentas/store/dataVentaSlice";
import { SeguimientoMembresiaSlice } from "@/pages/SeguimientoMembresia/store/seguimientoMembresiaSlice";
import { agendaNutricionistaSlice } from "@/pages/AgendaNutricionista/store/agendaNutricionistaSlice";
import { extRegaloSlice } from "@/pages/GestionExtensionRegalos/store/extRegaloSlice";

export const store = configureStore({
    reducer: {
    USER: usuariosSlice.reducer,
    TERMINOLOGIA: terminologiasSlice.reducer,
    COLABORADOR: colaboradoresSlice.reducer,
    CLIENTE: clientesSlice.reducer,
    MODULO: moduloSlice.reducer,
    SECCION: SeccionSlice.reducer,
    PERFIL_COLABORADOR: perfilColaboradorSlice.reducer,
    COMENTARIO: comentarioSlice.reducer,
    CONTRATO_COLABORADOR: contratoColaboradorSlice.reducer,
    CONTACTO_EMERGENCIA: ContactoEmergenciaSlice.reducer,
    EGRESO: egresosSlice.reducer,
    DETALLE_EGRESO: detalleEgresoSlice.reducer,
    DETALLE_GASTOPAGO: detallePagoSlice.reducer,
    TC: tcSlice.reducer,
    CUENTAS_FINANCIERAS: cuentasFinancierasSlice.reducer,
    IMPUESTO: impuestosSlice.reducer,
    PRODUCTO: productoSlice.reducer,
    TERM_FINANZA: termFinanzasSlice.reducer,
    ENTIDADXUSER: entidadxuserSlice.reducer,
    SECCIONXMODULOUSER: seccionxmodulouserSlice.reducer,
    PROVEEDOR: proveedorSlice.reducer,
    PERMISO: permisoSlice.reducer,
    GRUPO_FINANZAS: grupoFinanzasSlice.reducer,
    UI: uiSlice.reducer,
    SUCURSAL: SucursalSlice.reducer,
    ALMACEN: AlmacenSlice.reducer,
    MOVPRODUCTO: movProductoSlice.reducer,
    PROMOCION: promocionSlice.reducer,
    PROGRAMA: programaSlice.reducer,
    VENTA: ventaSlice.reducer,
    DATAVENTAS: dataVentaSlice.reducer,
    SEGUIMIENTO_MEMBRESIA: SeguimientoMembresiaSlice.reducer,
    AGENDA_NUTRICIONISTA: agendaNutricionistaSlice.reducer,
    EXT_REGALO: extRegaloSlice.reducer
}
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector