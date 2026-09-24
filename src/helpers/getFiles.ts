

export interface ZoneData {
  id: number;
  src: string | null;
  name: string | null;
  file: File | null;
}
    export const getFiles = (z: ZoneData[]) =>
      z.map((zone) => zone.file).filter(Boolean) as File[];
 