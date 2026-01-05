// Note a palavra 'type' depois do import
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Falha no login: Verifique suas credenciais');
    }

    return await response.json();
};