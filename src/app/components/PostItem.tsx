import { useState, useEffect, useRef, FC } from "react";

interface Post {
    id: number;
    content: string;
    likes: number;
    likedBy: string[];
    author: string;
    createdAt: string;
}

interface PostItemProps {
    post: Post;
    deletePost: (id: number) => void;
    toggleLike: (id: number) => void;
    editPost: (id: number, newContent: string) => void;
    user: string | null;
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
    } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }
};

const PostItem: FC<PostItemProps> = ({
                                         post,
                                         deletePost,
                                         toggleLike,
                                         editPost,
                                         user
                                     }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newContent, setNewContent] = useState<string>(post.content);

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isTruncatable, setIsTruncatable] = useState<boolean>(false);
    const contentRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const lineHeight = parseInt(
                window.getComputedStyle(contentRef.current).lineHeight
            );
            const maxHeight = lineHeight * 3;
            setIsTruncatable(contentRef.current.scrollHeight > maxHeight);
        }
    }, [post.content]);

    const handleSave = (): void => {
        editPost(post.id, newContent);
        setIsEditing(false);
    };

    return (
        <div className="post-item">
            <p className="post-header">
                <strong>@{post.author}</strong>{" "}
                <span className="post-time">{timeAgo(post.createdAt)}</span>
            </p>

            {isEditing ? (
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="post-edit-textarea"
                />
            ) : (
                <div>
                    <p
                        ref={contentRef}
                        className={`post-content ${
                            !isExpanded && isTruncatable ? "truncated" : ""
                        }`}
                    >
                        {post.content}
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
                    <button onClick={handleSave} className="blue-button">
                        Save
                    </button>
                ) : (
                    <>
                        <button onClick={() => toggleLike(post.id)}>
                            {user && post.likedBy.includes(user) ? "❤️" : "🤍"} {post.likes}
                        </button>

                        {user === post.author && (
                            <>
                                <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
                                <button onClick={() => deletePost(post.id)}>🗑️ Delete</button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PostItem;