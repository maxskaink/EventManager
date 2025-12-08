import axios, { AxiosError } from "axios";
import StorageKeys from "../../stores/storage-keys"
import { logout } from "@/features/auth";

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    withCredentials: true, // Enable credentials for CORS
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000 // 30 seconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here if you're using JWT
        const token = localStorage.getItem(StorageKeys.API_TOKEN);
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
            logout();
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

// Initialize CSRF protection
export const initializeCsrf = async () => {
    try {
        // Importante: este endpoint NO va bajo /api
        await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
            withCredentials: true,
        });
    } catch (error) {
        console.error('Failed to initialize CSRF protection:', error);
    }
};

export default axiosInstance
