"use client";

import {QueryClient, QueryClientProvider, QueryOptions,} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";

import api from "@/lib/api";

const defaultQueryFn = async ({queryKey}: QueryOptions) => {
    const {data} = await api.get(`${queryKey?.[0]}`);
    return data;
};

export default function Providers({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn: defaultQueryFn,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-center"/>
            {children}
        </QueryClientProvider>
    );
}
