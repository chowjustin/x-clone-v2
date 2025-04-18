"use client";

import {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import api from "@/lib/api";
import {Post} from "@/types/post";
import PostItem from "@/app/components/PostItem";
import PostForm from "@/app/components/PostForm";
import {ArrowLeft, Loader2} from "lucide-react";
import useAuthStore from "@/app/stores/useAuthStore";
import Link from "next/link";

const PostDetailPage: FC = () => {
    const params = useParams();
    const postId = params.id;
    const router = useRouter();
    const {user} = useAuthStore();
    const currentUser = user?.username || null;

    // Get post detail
    const {
        data: postData,
        isLoading,
        isError,
        refetch: refetchPost
    } = useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const response = await api.get(`/post/${postId}?page=1&per_page=50`);
            return response.data;
        },
        enabled: !!postId
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin"/>
            </div>
        );
    }

    if (isError || !postData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <p className="text-xl mb-4">Post not found or has been deleted</p>
                <Link href="/" className="text-blue-400 hover:underline">
                    Return to home
                </Link>
            </div>
        );
    }

    const post = postData.data;
    const replies = post.replies || [];

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex items-center mb-6">
                    <button onClick={() => router.back()} className="mr-4">
                        <ArrowLeft className="w-6 h-6"/>
                    </button>
                    <h1 className="text-2xl font-bold">Tweet</h1>
                </div>

                <PostItem
                    post={post}
                    refetchPosts={refetchPost}
                    currentUser={currentUser}
                    isDetailView={true}
                />

                {/* Reply Form */}
                <div className="mb-6">
                    <PostForm refetchPosts={refetchPost} parentId={Number(postId)}/>
                </div>

                {/* Replies */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Replies</h2>
                    {replies.length === 0 ? (
                        <p className="text-gray-400 text-center py-6">No replies yet. Be the first to reply!</p>
                    ) : (
                        <div className="space-y-4">
                            {replies.map((reply: Post) => (
                                !reply.is_deleted && (
                                    <div key={reply.id} className="">
                                        <PostItem
                                            post={reply}
                                            refetchPosts={refetchPost}
                                            currentUser={currentUser}
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;