import { useNavigate } from 'react-router-dom'
import type { AdminMetricCardConfig } from '../components/admin-metrics.types'
import AdminMetricGroup from '../components/AdminMetricGroup'
import { formatBytes } from '../utils/formatBytesUtil'
import { useAdminMetrics } from '../hooks/useAdminMetrics'
import AlertMessage from '../components/AlertMessage'

export default function AdminPage() {
  const { metrics, error } = useAdminMetrics()
  const navigate = useNavigate()

  /* Métricas gerais */
  const generalItems: AdminMetricCardConfig[] = [
    {
      title: 'Sessões ativas (Redis)',
      render: (_title, m) => <p className="admin-metric-value">{m.activeSessions}</p>,
    },
    {
      title: 'Uso de CPU (processo)',
      render: (_title, m) => (
        <p className="admin-metric-value">{m.cpuPercent.toFixed(1)}%</p>
      ),
    },
  ]
  
  /* Métricas de memória */
  const memoryItems: AdminMetricCardConfig[] = [
    {
      title: 'Heap usado',
      render: (_title, m) => (
        <p className="admin-metric-value">
          {formatBytes(m.memory.heapUsed)} / {formatBytes(m.memory.heapTotal)}
        </p>
      ),
    },
    {
      title: 'RSS',
      render: (_title, m) => (
        <p className="admin-metric-value">{formatBytes(m.memory.rss)}</p>
      ),
    },
    {
      title: 'Sistema',
      render: (_title, m) => (
        <p className="admin-metric-value">
          {formatBytes(m.memory.systemUsed)} / {formatBytes(m.memory.systemTotal)}
        </p>
      ),
    },
  ]
  
  /* Métricas de rede */
  const networkItems: AdminMetricCardConfig[] = [
    {
      title: 'Tráfego recebido',
      render: (_title, m) => (
        <p className="admin-metric-value">
          {m.network ? `${formatBytes(m.network.rxBytesPerSec)}/s` : 'Indisponível'}
        </p>
      ),
    },
    {
      title: 'Tráfego enviado',
      render: (_title, m) => (
        <p className="admin-metric-value">
          {m.network ? `${formatBytes(m.network.txBytesPerSec)}/s` : 'Indisponível'}
        </p>
      ),
    },
  ]

  /* Renderização do componente */
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Painel admin</h1>
        <p className="admin-page-lede">
          Métricas da instância do servidor (WebSocket namespace{' '}
          <code className="admin-inline-code">/admin</code>).
        </p>
      </header>

      {error ? <AlertMessage variant="error">{error}</AlertMessage> : null}

      {metrics ? (
        <ul className="admin-metrics-grid">
            <AdminMetricGroup metrics={metrics} items={generalItems} />
            <AdminMetricGroup metrics={metrics} items={memoryItems} />
            <AdminMetricGroup metrics={metrics} items={networkItems} />
        </ul>
      ) : (
        <p className="admin-loading-text">Carregando métricas…</p>
      )}

      <button
        type="button"
        className="btn-muted"
        onClick={() => navigate('/welcome')}
      >
        Voltar
      </button>
    </div>
  )
}
