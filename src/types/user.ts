export type User = {
    id: string;
    name: string;
    username: string;
    bio: string;
    image_url: string;
};

export type UserResponse = {
    data: User;
};

export type WithToken = {
    token: string;
};
