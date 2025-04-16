"use client";

import {useEffect, useState} from "react";
import PostForm from "@/app/components/PostForm";
import PostList from "@/app/components/PostList";
import NextImage from "@/components/NextImage";
import Button from "@/components/button/Button";

interface Post {
    id: number;
    content: string;
    likes: number;
    likedBy: string[];
    author: string;
    createdAt: string;
}

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]") as Post[];
        const storedUser = JSON.parse(sessionStorage.getItem("user") || "null") as string | null;

        const fixedPosts = storedPosts.map((post) => ({
            ...post,
            likedBy: post.likedBy || [],
        }));

        setPosts(fixedPosts);
        setUser(storedUser);
    }, []);

    const savePosts = (data: Post[]): void => {
        localStorage.setItem("posts", JSON.stringify(data));
    };

    const logout = (): void => {
        setUser(null);
        sessionStorage.removeItem("user");
    };

    const addPost = (content: string): void => {
        if (!user) return alert("You must log in to post!");
        const newPost: Post = {
            id: Date.now(),
            content,
            likes: 0,
            likedBy: [],
            author: user,
            createdAt: new Date().toISOString(),
        };
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        savePosts(updatedPosts);
    };

    const deletePost = (id: number): void => {
        const updatedPosts = posts.filter((post) => post.id !== id);
        setPosts(updatedPosts);
        savePosts(updatedPosts);
    };

    const toggleLike = (id: number): void => {
        if (!user) return;

        const updatedPosts = posts.map((post) => {
            if (post.id === id) {
                const alreadyLiked = post.likedBy.includes(user);
                return {
                    ...post,
                    likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
                    likedBy: alreadyLiked
                        ? post.likedBy.filter((u) => u !== user)
                        : [...post.likedBy, user],
                };
            }
            return post;
        });
        setPosts(updatedPosts);
        savePosts(updatedPosts);
    };

    const editPost = (id: number, newContent: string): void => {
        const updatedPosts = posts.map((post) =>
            post.id === id && post.author === user
                ? {...post, content: newContent}
                : post
        );
        setPosts(updatedPosts);
        savePosts(updatedPosts);
    };

    return (
        <section className="app-section">
            <div className="app-container">
                <div className="sidebar-left">
                    <NextImage
                        src="/left-open.png"
                        alt="left"
                        width={300}
                        height={300}
                        className="sidebar-img-large"
                    />
                    <NextImage
                        src="/left-close.png"
                        alt="left"
                        width={300}
                        height={300}
                        className="sidebar-img-small"
                    />
                </div>
                <div className="main-content">
                    <PostForm addPost={addPost}/>
                    <PostList
                        posts={posts}
                        deletePost={deletePost}
                        toggleLike={toggleLike}
                        editPost={editPost}
                        user={user}
                    />
                </div>
                <div className="sidebar-right">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                    />
                    <div className="user-info">
                        <p className="username">
                            <strong>@{user}</strong>
                        </p>
                        <Button onClick={logout} variant="primary" size="sm">
                            Logout
                        </Button>
                    </div>
                    <NextImage
                        src="/whotofollow.png"
                        alt="follow"
                        width={300}
                        height={300}
                        className="follow-img"
                    />
                </div>
            </div>
        </section>
    );
}