"use client"

import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import Input from "@/components/form/Input";
import Button from "@/components/button/Button";
import {RegisterRequest} from "@/types/auth/register";
import {useMutation} from "@tanstack/react-query";
import {AxiosError, AxiosResponse} from "axios";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import withAuth from "@/components/hoc/withAuth";

export default withAuth(RegisterUser, true)

function RegisterUser() {
    const methods = useForm<RegisterRequest>({
        mode: "onChange",
    });

    const router = useRouter();
    const {handleSubmit, reset} = methods;

    const {mutate, isPending} = useMutation<
        AxiosResponse,
        AxiosError,
        RegisterRequest
    >({
        mutationFn: async (data: RegisterRequest) => {
            const res = await api.post("/user/register", data);
            return res;
        },
        onSuccess: () => {
            toast.success("Account successfully created!");
            reset();
            router.push("/login")
        },
        onError: (error) => {
            const errorMessage =
                (error.response?.data as { error?: string })?.error || error.message;
            toast.error(errorMessage);
        },

    });

    const onSubmit = (data: RegisterRequest) => {
        mutate(data)
    };

    return (
        <section className="flex justify-center items-center h-screen max-md:px-4">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4 w-1/2 p-12 rounded-lg shadow-md max-lg:w-3/4 max-md:w-full">
                    <Image src="/images/xlogo.png" alt="logo" width={300} height={300}
                           className="max-w-[30px] mx-auto"/>
                    <h2 className="text-2xl font-bold">Sign up to X</h2>
                    <Input
                        id="name"
                        label="Name"
                        type="text"
                        placeholder="Enter your name"
                        validation={{
                            required: "Name is required",
                        }}
                    />
                    <Input
                        id="username"
                        label="Username"
                        type="text"
                        placeholder="Enter your username"
                        validation={{
                            required: "Username is required",
                        }}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        validation={{
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        }}
                    />
                    <Button variant="primary" type="submit" className="w-full mt-4"
                            isLoading={isPending}
                    >
                        Sign Up
                    </Button>
                    <p className="text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </FormProvider>
        </section>
    );
}