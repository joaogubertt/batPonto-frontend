// Note a palavra 'type' depois do import
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    // Altere a porta 8080 se o seu Spring estiver em outra porta
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        // Se der erro (ex: 401), lançamos uma exceção para o componente tratar
        throw new Error('Falha no login: Verifique suas credenciais');
    }

    return await response.json();
};