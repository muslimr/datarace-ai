export interface IRegisterRequest {
    email: string;
    password: string;
}

export type RegisterResponse = string

export interface ILoginRequest {
    emailOrNickname: string;
    password: string;
    rememberMe?: boolean;
}


export type LoginResponse = string


export interface IUser {
    id: number | string,
    fullName: string,
    profileImage?: string,
    profileFileId?: number | string,
    nickname?: string,
    email?: string,
    phoneNumber?: string,
    acceptNotification?: boolean,
    message?: string,
}

export interface IActivateUserResponse {
    error?: string;
    message?: string;
}

