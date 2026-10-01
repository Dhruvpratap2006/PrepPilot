import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const baseURL = rawBaseURL.trim().replace(/\/$/, "");

const api = axios.create({
    baseURL,
    withCredentials: true,
});

// Automatically attach Bearer token to all outgoing requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
