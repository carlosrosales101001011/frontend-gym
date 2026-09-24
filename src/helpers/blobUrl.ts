export const getBlobUrl = (path?: string | null) => {
  if (!path) return undefined;
  return `${import.meta.env.VITE_BLOB_BASE_URL}${path}`;
};
