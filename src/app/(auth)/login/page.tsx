"use client"

import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import Input from "@/components/form/Input";
import Button from "@/components/button/Button";
import Image from "next/image";
import Link from "next/link";
import {LoginRequest} from "@/types/auth/login";
import useLoginMutation from "@/app/(auth)/login/hooks/useLoginMutation";
import withAuth from "@/components/hoc/withAuth";

export default withAuth(LoginUser, false)

function LoginUser() {
    const methods = useForm<LoginRequest>({
        mode: "onChange",
    });

    const {handleSubmit} = methods;

    const {mutate: mutateLogin, isPending} = useLoginMutation();

    const onSubmit = (data: LoginRequest) => {
        mutateLogin(data);
    };

    return (
        <section className="flex justify-center items-center h-screen max-md:px-4">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4 w-1/2 p-12 rounded-lg shadow-md max-lg:w-3/4 max-md:w-full">
                    <Image src="/images/logoireng.png" alt="logo" width={300} height={300}
                           className="max-w-[40px] mx-auto"/>
                    <h2 className="text-2xl font-bold">Sign in to X</h2>
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
                        Sign In
                    </Button>
                    <p className="text-sm text-center text-gray-500">
                        {"Don't have an account?"}{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </FormProvider>
        </section>
    );
}