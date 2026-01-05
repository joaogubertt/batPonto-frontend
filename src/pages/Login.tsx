import { useState } from 'react';
import { login } from '../services/authService';
import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      onLoginSuccess();

    } catch (error: any) {
      console.error(error);
      setErrorMessage("Credenciais inválidas. Verifique seu usuário e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Nova imagem com logo completo */}
      <img src="/src/assets/bat-hero.png" alt="BatPonto RH" className={styles.logoImage} />
      
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Acesso ao Sistema</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>E-mail Corporativo</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="nome@empresa.com"
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="pass" className={styles.label}>Senha</label>
            <input 
              id="pass"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Digite sua senha"
              required
              className={styles.inputField}
            />
          </div>

          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>

        </form>
      </div>
      
      <footer style={{ marginTop: '20px', color: '#8890a5', fontSize: '0.8rem' }}>
        &copy; {new Date().getFullYear()} BatPonto - Gestão de Recursos Humanos
      </footer>
    </div>
  );
}