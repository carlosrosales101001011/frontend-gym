import httpClient from "@/common/helpers/httpClient";

/** Registro de blob_storage: una imagen guardada en el Azure Blob Storage */
export type BlobStorageProps = {
  id: number;
  /** A qué pertenece la imagen (ej. el uid_avatar de una persona) */
  uid_location: string;
  name_image: string;
  extension: string;
  /** Contenedor de Azure donde está */
  clasificacion: string;
  size: string;
  uid: string;
  /** Encuadre de la imagen (ver components/Avatar/encuadreFoto) */
  x: number;
  y: number;
  zoom: number;
};

/** Lo que se puede cambiar de un registro (ej. el encuadre) */
export type BlobStorageCambios = Partial<Pick<BlobStorageProps, 'x' | 'y' | 'zoom' | 'uid_location'>>;

type SubirImagenProps = {
  archivo: File;
  uid_location: string;
  /** Contenedor de Azure (ej. 'avatarclientes'); sin él, el backend usa 'imagenes-generales' */
  contenedor?: string;
};

/**
 * Endpoints de /blob-storage (imágenes en el Azure Blob Storage). Las imágenes se agrupan por uid_location.
 * - post: sube una imagen
 * - getxId: la trae por id
 * - getxUidLocation: todas las vigentes de un uid_location (la más reciente primero)
 * - getUltimoxUidLocation: la vigente más reciente de un uid_location
 * - put: cambia datos del registro (ej. el encuadre x, y, zoom); en el backend es PATCH
 * - delete: la da de baja (flag = false; el archivo sigue en Azure)
 */
export const useBlobStorage = () => {
  const post = async ({ archivo, uid_location, contenedor }: SubirImagenProps) => {
    const extension = archivo.name.includes('.') ? `.${archivo.name.split('.').pop()}` : '';
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('uid_location', uid_location);
    formData.append('uid', crypto.randomUUID().toUpperCase());
    // El backend los recalcula del archivo, pero su DTO los pide
    formData.append('extension', extension);
    formData.append('size', `${archivo.size}`);
    formData.append('clasificacion', contenedor ?? '');
    const { data }: { data: { data: BlobStorageProps } } = await httpClient.post('/blob-storage', formData, {
      params: contenedor ? { container: contenedor } : undefined,
    });
    return data.data;
  };

  const getxId = async (id: number) => {
    const { data }: { data: BlobStorageProps | null } = await httpClient.get(`/blob-storage/id/${id}`);
    return data;
  };

  /** Imágenes vigentes de un uid_location, la más reciente primero */
  const getxUidLocation = async (uid_location: string) => {
    const { data }: { data: BlobStorageProps[] } = await httpClient.get(`/blob-storage/uid_location/${uid_location}`);
    return data;
  };

  /** Imagen vigente más reciente de un uid_location; null si no tiene */
  const getUltimoxUidLocation = async (uid_location: string) => {
    const { data }: { data: BlobStorageProps | null } = await httpClient.get(`/blob-storage/uid_location/${uid_location}/ultimo`);
    return data || null;
  };

  const put = async (id: number, cambios: BlobStorageCambios) => {
    await httpClient.patch(`/blob-storage/id/${id}`, cambios);
  };

  const eliminar = async (id: number) => {
    await httpClient.delete(`/blob-storage/id/${id}`);
  };

  return { post, getxId, getxUidLocation, getUltimoxUidLocation, put, delete: eliminar };
};
