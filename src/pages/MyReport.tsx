import { useMemo, useState } from "react";
import { getMyReport, getMyReportPdf } from "../services/timeEntriesService";
import type { TimeEntryReportResponse } from "../types/timeEntries";
import styles from "./MyReport.module.css";

function todayAsYYYYMMDD() {
  return new Date().toISOString().slice(0, 10);
}

export function MyReport() {
  const [from, setFrom] = useState<string>(() => todayAsYYYYMMDD());
  const [to, setTo] = useState<string>(() => todayAsYYYYMMDD());
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [report, setReport] = useState<TimeEntryReportResponse | null>(null);

  const sortedEntries = useMemo(() => {
    const entries = report?.entries ?? [];
    return [...entries].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [report]);

  async function handleSearch() {
    setError("");
    setLoading(true);
    try {
      const data = await getMyReport(from, to);
      setReport(data);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao buscar relatório.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenPdf() {
    setError("");
    setPdfLoading(true);
    try {
      const blob = await getMyReportPdf(from, to);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      // opcional: liberar depois de um tempo
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao gerar PDF.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Meu Relatório</h2>
        <p className={styles.subtitle}>
          Selecione o período e visualize seus registros (JSON) ou abra o PDF.
        </p>
      </header>

      <div className={styles.filters}>
        <div className={styles.field}>
          <label>De</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>Até</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        <button className={styles.primaryBtn} onClick={handleSearch} disabled={loading}>
          {loading ? "BUSCANDO..." : "BUSCAR"}
        </button>

        <button
          className={styles.secondaryBtn}
          onClick={handleOpenPdf}
          disabled={pdfLoading}
          title="Abre o PDF em uma nova aba"
        >
          {pdfLoading ? "GERANDO..." : "ABRIR PDF"}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {!report ? (
        <div className={styles.empty}>Nenhum relatório carregado.</div>
      ) : (
        <div className={styles.card}>
          <div className={styles.meta}>
            <span><strong>Período:</strong> {report.from} até {report.to}</span>
            <span><strong>Registros:</strong> {sortedEntries.length}</span>
          </div>

          <div className={styles.table}>
            <div className={styles.rowHeader}>
              <div>Tipo</div>
              <div>Data/Hora (ISO)</div>
            </div>

            {sortedEntries.length === 0 ? (
              <div className={styles.rowEmpty}>Sem registros no período.</div>
            ) : (
              sortedEntries.map((e) => (
                <div key={e.id} className={styles.row}>
                  <div className={styles.badge}>{e.type}</div>
                  <div className={styles.mono}>{e.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}