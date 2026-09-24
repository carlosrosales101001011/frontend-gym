export const removeNull=<T extends object>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null)
  ) as {
    [K in keyof T as null extends T[K] ? never : K]: T[K]
  };
}