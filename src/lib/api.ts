import {ApiError, ApiResponse} from "@/types/api";
import axios, {AxiosError, AxiosResponse} from "axios";
import {GetServerSidePropsContext} from "next/types";
import {toast} from "sonner";
import Cookies from "universal-cookie";
import {getToken, tokenKey} from "@/lib/cookies";

export const baseURL =
    process.env.NEXT_PUBLIC_RUN_MODE === "production"
        ? process.env.NEXT_PUBLIC_API_URL_PROD
        : process.env.NEXT_PUBLIC_API_URL_DEV;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

const isServer = typeof window === "undefined";
let context: GetServerSidePropsContext | undefined;
let toastId: string | number;

api.interceptors.request.use((config) => {
    if (!config.headers) return config;

    let token: string;

    if (!isServer) {
        token = getToken();
    } else {
        if (!context) {
            throw "Api Context not found. You must call `setApiContext(context)` before calling api on server-side";
        }

        const cookies = new Cookies(context.req.headers.cookie);
        token = cookies.get(tokenKey);
    }

    if (!isServer && config.toastify) {
        toastId = toast.loading(config.loadingMessage || "Loading...");
    }

    config.headers.Authorization = token ? `Bearer ${token}` : "";

    return config;
});

api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        const isSuccess = response?.data?.success;

        if (!isServer && response.config.toastify) {
            if (isSuccess) {
                const successMessage = "Berhasil!";
                toast.success(successMessage, {id: toastId});
            } else {
                const errorMessage = JSON.stringify(response.data);
                const message = errorMessage.slice(8, -1); // cut out the error code and the last character
                toast.warning(message, {id: toastId});
            }
        }

        return response;
    },
    (error: AxiosError<ApiError>) => {
        const response = error.response;
        const message = response?.data.message || error.message;
        const toastMessage = typeof message === "string" ? message : message;

        if (!isServer && error.config?.toastify) {
            toast.error(toastMessage, {id: toastId});
        }

        return Promise.reject({...error});
    },
);

export const setApiContext = (ctx: GetServerSidePropsContext) => {
    context = ctx;
};

export default api;
