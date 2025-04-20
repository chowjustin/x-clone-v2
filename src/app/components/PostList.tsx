import * as React from "react";
import {FC} from "react";
import PostItem from "./PostItem";
import {Post} from "@/types/post";
import {Loader2, Trash2} from "lucide-react";
import {useDeletePostMutation} from "@/app/hooks/useDeletePostMutation";

interface PostListProps {
    posts: Post[];
    refetchPosts: () => void;
    currentUser: string | null;
}

const PostList: FC<PostListProps> = ({
                                         posts,
                                         refetchPosts,
                                         currentUser
                                     }) => {
    const [draggedPostId, setDraggedPostId] = React.useState<string | null>(null);
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);

    const {mutate: deletePost, isPending: isDeleting} = useDeletePostMutation(refetchPosts);

    const handleDragStart = (postId: string) => {
        const post = posts.find(p => p.id.toString() === postId);
        if (post && post.user.username === currentUser) {
            setDraggedPostId(postId);
            setIsDragging(true);
        }
    };

    const handleDragEnd = () => {
        setDraggedPostId(null);
        setIsDragOver(false);
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        setIsDragging(false);

        if (draggedPostId) {
            const postToDelete = posts.find(post => post.id.toString() === draggedPostId);
            if (postToDelete && postToDelete.user.username === currentUser) {
                deletePost(draggedPostId);
            }
        }

        setDraggedPostId(null);
    };

    return (
        <div className="relative">
            <div className="">
                {posts?.length === 0 ? (
                    <p className="text-center p-4">No posts yet!</p>
                ) : (
                    posts?.map((post) => (
                        !post.is_deleted && (
                            <div
                                key={post.id}
                                draggable={post.user.username === currentUser}
                                onDragStart={() => handleDragStart(post.id.toString())}
                                onDragEnd={handleDragEnd}
                                className={post.user.username === currentUser ? "cursor-grab active:cursor-grabbing" : ""}
                            >
                                <PostItem
                                    post={post}
                                    refetchPosts={refetchPosts}
                                    currentUser={currentUser}
                                />
                            </div>
                        )
                    ))
                )}
            </div>

            {draggedPostId && (
                <div
                    className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-lg ${
                        isDragOver
                            ? "bg-red-600 scale-110"
                            : "bg-red-500"
                    } transition-all duration-200`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {isDeleting ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin"/>
                    ) : (
                        <Trash2 className={`w-6 h-6 text-white ${
                            isDragOver ? "scale-125" : "scale-100"
                        } ${
                            isDragging && "animate-pulse"
                        } transition-transform duration-200`}/>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostList;