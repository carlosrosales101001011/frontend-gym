import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type InfoEmpresaProps = {
  id: number,
  razon_social: string,
  nombre_comercial: string,
  ruc: string,
  id_tipo_empresa: number,
  id_estado: number,
  id_actividad_economica: number,
  descripcion: string,
  correo_corporativo: string,
  telefono: string,
  celular: string,
  direccion_fiscal: string,
  id_departamento: string,
  id_provincia: string,
  id_distrito: string,
  codigo_postal: string,
  
};
export const initialInfoEmpresa: InfoEmpresaProps = {
  id: 0,
  razon_social: '',
  nombre_comercial: '',
  ruc: '',
  id_tipo_empresa: 0,
  id_estado: 0,
  id_actividad_economica: 0,
  descripcion: '',
  correo_corporativo: '',
  telefono: '',
  celular: '',
  direccion_fiscal: '',
  id_departamento: '',
  id_provincia: '',
  id_distrito: '',
  codigo_postal: '',
};
