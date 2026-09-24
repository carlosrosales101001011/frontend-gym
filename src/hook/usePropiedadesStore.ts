import { useState, useCallback } from 'react';
import httpClient from '@/common/helpers/httpClient';

export const obtenerPropiedadxEntidadxGrupoxSub = async (
  entidad: string,
  grupo: string,
  sub: string
) => {
  try {
    const { data } = await httpClient.get(
      `/terminologia/entidad/${entidad}/grupo/${grupo}/subgrupo/${sub}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const obtenerDistritosProv = async (sub:string) => {
  try {
    const { data } = await httpClient.get(
      `/ubigeo/prov/${sub}`
    );
    console.log({data});
    
    return data.lista
  } catch (error) {
    console.log(error);
  }
};

const useTerminologia = (entidad: string, grupo: string, sub: string) => {
  const [data, setData] = useState([]);

  const cargar = useCallback(async () => {
    const response =
      entidad === 'persona' && grupo === 'distrito'
        ? await obtenerDistritosProv(sub)
        : await obtenerPropiedadxEntidadxGrupoxSub(entidad, grupo, sub);

    setData(response ?? []);
    return response;
  }, [entidad, grupo, sub]);

  return { data, cargar };
};

// Único lugar donde escribes entidad/grupo/sub
const TERMINOLOGIAS = {
  GeneroPersona: ['persona', 'razgo', 'genero'],
  EstadoCivilPersona: ['persona', 'razgo', 'estado-civil'],
  TipoDeDocumentoPersona: ['persona', 'razgo', 'tipo-documento'],
  cargosEmpleado: ['rrhh', 'contrato-colaborador', 'cargo'],
  departamentosEmpleado: ['rrhh', 'contrato-colaborador', 'departamento'],
  estadosContratoEmpleado: ['rrhh', 'contrato-colaborador', 'estado'],
  estadosEntidad: ['estado', 'entidad', 'estado'],
  codigoOficialMoneda: ['finanzas', 'moneda', 'codigo-oficial'],
  frecuenciaPagoPlanilla: ['rrhh', 'contrato-colaborador', 'frecuencia-pago'],
  tipoContratoPlanilla: ['rrhh', 'contrato-colaborador', 'tipo'],
  tipoComprobantes: ['finanzas', 'comprobante', 'tipo'],
  bancos: ['finanzas', 'banco', 'tipo'],
  tipoCuentaBancaria: ['finanzas', 'cuenta-bancaria', 'tipo'],
  parientes: ['persona', 'pariente', 'tipo'],
  unidadMedida: ['finanzas', 'unidad-medida', 'tipo'],
  tipoCuentas: ['finanzas', 'cuenta-bancaria', 'tipo-cuenta'],
  tipoMonto: ['todo', 'todo', 'tipo-numero'], //MONTO O PORCENTAJE
  aplicarSobre: ['todo', 'todo', 'aplicar-sobre'], //Venta, Compra o Ambos
  baseCalculo: ['todo', 'todo', 'base-calculo'], //Total, Cantidad, Subtotal, Sobre el anterior
  tipoModulo: ['modulo', 'tipo', 'tipo'], //Modulo, Submodulo, Seccion
  entidadSistema: ['entidad', 'entidad', 'entidad'], //Modulo, Seccion, Usuario, Egreso, Ingreso
  grupoFinanzas: ['finanzas', 'grupo', 'tipo'], //RR.HH., 
  tipoMovimientoFinanzas: ['finanzas', 'movimiento', 'tipo'], //Ingreso, Egreso
  tipoSucursal: ['entidad', 'sucursal', 'tipo'], //Matriz, Sucursal, Agencia
  userRoles: ['usuario', 'rol', 'tipo'], //Administrador, Normal
  categoriaProducto: ['producto', 'tipo', 'categoria'],
  marcaProducto: ['producto', 'tipo', 'marca'],
  tipoMovimientoProducto: ['producto', 'tipo', 'movimiento'],
  motivoEntradaMovimientoProducto: ['producto-movimiento', 'entrada', 'motivo'],
  motivoSalidaMovimientoProducto: ['producto-movimiento', 'salida', 'motivo'],
  tipoPromocion: ['promocion', 'tipo', 'tipo'], //Descuento porcentual, monto fijo, 2x1, etc.
  tipoTarifaPrograma: ['programa', 'tipo', 'tarifa'], //Descuento porcentual, monto fijo, 2x1, etc.
  categoriaPrograma: ['programa', 'categoria', 'tipo'],
  origenVenta: ['venta', 'origen', 'tipo'],
  formaPagoVenta: ['venta', 'forma-pago', 'tipo'],
  distritosLima: ['persona', 'distrito', 'Lima'],
  distritosCallao: ['persona', 'distrito', 'Callao'],
} as const;

type TerminologiaKey = keyof typeof TERMINOLOGIAS;
export const useTerminologiaPersona = (key: TerminologiaKey) => {
  const [entidad, grupo, sub] = TERMINOLOGIAS[key];
  return useTerminologia(entidad, grupo, sub);
};