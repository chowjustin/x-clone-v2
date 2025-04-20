import {useMutation} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import api from "@/lib/api";

export const useDeletePostMutation = (refetchPosts: () => void) => {
    return useMutation({
        mutationFn: async (postId: string) => {
            return await api.delete(`/post/${postId}`);
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
};