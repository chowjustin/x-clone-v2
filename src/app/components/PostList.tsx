import {FC} from "react";
import PostItem from "./PostItem";
import {Post} from "@/types/post";

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
    return (
        <div>
            {posts?.length === 0 ? (
                <p className="text-center p-4">No posts yet!</p>
            ) : (
                posts?.map((post) => (
                    !post.is_deleted && (
                        <PostItem
                            key={post.id}
                            post={post}
                            refetchPosts={refetchPosts}
                            currentUser={currentUser}
                        />
                    )
                ))
            )}
        </div>
    );
};

export default PostList;