export interface Post {
    id: number;
    content: string;
    likes: number;
    likedBy: string[];
    author: string;
    createdAt: string;
}