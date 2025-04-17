import {FC, useEffect, useRef, useState} from "react";
import {Post} from "@/types/post";
import {useMutation} from "@tanstack/react-query";
import api from "@/lib/api";
import {toast} from "react-hot-toast";
import Button from "@/components/button/Button";
import PostForm from "@/app/components/PostForm";
import PostList from "@/app/components/PostList";

interface PostItemProps {
    post: Post;
    refetchPosts: () => void;
    currentUser: string | null;
}

const timeAgo = (timestamp: string): string => {
    const postTime = new Date(timestamp);
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - postTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) {
        return "Just now";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInMinutes < 1440) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else {
        const diffInDays = Math.floor(diffInMinutes / 1440);
        return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }
};

const PostItem: FC<PostItemProps> = ({
                                         post,
                                         refetchPosts,
                                         currentUser
                                     }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newContent, setNewContent] = useState<string>(post.text);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isTruncatable, setIsTruncatable] = useState<boolean>(false);
    const contentRef = useRef<HTMLParagraphElement>(null);

    const isAuthor = currentUser === post.user.username;

    // // Check if post is liked by current user (will need to be updated once API provides this info)
    // useEffect(() => {
    //     // This is a placeholder for actual implementation
    //     // You'll need to update this when the API provides information about whether a post is liked by the current user
    //     const checkIfLiked = async () => {
    //         try {
    //             const response = await api.get(`/likes/check/${post.id}`);
    //             setIsLiked(response.data.isLiked);
    //         } catch (error) {
    //             // Silently fail - not critical functionality
    //             setIsLiked(false);
    //         }
    //     };
    //
    //     if (currentUser) {
    //         checkIfLiked();
    //     }
    // }, [post.id, currentUser]);

    useEffect(() => {
        if (contentRef.current) {
            const lineHeight = parseInt(
                window.getComputedStyle(contentRef.current).lineHeight
            );
            const maxHeight = lineHeight * 3;
            setIsTruncatable(contentRef.current.scrollHeight > maxHeight);
        }
    }, [post.text]);

    // Delete post mutation
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

    // Update post mutation
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

    // Like post mutation
    const {mutate: likePost, isPending: isLikingPost} = useMutation({
        mutationFn: async () => {
            return await api.put(`/likes/${post.id}`);
        },
        onSuccess: () => {
            setIsLiked(true);
            refetchPosts();
        },
        onError: (error: any) => {
            unlikePost()
        }
    });

    // Unlike post mutation
    const {mutate: unlikePost, isPending: isUnlikingPost} = useMutation({
        mutationFn: async () => {
            return await api.delete(`/likes/${post.id}`);
        },
        onSuccess: () => {
            setIsLiked(false);
            refetchPosts();
        },
        onError: (error: any) => {
            likePost()
        }
    });

    const isLiking = isLikingPost || isUnlikingPost;

    const handleLike = () => {
        if (!currentUser) {
            toast.error("You must be logged in to like posts");
            return;
        }

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

    return (
        <div className="post-item">
            <p className="post-header">
                <strong>@{post.user.username}</strong>{" "}
                {/*<span className="post-time">{post.createdAt ? timeAgo(post.createdAt) : "Recently"}</span>*/}
            </p>

            {isEditing ? (
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="post-edit-textarea"
                    disabled={isUpdating}
                />
            ) : (
                <div>
                    <p
                        ref={contentRef}
                        className={`post-content ${
                            !isExpanded && isTruncatable ? "truncated" : ""
                        }`}
                    >
                        {post.text}
                    </p>
                    {isTruncatable && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="show-more-button"
                        >
                            {isExpanded ? "Show less" : "Show more"}
                        </button>
                    )}
                </div>
            )}

            <div className="post-actions">
                {isEditing ? (
                    <>
                        <Button onClick={handleSave} variant="primary" size="sm" disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save"}
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="secondary" size="sm" disabled={isUpdating}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <button onClick={handleLike} disabled={isLiking}>
                            {isLiked ? "❤️" : "🤍"} {post.total_likes || 0}
                        </button>

                        <button onClick={() => setShowReplyForm(!showReplyForm)}>
                            💬 Reply
                        </button>

                        {post.replies && post.replies.length > 0 && (
                            <button onClick={() => setShowReplies(!showReplies)}>
                                {showReplies ? "Hide replies" : `Show replies (${post.replies.length})`}
                            </button>
                        )}

                        {isAuthor && (
                            <>
                                <button onClick={() => setIsEditing(true)} disabled={isDeleting}>
                                    ✏️ Edit
                                </button>
                                <button onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "🗑️ Delete"}
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>

            {showReplyForm && (
                <div className="reply-form-container">
                    <PostForm refetchPosts={refetchPosts} parentId={post.id}/>
                </div>
            )}

            {showReplies && post.replies && post.replies.length > 0 && (
                <div className="replies-container">
                    <PostList
                        posts={post.replies}
                        refetchPosts={refetchPosts}
                        currentUser={currentUser}
                    />
                </div>
            )}
        </div>
    );
};

export default PostItem;