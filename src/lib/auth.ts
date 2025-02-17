import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';


const withAuth = (
    axiosInstanceConfig?: AxiosInstance | AxiosRequestConfig,
    getToken: () => string | null = () => localStorage.getItem('admin_jwt_token')
): AxiosInstance => {
    const axiosInstance = axios.create(axiosInstanceConfig as AxiosRequestConfig);

    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = getToken();
            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error); // Pass errors along
        }
    );

    return axiosInstance;
};

export default withAuth;