export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserSummary {
    id: string; // UUID no Java vira String no JS
    name: string;
    role: string; // 'ADMIN' ou 'USER'
}

export interface LoginResponse {
    accessToken: string; // Nome exato do campo no Record Java
    tokenType: string;
    expiresIn: number;
    user: UserSummary;
}