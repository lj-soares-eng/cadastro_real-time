import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { apiBase } from '../api/client'
import { fetchMe } from '../api/auth'
import AlertMessage from '../components/AlertMessage'

type MetricsPayload = {
  timestamp: number
  activeAdminConnections: number
  cpuPercent: number
  memory: {
    heapUsed: number
    heapTotal: number
    rss: number
    systemUsed: number
    systemTotal: number
  }
  network: { rxBytesPerSec: number; txBytesPerSec: number } | null
}

function formatBytes(n: number): string {
  if (n < 1024) {
    return `${Math.round(n)} B`
  }
  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(1)} KB`
  }
  if (n < 1024 * 1024 * 1024) {
    return `${(n / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<MetricsPayload | null>(null)

  useEffect(() => {
    let socket: Socket | null = null
    let cancelled = false

    void fetchMe()
      .then((me) => {
        if (cancelled) {
          return
        }
        if (me.role !== 'ADMIN') {
          navigate('/welcome', { replace: true })
          return
        }
        const base = apiBase()
        socket = io(`${base.replace(/\/$/, '')}/admin`, {
          path: '/socket.io/',
          withCredentials: true,
          transports: ['websocket', 'polling'],
        })
        socket.on('connect_error', () => {
          setError('Não foi possível conectar ao painel em tempo real.')
        })
        socket.on('metrics', (payload: MetricsPayload) => {
          setMetrics(payload)
        })
      })
      .catch(() => {
        if (!cancelled) {
          navigate('/login', { replace: true })
        }
      })

    return () => {
      cancelled = true
      socket?.disconnect()
    }
  }, [navigate])

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">Painel admin</h1>
        <p className="text-sm text-slate-600">
          Métricas da instância do servidor (WebSocket namespace{' '}
          <code className="rounded bg-slate-100 px-1">/admin</code>).
        </p>
      </header>

      {error ? <AlertMessage variant="error">{error}</AlertMessage> : null}

      {metrics ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Conexões admin (WS)
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {metrics.activeAdminConnections}
            </p>
          </li>
          <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Uso de CPU (processo)
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {metrics.cpuPercent.toFixed(1)}%
            </p>
          </li>
          <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Memória
            </p>
            <dl className="mt-2 grid gap-2 text-sm text-slate-800 sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Heap usado</dt>
                <dd className="font-medium">
                  {formatBytes(metrics.memory.heapUsed)} /{' '}
                  {formatBytes(metrics.memory.heapTotal)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">RSS</dt>
                <dd className="font-medium">{formatBytes(metrics.memory.rss)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Sistema</dt>
                <dd className="font-medium">
                  {formatBytes(metrics.memory.systemUsed)} /{' '}
                  {formatBytes(metrics.memory.systemTotal)}
                </dd>
              </div>
            </dl>
          </li>
          <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tráfego de rede (agregado)
            </p>
            {metrics.network ? (
              <dl className="mt-2 grid gap-2 text-sm text-slate-800 sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Recebido</dt>
                  <dd className="font-medium">
                    {formatBytes(metrics.network.rxBytesPerSec)}/s
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Enviado</dt>
                  <dd className="font-medium">
                    {formatBytes(metrics.network.txBytesPerSec)}/s
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Métricas de rede indisponíveis neste ambiente.
              </p>
            )}
          </li>
        </ul>
      ) : (
        <p className="text-sm text-slate-600">Carregando métricas…</p>
      )}

      <button
        type="button"
        className="self-start text-sm text-slate-600 underline hover:text-slate-900"
        onClick={() => navigate('/welcome')}
      >
        Voltar
      </button>
    </div>
  )
}
