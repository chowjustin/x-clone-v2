import {useMutation} from "@tanstack/react-query";
import {AxiosError, AxiosResponse} from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import api from "@/lib/api";
import {setToken} from "@/lib/cookies";
import {LoginError, LoginRequest, LoginResponse} from "@/types/auth/login";
import {UserResponse} from "@/types/user";
import useAuthStore from "@/app/stores/useAuthStore";

export default function useLoginMutation() {
    const {login} = useAuthStore();

    const router = useRouter();

    const {mutate, isPending} = useMutation<
        AxiosResponse,
        AxiosError<LoginError>,
        LoginRequest
    >({
        mutationFn: async (data: LoginRequest) => {
            const res = await api.post<LoginResponse>("/user/login", data);

            const token = res.data.data.token;
            setToken(token);

            const user = await api.get<UserResponse>("/user/me");

            if (user) login({...user.data.data, token: token});

            return res;
        },
        onSuccess: () => {
            toast.success("Anda berhasil login");
            router.push("/");
        },
        onError: (error) => {
            toast.error(error?.response?.data.message || error.message);
        },
    });
    return {mutate, isPending};
}
