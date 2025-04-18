import {FC, useState} from "react";
import Button from "@/components/button/Button";
import {useMutation} from "@tanstack/react-query";
import api from "@/lib/api";
import {CreatePostRequest} from "@/types/post";
import {toast} from "react-hot-toast";
import {Loader2} from "lucide-react";

interface PostFormProps {
    refetchPosts: () => void;
    parentId?: number;
}

const PostForm: FC<PostFormProps> = ({refetchPosts, parentId}) => {
    const [content, setContent] = useState<string>("");

    const {mutate, isPending} = useMutation({
        mutationFn: async (data: CreatePostRequest) => {
            const res = await api.post("/post", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success(parentId ? "Reply posted successfully!" : "Post created successfully!");
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
        <div className="bg-transparent rounded-lg">
            <div className="text-md py-4 text-white text-center font-semibold">
                {parentId ? "Write a reply" : "What's happening?"}
            </div>
            <form onSubmit={handleSubmit} className="px-4 pb-2 border-b border-gray-700">
                <textarea
                    placeholder={parentId ? "Tweet your reply" : "Share your thoughts..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent border text-white border-gray-700 rounded-lg p-3 min-h-[150px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={isPending}
                />
                <div className="flex justify-end mt-2">
                    <Button type="submit" variant="primary" size="sm" disabled={isPending} className="mb-4">
                        {isPending ? (
                            <span className="flex items-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                {parentId ? "Replying..." : "Posting..."}
                            </span>
                        ) : (
                            parentId ? "Reply" : "Tweet"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;