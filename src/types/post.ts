import {User} from "@/types/user"

export interface Post {
    id: number;
    text: string;
    total_likes: number;
    parent_id: number | null;
    is_deleted: boolean;
    user: User;
    replies?: Post[];
}

export interface CreatePostRequest {
    text: string;
    parent_id?: number;
}

export interface LikePostRequest {
    post_id: number;
}

export interface UpdatePostRequest {
    text: string;
}

export interface PostsQueryParams {
    page?: number;
    per_page?: number;
}