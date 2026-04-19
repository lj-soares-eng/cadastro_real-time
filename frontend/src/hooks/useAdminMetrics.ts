import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { apiBase } from '../api/client'
import { fetchMe } from '../api/auth'
import type { MetricsPayload } from '../components/admin-metrics.types'

export function useAdminMetrics() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<MetricsPayload | null>(null)

  useEffect(() => {
    let socket: Socket | null = null
    let cancelled = false

    void fetchMe()
      .then((me) => {
        if (cancelled) return

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
        if (!cancelled) navigate('/login', { replace: true })
      })

    return () => {
      cancelled = true
      socket?.disconnect()
    }
  }, [navigate])

  return { metrics, error }
}