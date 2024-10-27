import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const axiosPrivateInstance = axios.create({
    baseURL: BASE_URL,
});

axiosPrivateInstance.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (token) {
            config.headers['Authorization'] = `JWT ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosPrivateInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.data) {
            const { error: errorMessage } = error.response.data;
            if (errorMessage === 'TokenExpiredError: jwt expired') {
                // Redirect to login
                window.location.href = '';
            } else if (errorMessage === 'Forbidden: Invalid token' || errorMessage === 'Forbidden: No token provided') {
                console.error("Invalid token, logging out...");
                // Optionally, you can clear the token from local storage here
                localStorage.removeItem("token");
                window.location.href = '';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosPrivateInstance;
