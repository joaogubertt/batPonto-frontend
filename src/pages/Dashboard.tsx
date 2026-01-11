import { useState, useEffect } from 'react';
import { baterPonto } from '../services/pontoService';
import type { CreateTimeEntryDto } from '../services/pontoService';
import type { UserSummary } from '../types/auth';
import { MyReport } from './MyReport';
import styles from './Dashboard.module.css';

type Tab = 'PONTO' | 'RELATORIO';

export function Dashboard() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('PONTO');

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
    if (!confirm('Deseja confirmar o registro de ponto agora?')) return;

    if (!user || !user.id) {
      alert('Erro: Utilizador não identificado. Por favor, faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      const dto: CreateTimeEntryDto = {
        userId: user.id,
      };

      console.log('A enviar para a API:', dto);

      await baterPonto(dto);
      alert('Ponto registrado com sucesso!');
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

      {/* Tabs (inline styles para não depender de CSS novo agora) */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTab('PONTO')}
          disabled={activeTab === 'PONTO'}
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.18)',
            background: activeTab === 'PONTO' ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: 'inherit',
            cursor: activeTab === 'PONTO' ? 'default' : 'pointer',
            fontWeight: 700,
          }}
        >
          Bater Ponto
        </button>

        <button
          onClick={() => setActiveTab('RELATORIO')}
          disabled={activeTab === 'RELATORIO'}
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.18)',
            background: activeTab === 'RELATORIO' ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: 'inherit',
            cursor: activeTab === 'RELATORIO' ? 'default' : 'pointer',
            fontWeight: 700,
          }}
        >
          Meu Relatório
        </button>
      </div>

      <main className={styles.mainContent}>
        {activeTab === 'PONTO' ? (
          <>
            <div className={styles.clockContainer}>
              <div className={styles.clockLabel}>Hora Atual</div>
              <div className={styles.clockText}>{horaAtual}</div>
            </div>

            <button
              onClick={handleBaterPonto}
              disabled={loading}
              className={styles.actionButton}
            >
              {loading ? 'REGISTRANDO...' : 'BATER PONTO'}
            </button>
          </>
        ) : (
          <MyReport />
        )}
      </main>
    </div>
  );
}