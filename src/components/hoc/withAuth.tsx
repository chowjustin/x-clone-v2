"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import * as React from "react";
import {toast} from "react-hot-toast";

import api from "@/lib/api";
import {getToken, removeToken} from "@/lib/cookies";
import useAuthStore from "@/app/stores/useAuthStore";
import {User, UserResponse} from "@/types/user";
import Loading from "@/app/loading";

export interface WithAuthProps {
    user: User;
}

const LOGIN_ROUTE = "/login";
const DEFAULT_ROUTE = "/";

/**
 * Add authentication check to a component
 */
export default function withAuth<T>(
    Component: React.ComponentType<T>,
    requireAuth: boolean = true
) {
    function ComponentWithAuth(props: T) {
        const router = useRouter();
        const params = useSearchParams();
        const redirect = params.get("redirect");
        const pathName = usePathname();

        // Store values
        const isAuthenticated = useAuthStore.useIsAuthed();
        const isLoading = useAuthStore.useIsLoading();
        const login = useAuthStore.useLogin();
        const logout = useAuthStore.useLogout();
        const stopLoading = useAuthStore.useStopLoading();
        const user = useAuthStore.useUser();

        const checkAuth = React.useCallback(() => {
            const token = getToken();
            if (!token) {
                if (isAuthenticated) {
                    logout();
                }
                stopLoading();
                return;
            }
            if (!user) {
                const loadUser = async () => {
                    try {
                        const res = await api.get<UserResponse>("/user/me");
                        if (!res.data.data) {
                            toast.error("Login session is invalid");
                            throw new Error("Login session is invalid");
                        }

                        login({
                            ...res.data.data,
                            token,
                        });
                    } catch (_) {
                        await removeToken();
                    } finally {
                        stopLoading();
                    }
                };

                loadUser();
            }
        }, [isAuthenticated, login, logout, stopLoading, user]);

        React.useEffect(() => {
            checkAuth();

            window.addEventListener("focus", checkAuth);
            return () => {
                window.removeEventListener("focus", checkAuth);
            };
        }, [checkAuth]);

        React.useEffect(() => {
            if (!isLoading) {
                if (isAuthenticated && user) {
                    // Redirect from login page to dashboard if already authenticated
                    if (pathName === LOGIN_ROUTE) {
                        router.replace(redirect || DEFAULT_ROUTE);
                    }
                } else if (requireAuth) {
                    // Redirect to login if authentication is required
                    router.replace(`${LOGIN_ROUTE}?redirect=${pathName}`);
                } else if (!requireAuth && isAuthenticated && pathName === LOGIN_ROUTE) {
                    // Redirect away from login page if already authenticated
                    router.replace(DEFAULT_ROUTE);
                }
            }
        }, [isAuthenticated, isLoading, pathName, redirect, router, user, requireAuth]);

        // Show loading state
        if (isLoading || (requireAuth && !isAuthenticated)) {
            return <Loading/>;
        }

        // For authenticated routes that require the user to be loaded
        if (requireAuth && (!isAuthenticated || !user)) {
            return <Loading/>;
        }

        // Render the component
        return <Component {...(props as T)} user={user}/>;
    }

    return ComponentWithAuth;
}