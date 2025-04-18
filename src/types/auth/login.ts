export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    data: {
        token: string;
    }
};

export type LoginError = {
    error: string;
};
