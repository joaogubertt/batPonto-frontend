export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserSummary {
    id: string;
    name: string;
    role: string;
}

export interface LoginResponse {
    accessToken: string; 
    tokenType: string;
    expiresIn: number;
    user: UserSummary;
}