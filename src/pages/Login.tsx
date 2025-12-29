import { useState } from 'react';
import { login } from '../services/authService';

export function Login() {
  const [email, setEmail] = useState(''); // Mudamos de username para email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar erros na tela

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Limpa erros antigos

    try {
      // Chama o backend
      const response = await login({ email, password });
      
      console.log("Login com sucesso!", response);
      
      // Salva o token no navegador (LocalStorage) para usar depois
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      alert(`Bem-vindo, ${response.user.name}! (Token salvo)`);
      
      // Futuramente aqui vamos redirecionar para a Home
      
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao entrar. Verifique email e senha.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Acesso ao BatPonto</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="exemplo@email.com"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label htmlFor="pass">Senha:</label>
          <input 
            id="pass"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Digite sua senha"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {errorMessage && <span style={{color: 'red', fontSize: '14px'}}>{errorMessage}</span>}

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Entrar
        </button>

      </form>
    </div>
  );
}