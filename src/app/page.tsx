"use client";

import React, {useEffect, useState} from "react";
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
    House,
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
import {PostsQueryParams} from "@/types/post";

export default withAuth(Home, true)

function Home() {
    const [queryParams, setQueryParams] = useState<PostsQueryParams>({
        page: 1,
        per_page: 10
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {user} = useAuthStore();

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

    // Get Post
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

    return (
        <section className="flex bg-black relative lg:px-[10%] w-full">
            <div
                className="bg-black text-white h-screen w-[20%] max-lg:w-[30%] fixed lg:left-[10%] lg:px-2 top-0 max-md:w-[75px] py-4 border-right-03">
                <div className="flex flex-col justify-between h-full max-md:items-center">
                    <div>
                        <Image
                            src="/images/xlogo.png"
                            alt="logo" width={300}
                            height={300}
                            className="max-w-[30px] mx-auto md:ml-5 mb-4"
                        />
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
                    <PostForm refetchPosts={refetch}/>
                </div>

                {isLoading ? (
                    <div className="text-center p-4">Loading posts...</div>
                ) : isError ? (
                    <div className="text-center p-4 text-red-500">Error loading posts. Please try again.</div>
                ) : (
                    <>
                        <PostList
                            posts={posts}
                            refetchPosts={refetch}
                            currentUser={user?.username || null}
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