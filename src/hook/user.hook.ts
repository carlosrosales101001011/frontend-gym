import httpClient from "@/common/helpers/httpClient";

function AuthService() {
	return {
		login: (values: object) => {
			return httpClient.post('/login/', values);
		},
		logout() {
			return httpClient.post('/logout/', {});
		},
		register: (values: object) => {
			return httpClient.post('/register/', values);
		},
		forgetPassword: (values: object) => {
			return httpClient.post('/forget-password/', values);
		},
	};
}

export default AuthService();
