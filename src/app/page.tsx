"use client";

import React, {useState} from "react";
import PostForm from "@/app/components/PostForm";
import PostList from "@/app/components/PostList";
import Button from "@/components/button/Button";
import withAuth from "@/components/hoc/withAuth";
import Image from "next/image";
import {
    BadgeCheck,
    Bell,
    Bookmark,
    Briefcase,
    Hash,
    House,
    Mail,
    MoreHorizontal,
    Star,
    User,
    Users
} from 'lucide-react';
import Link from "next/link";
import useAuthStore from "@/app/stores/useAuthStore";
import {useQuery} from '@tanstack/react-query';
import api from "@/lib/api";
import {PostsQueryParams} from "@/types/post";
import {useRouter} from "next/navigation";

export default withAuth(Home, true)

function Home() {
    const [queryParams, setQueryParams] = useState<PostsQueryParams>({
        page: 1,
        per_page: 10
    });

    const router = useRouter();
    const {user: userStored, logout: logoutStore} = useAuthStore();

    // Fetch posts using Tanstack Query
    const {
        data: postsResponse,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['posts', queryParams],
        queryFn: async () => {
            const res = await api.get('/post', {params: queryParams});
            return res.data;
        }
    });

    const posts = postsResponse?.data || [];
    const meta = postsResponse?.meta;

    const loadMorePosts = () => {
        if (meta && queryParams.page! < meta.max_page) {
            setQueryParams({
                ...queryParams,
                page: queryParams.page! + 1
            });
        }
    };

    const logout = (): void => {
        logoutStore();
        router.push('/login');
    };

    return (
        <section className="flex bg-gray-800 relative lg:px-[10%] w-full">
            <div
                className="bg-black text-white h-screen w-[20%] max-lg:w-[30%] fixed lg:left-[10%] lg:px-2 top-0 max-md:w-[75px] py-4 border-right-03">
                <div className="flex flex-col justify-between h-full max-md:items-center">
                    <div>
                        <Image src="/images/xlogo.png" alt="logo" width={300} height={300}
                               className="max-w-[30px] mx-auto md:ml-5 mb-4"/>

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
                        </div>
                    </div>
                    <Link
                        href="/profile"
                        className="w-full h-fit p-3 px-5 items-center rounded-full hover:bg-gray-900 cursor-pointer w-fit transition-colors flex">
                        <Image
                            src="/images/xlogo.png"
                            alt="logo"
                            width={300}
                            height={300}
                            className="max-w-[40px] h-fit w-fit rounded-full overflow-hidden p-1"
                        />
                        <div className="ml-2 h-full mb-[0.5px] max-md:hidden">
                            <p className="font-bold text-white">
                                {userStored?.name}
                            </p>
                            <p className="text-gray-400 text-sm">@{userStored?.username}</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div
                className="w-1/2 max-lg:right-0 max-lg:w-[70%] max-md:w-[calc(100%-75px)] max-xl:w-[60%] xl:mx-auto max-xl:right-[10%] max-xl:absolute bg-black">
                <PostForm refetchPosts={refetch}/>

                {isLoading ? (
                    <div className="text-center p-4">Loading posts...</div>
                ) : isError ? (
                    <div className="text-center p-4 text-red-500">Error loading posts. Please try again.</div>
                ) : (
                    <>
                        <PostList
                            posts={posts}
                            refetchPosts={refetch}
                            currentUser={userStored?.username || null}
                        />
                        {meta && queryParams.page! < meta.max_page && (
                            <div className="text-center p-4">
                                <Button onClick={loadMorePosts} variant="secondary" size="sm">
                                    Load More
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="w-[20%] bg-green-200 h-screen fixed right-[10%] top-0 max-xl:hidden">
                <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                />
                <div className="user-info">
                    <p className="username">
                        <strong>{userStored?.name}</strong>
                    </p>
                    <Button onClick={logout} variant="primary" size="sm">
                        Logout
                    </Button>
                </div>
            </div>
        </section>
    );
}

const menuItems = [
    {icon: House, title: "Home"},
    {icon: Hash, title: "Explore"},
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