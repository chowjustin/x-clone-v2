import {FC, useState} from "react";
import Button from "@/components/button/Button";
import {useMutation} from "@tanstack/react-query";
import api from "@/lib/api";
import {CreatePostRequest} from "@/types/post";
import {toast} from "react-hot-toast";

interface PostFormProps {
    refetchPosts: () => void;
    parentId?: number; // Optional for creating replies
}

const PostForm: FC<PostFormProps> = ({refetchPosts, parentId}) => {
    const [content, setContent] = useState<string>("");

    const {mutate, isPending} = useMutation({
        mutationFn: async (data: CreatePostRequest) => {
            const res = await api.post("/post", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Post created successfully!");
            setContent("");
            refetchPosts();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Failed to create post";
            toast.error(errorMessage);
        }
    });

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (content.trim() === "") {
            toast.error("Post cannot be empty!");
            return;
        }

        const postData: CreatePostRequest = {
            text: content
        };

        if (parentId) {
            postData.parent_id = parentId;
        }

        mutate(postData);
    };

    return (
        <section className="post-form-section">
            <div className="post-form-header">{parentId ? "Write a reply" : "For You"}</div>
            <form onSubmit={handleSubmit} className="post-form">
                <textarea
                    placeholder={parentId ? "Tweet your reply" : "What's happening?"}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="post-textarea"
                    disabled={isPending}
                />
                <hr className="post-divider"/>
                <Button type="submit" size="sm" disabled={isPending}>
                    {isPending ? "Posting..." : parentId ? "Reply" : "Tweet"}
                </Button>
            </form>
        </section>
    );
};

export default PostForm;