'use client'
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { redirect } from "next/navigation";

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

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response.status === 401) {
                redirect("/login");
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default withAuth;