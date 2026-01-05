import { useState, useEffect } from 'react';
import { baterPonto } from '../services/pontoService';
import type { CreateTimeEntryDto } from '../services/pontoService';
import type { UserSummary } from '../types/auth';
import styles from './Dashboard.module.css'; // Importação do CSS Module

export function Dashboard() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      setUser(JSON.parse(userStored));
    }

    const intervalId = setInterval(() => {
      setHoraAtual(new Date().toLocaleTimeString());
    }, 1000);

    
    return () => clearInterval(intervalId);
  }, []);

  const handleBaterPonto = async () => {
    if (!confirm("Deseja confirmar o registo de ponto agora?")) return;

    if (!user || !user.id) {
        alert("Erro: Utilizador não identificado. Por favor, faça login novamente.");
        return;
    }

    setLoading(true);
    try {
      const dto: CreateTimeEntryDto = {
          userId: user.id
      };

      console.log("A enviar para a API:", dto);

      await baterPonto(dto);
      alert('Ponto registado com sucesso!');
      
    } catch (error: any) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload(); 
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        {/* <img src="/src/assets/logo-silhouette.png" alt="BatPonto Logo" className={styles.logoHeader} /> */}
        
        <div className={styles.welcomeText}>
            Olá, <span className={styles.userName}>{user?.name}</span>
        </div>
        
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.clockContainer}>
            <div className={styles.clockLabel}>Hora Atual</div>
            <div className={styles.clockText}>
            {horaAtual}
            </div>
        </div>

        <button 
          onClick={handleBaterPonto}
          disabled={loading}
          className={styles.actionButton}
        >
          {loading ? 'REGISTANDO...' : 'BATER PONTO'}
        </button>
      </main>
    </div>
  );
}