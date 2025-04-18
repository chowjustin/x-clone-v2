"use client";

import React, {useEffect, useRef, useState} from "react";
import PostForm from "@/app/components/PostForm";
import PostList from "@/app/components/PostList";
import withAuth from "@/components/hoc/withAuth";
import Image from "next/image";
import {
    BadgeCheck,
    Bell,
    Bookmark,
    Briefcase,
    House,
    Loader,
    LogOut,
    Mail,
    MoreHorizontal,
    Search,
    Star,
    User,
    Users
} from 'lucide-react';
import Link from "next/link";
import useAuthStore from "@/app/stores/useAuthStore";
import {useQuery} from '@tanstack/react-query';
import api, {assetBaseURL} from "@/lib/api";
import {Post, PostsQueryParams, PostsResponse} from "@/types/post";
import {useRouter} from "next/navigation";

export default withAuth(Home, true)

function Home() {
    const [queryParams, setQueryParams] = useState<PostsQueryParams>({
        page: 1,
        per_page: 10
    });

    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const {user, logout: logoutStore} = useAuthStore();

    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (user.image_url) {
                if (user.image_url.startsWith('http')) {
                    setImagePreview(user.image_url);
                } else {
                    setImagePreview(`${assetBaseURL}/assets/${user.image_url}`);
                }
            }
        }
    }, [user]);

    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            page: 1
        }));
    }, []);

    // Get Post
    const {
        data: postsResponse,
        isLoading,
        isError,
        refetch
    } = useQuery<PostsResponse>({
        queryKey: ['posts', queryParams],
        queryFn: async () => {
            const res = await api.get<PostsResponse>('/post', {params: queryParams});
            return res.data;
        },
    });

    useEffect(() => {
        if (postsResponse?.data) {
            if (queryParams.page === 1) {
                setAllPosts(postsResponse.data);
            } else {
                setAllPosts(prevPosts => {
                    const newPosts = postsResponse.data.filter(
                        newPost => !prevPosts.some(p => p.id === newPost.id)
                    );
                    return [...prevPosts, ...newPosts];
                });
            }
        }
    }, [postsResponse, queryParams.page]);

    const meta = postsResponse?.meta;

    const handleRefetch = () => {
        setQueryParams({
            ...queryParams,
            page: 1
        });
        refetch();
    };

    const loadMorePosts = () => {
        if (meta && (queryParams.page ?? 1) < meta.max_page) {
            setQueryParams(prev => ({
                ...prev,
                page: (prev.page ?? 1) + 1
            }));
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && meta && queryParams.page && queryParams.page < meta.max_page) {
                    loadMorePosts();
                }
            },
            {threshold: 0.5}
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => {
            if (bottomRef.current) {
                observer.unobserve(bottomRef.current);
            }
        };
    }, [isLoading, meta, queryParams.page]);

    const logout = (): void => {
        logoutStore();
        router.push('/login');
    };

    return (
        <section className="flex bg-black relative lg:px-[10%] w-full">
            <div
                className="bg-black text-white h-screen w-[20%] max-lg:w-[30%] fixed lg:left-[10%] lg:px-2 top-0 max-md:w-[75px] py-4 border-right-03">
                <div className="flex flex-col justify-between h-full max-md:items-center">
                    <div>
                        <Link href={"/"}>
                            <Image
                                src="/images/xlogo.png"
                                alt="logo" width={300}
                                height={300}
                                className="max-w-[30px] mx-auto md:ml-5 mb-4"
                            />
                        </Link>
                        <div className="">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center p-3 px-5 rounded-full hover:bg-gray-900 cursor-pointer w-fit transition-colors"
                                    >
                                        <Icon className="w-6 h-6"/>
                                        <span className="ml-4 text-xl max-xl:text-lg max-md:hidden">{item.title}</span>
                                    </div>
                                );
                            })}
                            <div
                                className="flex items-center p-3 px-5 rounded-full hover:bg-gray-900 cursor-pointer w-fit transition-colors"
                                onClick={logout}
                            >
                                <LogOut className="w-6 h-6"/>
                                <span className="ml-4 text-xl max-xl:text-lg max-md:hidden">Log Out</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        href={`/profile/${user?.username}`}
                        className="w-full h-fit p-3 px-5 items-center rounded-full hover:bg-gray-900 cursor-pointer w-fit transition-colors flex">
                        {imagePreview ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={imagePreview}
                                    alt="Profile"
                                    width={300}
                                    height={300}
                                    className="max-w-[40px] object-cover w-full h-full"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                  <span className="text-lg font-bold">
                                    {user?.name ? user?.name.charAt(0).toUpperCase() : "U"}
                                  </span>
                            </div>
                        )}
                        <div className="ml-2 h-full mb-[0.5px] max-md:hidden">
                            <p className="font-bold text-white">
                                {user?.name}
                            </p>
                            <p className="text-gray-400 text-sm">@{user?.username}</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div
                className="w-1/2 max-lg:right-0 max-lg:w-[70%] min-h-screen max-md:w-[calc(100%-75px)] max-xl:w-[60%] xl:mx-auto max-xl:right-[10%] max-xl:absolute bg-black border-right-03">
                <div>
                    <PostForm refetchPosts={handleRefetch}/>
                </div>

                {isLoading && queryParams.page === 1 ? (
                    <div className="text-center p-4">Loading posts...</div>
                ) : isError ? (
                    <div className="text-center p-4 text-red-500">Error loading posts. Please try again.</div>
                ) : (
                    <>
                        <PostList
                            posts={allPosts}
                            refetchPosts={handleRefetch}
                            currentUser={user?.username || null}
                        />

                        {isLoading && (queryParams.page ?? 0) > 1 && (
                            <div className="text-center p-4 flex justify-center animate-spin"><Loader/></div>
                        )}

                        <div ref={bottomRef} className="h-10">
                            {meta && (queryParams.page ?? 0) >= meta.max_page && (
                                <div className="text-center text-gray-500 py-4">No more posts to load</div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className="w-[20%] bg-black h-screen fixed right-[10%] top-0 max-xl:hidden pl-4 pt-2">
                <div className="relative w-full mb-3">
                    <input
                        className="w-full px-4 py-2 pl-8 text-sm text-white placeholder-white bg-transparent border border-gray-700 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500 caret-white font-light"
                        placeholder="Search"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"/>
                </div>
                <Image
                    src="/images/right-sidebar.png"
                    alt="logo"
                    width={1000}
                    height={1000}
                    className="mx-auto"
                />
            </div>
        </section>
    );
}

const menuItems = [
    {icon: House, title: "Home"},
    {icon: Search, title: "Explore"},
    {icon: Bell, title: "Notifications"},
    {icon: Mail, title: "Messages"},
    {icon: Bookmark, title: "Bookmarks"},
    {icon: Briefcase, title: "Jobs"},
    {icon: Users, title: "Communities"},
    {icon: Star, title: "Premium"},
    {icon: BadgeCheck, title: "Verified Orgs"},
    {icon: User, title: "Profile"},
    {icon: MoreHorizontal, title: "More"}
];