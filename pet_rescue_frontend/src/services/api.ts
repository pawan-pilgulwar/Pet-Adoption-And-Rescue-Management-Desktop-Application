import axios from 'axios';
import Cookies from 'js-cookie';

export const BASE_URL = 'http://localhost:8000';
const API_BASE_URL = `${BASE_URL}/api/`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
    async (config) => {
        let accessToken = Cookies.get('access_token');

        if (!accessToken) {
            const refreshToken: string | undefined = Cookies.get('refresh_token');
            if (refreshToken) {
                try {
                    // Use base axios instead of `api` to prevent infinite interceptor loops
                    const response = await axios.post(`${API_BASE_URL}v1/users/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    accessToken = response.data.access;
                    if (accessToken) {
                        Cookies.set('access_token', accessToken);
                    }
                } catch (error) {
                    console.error('Failed to refresh token', error);
                }
            }
        }

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('v1/users/login/', credentials);
        if (response.data.data && response.data.data.access) {
            Cookies.set('access_token', response.data.data.access);
            Cookies.set('refresh_token', response.data.data.refresh);
            Cookies.set('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },
    register: async (userData: any) => {
        const response = await api.post('v1/users/register/', userData);
        return response.data;
    },
    logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('user');
    },
    getCurrentUser: () => {
        const user = Cookies.get('user');
        return user ? JSON.parse(user) : null;
    },
    getMe: async () => {
        const response = await api.get('v1/users/me/');
        return response.data;
    },
    updateUser: async (id: number | string, data: any) => {
        const response = await api.patch(`v1/users/${id}/update-user/`, data);
        return response.data;
    }
};

export const petService = {
    getAll: async () => {
        const response = await api.get('v1/pets/all-pets/'); // Updated endpoint
        return response.data;
    },
    getById: async (id: number | string) => {
        const response = await api.get(`v1/pets/${id}/pet-detail/`);
        return response.data;
    },
    // Admin specific
    adminGetAll: async () => {
        const response = await api.get('v1/pets/admin-all-pets/');
        return response.data;
    },
    register: async (petData: any) => {
        const response = await api.post('v1/pets/admin-register-pet/', petData);
        return response.data;
    },
    update: async (id: number | string, petData: any) => {
        const response = await api.patch(`v1/pets/${id}/admin-update-pet/`, petData);
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await api.delete(`v1/pets/${id}/admin-delete-pet/`);
        return response.data;
    },
};

export const reportService = {
    getAll: async () => {
        const response = await api.get('v1/reports/all-reports/');
        return response.data;
    },
    getUserReports: async () => {
        const response = await api.get('v1/reports/get-user-reports/');
        return response.data;
    },
    getById: async (id: number | string) => {
        const response = await api.get(`v1/reports/${id}/get-report/`);
        return response.data;
    },
    create: async (reportData: any) => {
        const response = await api.post('v1/reports/create-report/', reportData);
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await api.delete(`v1/reports/${id}/delete-report/`);
        return response.data;
    },
    // Admin specific
    adminGetAll: async () => {
        const response = await api.get('v1/reports/admin-get-all/');
        return response.data;
    },
    adminUpdate: async (id: number | string, data: any) => {
        const response = await api.patch(`v1/reports/${id}/admin-update-report/`, data);
        return response.data;
    }
};

export const adminService = {
    getStats: async () => {
        const response = await api.get('v1/users/admin-dashboard/');
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get('v1/users/admin-users/');
        return response.data;
    },
    deleteUser: async (id: number | string) => {
        const response = await api.delete(`v1/users/${id}/admin-delete-user/`);
        return response.data;
    }
};

export default api;
