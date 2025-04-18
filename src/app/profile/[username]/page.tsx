"use client";

import React, {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import api, {assetBaseURL} from "@/lib/api";
import Image from "next/image";
import {ArrowLeft, Calendar, Link as LinkIcon, Loader2, MapPin} from "lucide-react";
import PostList from "@/app/components/PostList";
import useAuthStore from "@/app/stores/useAuthStore";
import Link from "next/link";
import Button from "@/components/button/Button";
import {User} from "@/types/user";
import {PostsResponse} from "@/types/post";

const UserProfilePage = () => {
    const params = useParams();
    const username = params.username as string;
    const router = useRouter();
    const {user: currentUser} = useAuthStore();
    const isOwnProfile = currentUser?.username === username;

    // Get user data
    const {
        data: userData,
        isLoading: isLoadingUser,
        isError: isUserError,
    } = useQuery({
        queryKey: ["user", username],
        queryFn: async () => {
            const response = await api.get(`/user/${username}`);
            return response.data;
        },
        enabled: !!username,
    });

    useEffect(() => {
        if (userData?.data.username && userData?.data.name) {
            document.title = `${userData.data.name} (@${userData.data.username}) / X`;
        } else {
            document.title = "Profile / X";
        }
    }, [userData?.data]);

    // Get user posts
    const {
        data: postsData,
        isLoading: isLoadingPosts,
        isError: isPostsError,
        refetch: refetchPosts,
    } = useQuery<PostsResponse>({
        queryKey: ["userPosts", username],
        queryFn: async () => {
            const response = await api.get(`/user/${username}/posts?page=1&per_page=50`);
            return response.data;
        },
        enabled: !!username,
    });

    const user: User | null = userData?.data || null;
    const posts = postsData?.data || [];

    if (isLoadingUser || isLoadingPosts) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin"/>
            </div>
        );
    }

    if (isUserError || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <p className="text-xl mb-4">User not found</p>
                <Link href="/" className="text-blue-400 hover:underline">
                    Return to home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="max-w-2xl mx-auto px-4">
                <div
                    className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 py-3 px-4 border-b border-gray-800">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4">
                            <ArrowLeft className="w-6 h-6"/>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">{user.name || user.username}</h1>
                            <p className="text-gray-500 text-sm">
                                {postsData?.meta?.count || 0} {postsData?.meta?.count === 1 ? "Tweet" : "Tweets"}
                            </p>
                        </div>
                    </div>
                </div>


                <div className="border-b border-gray-800 pb-4">
                    <div className="h-32 bg-gray-800 w-full flex items-center justify-center">#RPLLabTerbaik</div>
                    <div className="flex justify-between items-start px-4">
                        <div className="relative -mt-16">
                            {user.image_url ? (
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-black">
                                    <Image
                                        src={
                                            user.image_url.startsWith("http")
                                                ? user.image_url
                                                : `${assetBaseURL}/assets/${user.image_url}`
                                        }
                                        alt={user.username}
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-black">
                                      <span className="text-3xl font-bold">
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                                      </span>
                                </div>
                            )}
                        </div>

                        {isOwnProfile && (
                            <Link href="/profile/edit" className="pt-4">
                                <Button variant="secondary" size="sm">
                                    Edit profile
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="px-4 mt-3">
                        <h2 className="text-xl font-bold">{user.name || user.username}</h2>
                        <p className="text-gray-500">@{user.username}</p>

                        {user.bio && <p className="mt-3">{user.bio}</p>}

                        <div className="flex flex-wrap gap-4 mt-3 text-gray-500">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1"/>
                                <span>Lab RPL</span>
                            </div>
                            <div className="flex items-center">
                                <LinkIcon className="w-4 h-4 mr-1"/>
                                <a href="https://github.com/Lab-RPL-ITS" target="_blank"
                                   className="text-blue-400 hover:underline">
                                    https://github.com/Lab-RPL-ITS
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1"/>
                                <span>Joined Jul 2023</span>
                            </div>
                        </div>

                        <div className="flex gap-5 mt-3">
                            <div>
                                <span className="font-bold">8</span>{" "}
                                <span className="text-gray-500">Following</span>
                            </div>
                            <div>
                                <span className="font-bold">8M</span>{" "}
                                <span className="text-gray-500">Followers</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-800">
                    <div className="flex">
                        <div className="flex-1 text-center py-4 font-bold border-b-2 border-blue-500">
                            Tweets
                        </div>
                        <div className="flex-1 text-center py-4 text-gray-500">
                            Replies
                        </div>
                        <div className="flex-1 text-center py-4 text-gray-500">
                            Media
                        </div>
                        <div className="flex-1 text-center py-4 text-gray-500">
                            Likes
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-800">
                    {isPostsError ? (
                        <p className="text-center py-8">Error loading tweets</p>
                    ) : posts.length === 0 ? (
                        <div className="py-8 text-center">
                            <h3 className="text-xl font-bold mb-2">
                                @{user.username} {"hasn't tweeted yet"}
                            </h3>
                            <p className="text-gray-500">
                                When they do, their tweets will show up here.
                            </p>
                        </div>
                    ) : (
                        <PostList
                            posts={posts}
                            refetchPosts={refetchPosts}
                            currentUser={currentUser?.username || null}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;