export type User = {
    id: string;
    name: string;
    username: string;
    bio: string | null;
    image_url: string | null;
};

export type UserResponse = {
    data: User;
};

export type WithToken = {
    token: string;
};
