"use client";

import React, {useEffect, useRef, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import api, {assetBaseURL} from "@/lib/api";
import Button from "@/components/button/Button";
import withAuth from "@/components/hoc/withAuth";
import Image from "next/image";
import {ArrowLeft, Camera, Loader2} from "lucide-react";
import {toast} from "react-hot-toast";
import useAuthStore from "@/app/stores/useAuthStore";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default withAuth(ProfilePage, true);

function ProfilePage() {
    const {user: storeUser, setUser: setStoreUser, logout: logoutStore} = useAuthStore();
    const [name, setName] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (storeUser) {
            setName(storeUser.name || "");
            setBio(storeUser.bio || "");
            if (storeUser.image_url) {
                if (storeUser.image_url.startsWith('http')) {
                    setImagePreview(storeUser.image_url);
                } else {
                    setImagePreview(`${assetBaseURL}/assets/${storeUser.image_url}`);
                }
            }
        }
    }, [storeUser]);

    const {mutate: updateProfile, isPending: isUpdating} = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await api.patch("/user/update", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Profile updated successfully");

            if (storeUser) {
                setStoreUser({
                    ...storeUser,
                    name: data.data.name,
                    bio: data.data.bio,
                    image_url: data.data.image_url,
                });
            }
            router.push("/")
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Failed to update profile";
            toast.error(errorMessage);
        },
    });

    const logout = (): void => {
        logoutStore();
        router.push('/login');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);

        if (bio !== null) {
            formData.append("bio", bio);
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }

        updateProfile(formData);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex items-center mb-6">
                    <Link href="/" className="mr-4">
                        <ArrowLeft className="w-6 h-6"/>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                            {imagePreview ? (
                                <div className="w-32 h-32 rounded-full overflow-hidden">
                                    <Image
                                        src={imagePreview}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="object-cover w-full h-full"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                                      <span className="text-2xl font-bold">
                                        {storeUser?.name ? storeUser.name.charAt(0).toUpperCase() : "U"}
                                      </span>
                                </div>
                            )}

                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8"/>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <button
                            type="button"
                            onClick={triggerFileInput}
                            className="mt-2 text-blue-400 text-sm cursor-pointer hover:underline"
                        >
                            Change profile photo
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-transparent border border-gray-700 rounded-md p-3 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={storeUser?.username || ""}
                                className="bg-transparent border border-gray-700 rounded-md p-3 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500"
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium mb-1">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="bg-transparent border border-gray-700 rounded-md p-3 w-full min-h-[100px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Tell people about yourself"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full py-2"
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                Saving...
                            </span>
                        ) : (
                            "Save Profile"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        size="md"
                        className="w-full py-2 -mt-2"
                        onClick={logout}
                    >
                        Log Out
                    </Button>
                </form>
            </div>
        </div>
    );
}

