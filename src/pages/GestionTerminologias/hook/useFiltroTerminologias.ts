import { useMemo, useState } from 'react';
import type { TerminologiaProps } from '@/pages/GestionTerminologias/store/terminologiasSlice';

export type FiltroTerminologias = {
  entidad: string | null;
  grupo: string | null;
  subgrupo: string | null;
};

const valoresUnicos = (items: TerminologiaProps[], campo: 'entidad' | 'grupo' | 'subgrupo') => {
  const valores = items.map((item) => item[campo]).filter((valor): valor is string => Boolean(valor));
  return Array.from(new Set(valores)).sort((a, b) => a.localeCompare(b));
};

/** Maneja la seleccion en cascada Entidad -> Grupo -> Subgrupo y filtra la data segun lo elegido. "Todas" se representa como null. */
export const useFiltroTerminologias = (terminologiasInput: TerminologiaProps[]) => {
  const [filtro, setFiltro] = useState<FiltroTerminologias>({ entidad: null, grupo: null, subgrupo: null });

  // Si el backend responde con un shape inesperado, no se rompe la pagina entera
  const terminologias = Array.isArray(terminologiasInput) ? terminologiasInput : [];

  const entidades = useMemo(() => valoresUnicos(terminologias, 'entidad'), [terminologias]);

  const terminologiasDeEntidad = useMemo(() => {
    if (!filtro.entidad) return terminologias;
    return terminologias.filter((item) => item.entidad === filtro.entidad);
  }, [terminologias, filtro.entidad]);

  const grupos = useMemo(() => valoresUnicos(terminologiasDeEntidad, 'grupo'), [terminologiasDeEntidad]);

  const terminologiasDeGrupo = useMemo(() => {
    if (!filtro.grupo) return terminologiasDeEntidad;
    return terminologiasDeEntidad.filter((item) => item.grupo === filtro.grupo);
  }, [terminologiasDeEntidad, filtro.grupo]);

  const subgrupos = useMemo(() => valoresUnicos(terminologiasDeGrupo, 'subgrupo'), [terminologiasDeGrupo]);

  const terminologiasFiltradas = useMemo(() => {
    if (!filtro.subgrupo) return terminologiasDeGrupo;
    return terminologiasDeGrupo.filter((item) => item.subgrupo === filtro.subgrupo);
  }, [terminologiasDeGrupo, filtro.subgrupo]);

  // Al cambiar la entidad se limpian grupo y subgrupo, ya no aplican a la nueva entidad
  const onSeleccionarEntidad = (entidad: string | null) => {
    setFiltro({ entidad, grupo: null, subgrupo: null });
  };

  // Al cambiar el grupo se limpia el subgrupo, ya no aplica al nuevo grupo
  const onSeleccionarGrupo = (grupo: string | null) => {
    setFiltro((prev) => ({ ...prev, grupo, subgrupo: null }));
  };

  const onSeleccionarSubgrupo = (subgrupo: string | null) => {
    setFiltro((prev) => ({ ...prev, subgrupo }));
  };

  return {
    filtro,
    entidades,
    grupos,
    subgrupos,
    terminologiasFiltradas,
    onSeleccionarEntidad,
    onSeleccionarGrupo,
    onSeleccionarSubgrupo,
  };
};
