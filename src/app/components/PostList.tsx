import { FC } from "react";
import PostItem from "./PostItem";

interface Post {
    id: number;
    content: string;
    likes: number;
    likedBy: string[];
    author: string;
    createdAt: string;
}

interface PostListProps {
    posts: Post[];
    deletePost: (id: number) => void;
    toggleLike: (id: number) => void;
    editPost: (id: number, newContent: string) => void;
    user: string | null;
}

const PostList: FC<PostListProps> = ({
                                         posts,
                                         deletePost,
                                         toggleLike,
                                         editPost,
                                         user
                                     }) => {
    return (
        <div>
            {posts.length === 0 ? (
                <p>No posts yet!</p>
            ) : (
                posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        deletePost={deletePost}
                        toggleLike={toggleLike}
                        editPost={editPost}
                        user={user}
                    />
                ))
            )}
        </div>
    );
};

export default PostList;