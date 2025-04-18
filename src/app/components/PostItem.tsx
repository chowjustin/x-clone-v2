import {FC, useEffect, useRef, useState} from "react";
import {Post} from "@/types/post";
import {useMutation} from "@tanstack/react-query";
import api, {assetBaseURL} from "@/lib/api";
import {toast} from "react-hot-toast";
import Button from "@/components/button/Button";
import PostForm from "@/app/components/PostForm";
import PostList from "@/app/components/PostList";
import {useRouter} from "next/navigation";
import {ChevronDown, ChevronUp, Edit, Heart, Loader2, MessageSquare, Trash2} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PostItemProps {
    post: Post;
    refetchPosts: () => void;
    currentUser: string | null;
    isDetailView?: boolean;
}

const PostItem: FC<PostItemProps> = ({
                                         post,
                                         refetchPosts,
                                         currentUser,
                                         isDetailView = false
                                     }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newContent, setNewContent] = useState<string>(post.text);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isTruncatable, setIsTruncatable] = useState<boolean>(false);
    const contentRef = useRef<HTMLParagraphElement>(null);

    const router = useRouter();
    const isAuthor = currentUser === post.user.username;

    useEffect(() => {
        if (contentRef.current) {
            const lineHeight = parseInt(
                window.getComputedStyle(contentRef.current).lineHeight
            );
            const maxHeight = lineHeight * 3;
            setIsTruncatable(contentRef.current.scrollHeight > maxHeight);
        }
    }, [post.text]);

    const {mutate: deletePost, isPending: isDeleting} = useMutation({
        mutationFn: async () => {
            return await api.delete(`/post/${post.id}`);
        },
        onSuccess: () => {
            toast.success("Post deleted successfully");
            refetchPosts();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Failed to delete post";
            toast.error(errorMessage);
        }
    });

    const {mutate: updatePost, isPending: isUpdating} = useMutation({
        mutationFn: async (text: string) => {
            return await api.put(`/post/${post.id}`, {text});
        },
        onSuccess: () => {
            toast.success("Post updated successfully");
            setIsEditing(false);
            refetchPosts();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Failed to update post";
            toast.error(errorMessage);
        }
    });

    const {mutate: likePost, isPending: isLikingPost} = useMutation({
        mutationFn: async () => {
            return await api.put(`/likes/${post.id}`);
        },
        onSuccess: () => {
            setIsLiked(true);
            refetchPosts();
        },
        onError: () => {
            unlikePost()
        }
    });

    const {mutate: unlikePost, isPending: isUnlikingPost} = useMutation({
        mutationFn: async () => {
            return await api.delete(`/likes/${post.id}`);
        },
        onSuccess: () => {
            setIsLiked(false);
            refetchPosts();
        },
        onError: () => {
            likePost()
        }
    });

    const isLiking = isLikingPost || isUnlikingPost;

    const handleLike = () => {
        if (isLiked) {
            unlikePost();
        } else {
            likePost();
        }
    };

    const handleSave = (): void => {
        if (newContent.trim() === "") {
            toast.error("Post cannot be empty");
            return;
        }
        updatePost(newContent);
    };

    const handleDelete = (): void => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deletePost();
        }
    };

    const navigateToPostDetail = () => {
        if (!isDetailView) {
            router.push(`/post/${post.id}`);
        }
    };

    const navigateToUserProfile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the post detail navigation
        router.push(`/profile/${post.user.username}`);
    };

    return (
        <div className="post-item border-b border-gray-800 py-4">
            <div className="flex items-start">
                <div className="mr-3 cursor-pointer" onClick={navigateToUserProfile}>
                    {post.user.image_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image
                                src={post.user.image_url.startsWith('http')
                                    ? post.user.image_url
                                    : `${assetBaseURL}/assets/${post.user.image_url}`}
                                alt={post.user.username}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {post.user.name ? post.user.name.charAt(0).toUpperCase() : post.user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center">
                        <p className="font-bold cursor-pointer hover:underline" onClick={navigateToUserProfile}>
                            {post.user.name || post.user.username}
                        </p>
                        <p className="text-gray-500 ml-2 cursor-pointer hover:underline"
                           onClick={navigateToUserProfile}>
                            @{post.user.username}
                        </p>
                        <span className="text-gray-500 mx-1">·</span>
                    </div>

                    {post.parent_id && !isDetailView && (
                        <p className="text-gray-500 text-sm mb-2">
                            Replying to <Link href={`/post/${post.parent_id}`} className="text-blue-400">this
                            tweet</Link>
                        </p>
                    )}

                    <div onClick={navigateToPostDetail} className={isDetailView ? "" : "cursor-pointer"}>
                        {isEditing ? (
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                className="w-full bg-transparent border border-gray-700 rounded-md p-2 mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={4}
                                disabled={isUpdating}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <div>
                                <p
                                    ref={contentRef}
                                    className={`mt-1 ${!isExpanded && isTruncatable && !isDetailView ? "line-clamp-3" : ""}`}
                                >
                                    {post.text}
                                </p>
                                {isTruncatable && !isDetailView && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsExpanded(!isExpanded);
                                        }}
                                        className="text-blue-400 text-sm hover:underline"
                                    >
                                        {isExpanded ? "Show less" : "Show more"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center mt-3 space-x-6" onClick={(e) => e.stopPropagation()}>
                        {isDetailView ? (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="flex items-center text-gray-400 hover:text-blue-400"
                            >
                                <MessageSquare className="w-4 h-4 mr-1"/>
                                {/*<span>{post.total_replies || 0}</span>*/}
                            </button>
                        ) : (
                            <Link
                                href={`/post/${post.id}`}
                                className="flex items-center text-gray-400 hover:text-blue-400"
                            >
                                <MessageSquare className="w-4 h-4 mr-1"/>
                                {/*<span>{post.total_replies || 0}</span>*/}
                            </Link>
                        )}

                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className={`flex items-center ${isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                        >
                            <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`}/>
                            <span>{post.total_likes || 0}</span>
                        </button>

                        {isAuthor && (
                            <>
                                {isEditing ? (
                                    <div className="flex space-x-2">
                                        <Button onClick={handleSave} variant="primary" size="sm" disabled={isUpdating}>
                                            {isUpdating ? "Saving..." : "Save"}
                                        </Button>
                                        <Button onClick={() => setIsEditing(false)} variant="secondary" size="sm"
                                                disabled={isUpdating}>
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            disabled={isDeleting}
                                            className="flex items-center text-gray-400 hover:text-blue-400"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="flex items-center text-gray-400 hover:text-red-500"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-4 h-4 animate-spin"/>
                                            ) : (
                                                <Trash2 className="w-4 h-4"/>
                                            )}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {isDetailView && showReplyForm && (
                        <div className="mt-4">
                            <PostForm refetchPosts={refetchPosts} parentId={post.id}/>
                        </div>
                    )}

                    {!isDetailView && post.replies && post.replies.length > 0 && (
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReplies(!showReplies);
                                }}
                                className="flex items-center text-blue-400 text-sm hover:underline"
                            >
                                {showReplies ? (
                                    <>
                                        <ChevronUp className="w-4 h-4 mr-1"/> Hide replies
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4 mr-1"/> Show {post.replies.length} replies
                                    </>
                                )}
                            </button>

                            {showReplies && (
                                <div className="mt-3 pl-4 border-l border-gray-800">
                                    <PostList
                                        posts={post.replies}
                                        refetchPosts={refetchPosts}
                                        currentUser={currentUser}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostItem;