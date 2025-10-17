import axios, { AxiosError } from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Required for Laravel Sanctum/Session auth
    headers: {
        'X-Requested-With': 'XMLHttpRequest', // Required for Laravel to detect AJAX requests
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here if you're using JWT
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 419 (CSRF token mismatch)
        if (error.response?.status === 419) {
            // Get new CSRF token by hitting /sanctum/csrf-cookie
            await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`);
            // Retry the original request
            return axiosInstance(originalRequest!);
        }

        // Handle 401 (Unauthenticated)
        if (error.response?.status === 401) {
            // Remove token and redirect to login
            localStorage.removeItem('token');
            // You might want to use your router here instead of window.location
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Handle 403 (Unauthorized)
        if (error.response?.status === 403) {
            // Handle forbidden access
            return Promise.reject(error);
        }

        // Handle 422 (Validation errors)
        if (error.response?.status === 422) {
            // Return validation errors
            return Promise.reject(error);
        }

        // Handle 429 (Too Many Requests)
        if (error.response?.status === 429) {
            // Handle rate limiting
            return Promise.reject(error);
        }

        // Handle 500 (Server Error)
        if (error.response?.status === 500) {
            // Handle server error
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance