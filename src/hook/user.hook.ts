import httpClient from "@/helpers/httpClient";

function AuthService() {
	return {
		login: (values: unknown) => {
			return httpClient.post('/login/', values);
		},
		logout() {
			return httpClient.post('/logout/', {});
		},
		register: (values: unknown) => {
			return httpClient.post('/register/', values);
		},
		forgetPassword: (values: unknown) => {
			return httpClient.post('/forget-password/', values);
		},
	};
}

export default AuthService();
