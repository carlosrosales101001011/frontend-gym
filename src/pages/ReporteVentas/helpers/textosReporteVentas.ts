/**
 * Textos del reporte de ventas según el switch de fecha:
 * por fecha de pago el reporte suma ingresos (pagos del rango); por fecha de venta, ventas
 */
export const textosReporteVentas = (porFechaPago: boolean) => porFechaPago
  ? {
      total: 'Total ingresado',
      detalleTotal: 'Pagos recibidos en el rango',
      detalleClientes: 'Clientes con pagos en el rango',
      verDetalle: 'Ver ingresos',
      tituloModal: 'Ingresos',
      porAsesor: 'Ingresos por asesor',
      porOrigen: 'Ingresos por origen',
      porPrograma: 'Ingresos por programa',
      porPlan: 'Ingresos por planes',
      cargando: 'Cargando ingresos',
      errorCarga: 'No se pudieron cargar los ingresos',
      sinDatos: 'No hay ingresos con estos filtros.',
      /** Tooltip de las barras */
      tooltip: { monto: 'Ingresado: ', cantidad: 'Pagos: ' },
      cantidad: (n: number) => `${n} ${n === 1 ? 'pago' : 'pagos'} en el rango`,
    }
  : {
      total: 'Total vendido',
      detalleTotal: 'Membresías vendidas en el rango',
      detalleClientes: 'Clientes con ventas en el rango',
      verDetalle: 'Ver ventas',
      tituloModal: 'Ventas',
      porAsesor: 'Ventas por asesor',
      porOrigen: 'Ventas por origen',
      porPrograma: 'Ventas por programa',
      porPlan: 'Ventas por planes',
      cargando: 'Cargando ventas',
      errorCarga: 'No se pudieron cargar las ventas',
      sinDatos: 'No hay ventas con estos filtros.',
      tooltip: { monto: 'Vendido: ', cantidad: 'Ventas: ' },
      cantidad: (n: number) => `${n} ${n === 1 ? 'venta' : 'ventas'} en el rango`,
    }

export type TextosReporteVentas = ReturnType<typeof textosReporteVentas>
