// src/services/pontoService.ts

const API_URL = 'http://localhost:8080/api/time-entries';

export interface CreateTimeEntryDto {
    userId: string;
}

export const baterPonto = async (dados: CreateTimeEntryDto): Promise<void> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados) 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: Falha ao registrar ponto.`);
    }
};