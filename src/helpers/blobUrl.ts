export const getBlobUrl = (path?: string | null) => {
  if (!path) return undefined;
  return `https://tribu1.blob.core.windows.net${path}`;
};

/** URL de una imagen de blob_storage: /{contenedor}/{nombre} sobre la base del Azure Blob Storage */
export const getBlobStorageUrl = (blob?: { clasificacion?: string, name_image?: string } | null) =>
  blob?.clasificacion && blob.name_image ? getBlobUrl(`/${blob.clasificacion}/${blob.name_image}`) : undefined;
