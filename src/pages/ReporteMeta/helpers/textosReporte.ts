/**
 * Textos del reporte según el switch de fecha:
 * por fecha de pago el reporte suma ingresos (pagos del periodo); por fecha de venta, ventas
 */
export const textosReporte = (porFechaPago: boolean) => porFechaPago
  ? {
      totalAcumulado: 'Ingreso total acumulado',
      detalleTotal: 'Pagos recibidos en el periodo',
      mejorDia: 'Mejor día de ingreso',
      verDetalle: 'Ver ingresos',
      tituloGrafico: 'Meta acumulada vs ingreso real',
      serieReal: 'Ingreso real acumulado',
      etiquetaLinea: 'Ingresos',
      acumulado: 'Ingreso acumulado',
      cargando: 'Cargando ingresos',
      errorCarga: 'No se pudieron cargar los ingresos',
      cantidad: (n: number) => `${n} ${n === 1 ? 'pago' : 'pagos'} en el periodo`,
    }
  : {
      totalAcumulado: 'Venta total acumulada',
      detalleTotal: 'Membresías vendidas en el periodo',
      mejorDia: 'Mejor día de venta',
      verDetalle: 'Ver ventas',
      tituloGrafico: 'Meta acumulada vs venta real',
      serieReal: 'Venta real acumulada',
      etiquetaLinea: 'Ventas',
      acumulado: 'Venta acumulada',
      cargando: 'Cargando ventas',
      errorCarga: 'No se pudieron cargar las ventas',
      cantidad: (n: number) => `${n} ${n === 1 ? 'venta' : 'ventas'} en el periodo`,
    }

export type TextosReporte = ReturnType<typeof textosReporte>
