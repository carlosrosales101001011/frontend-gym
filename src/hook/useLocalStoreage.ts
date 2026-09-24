import { useState, useEffect } from "react";

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
) => {
    
    const readValue = (): T => {
        try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
        } catch (error) {
        console.error("Error leyendo localStorage", error);
        return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
        const valueToStore =
            value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
        console.error("Error guardando en localStorage", error);
        }
    };

    const remove = () => {
        try {
        localStorage.removeItem(key);
        setStoredValue(initialValue);
        } catch (error) {
        console.error("Error eliminando del localStorage", error);
        }
    };

    useEffect(() => {
        setStoredValue(readValue());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return [storedValue, setValue, remove] as const;
};