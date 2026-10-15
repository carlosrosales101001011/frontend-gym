import { io } from 'socket.io-client';
import { STORAGE_KEY } from '@/providers/AuthProvider';

/**
 * Socket a un namespace del backend (ej. '/agenda-nutricionista'), autenticado con el mismo token que httpClient.
 * No se conecta solo: quien lo usa llama a connect() al montar y a disconnect() al desmontar.
 */
export const crearSocket = (namespace: string) =>
	io(`${import.meta.env.VITE_API_URL}${namespace}`, {
		autoConnect: false,
		// Como función, el token se lee en cada (re)conexión y no solo al crear el socket
		auth: (cb) => cb({ token: localStorage.getItem(STORAGE_KEY) }),
	});
