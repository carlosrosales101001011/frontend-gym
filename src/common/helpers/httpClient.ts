import axios, { AxiosError } from 'axios';
import { STORAGE_KEY } from '@/providers/AuthProvider';

const ErrorCodeMessages: { [key: number]: string } = {
	401: 'Invalid credentials',
	403: 'Access Forbidden',
	404: 'Resource or page not found',
};

function HttpClient() {
	const _errorHandler = (error: AxiosError) =>{
		return Promise.reject(
			Object.keys(ErrorCodeMessages).includes(`${error.status}`)
				? ErrorCodeMessages[error.status??0]
				: (error.response?.data as {message: ''})?.message || error.message
		);
	}

const _httpClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 6000,
	headers: {
		'Content-Type': 'application/json',
	},
});
_httpClient.interceptors.request.use((config) => {
	const token = localStorage.getItem(STORAGE_KEY);
	if (token && config.headers) {
		  config.headers['authorization'] = `Bearer ${token}`;
	}
	// deja que el navegador ponga el Content-Type (con boundary) cuando el body es FormData,
	// en vez del 'application/json' fijo por defecto de la instancia
	if (config.data instanceof FormData && config.headers) {
		delete config.headers['Content-Type'];
	}
	return config;
});

_httpClient.interceptors.response.use((response) => {
		return response;
	}, _errorHandler);
	return {
		get: (url: string, config = {}) => _httpClient.get(`/api${url}`, config),
		post: (url: string, data: object, config = {}) => _httpClient.post(`/api${url}`, data, config),
		patch: (url: string, config = {}) => _httpClient.patch(`/api${url}`, config),
		put: (url: string, config = {}) => _httpClient.put(`/api${url}`, config),
		delete: (url: string, config = {}) => _httpClient.delete(`/api${url}`, config),
		client: _httpClient,
	};
}

export default HttpClient();
