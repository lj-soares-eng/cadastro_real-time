import { useEffect } from 'react'
import { io, type Socket } from 'socket.io-client'
import { fetchMe, sendSessionCloseBeacon } from '../api/auth'
import { apiBase } from '../api/client'

const HEARTBEAT_MS = 20_000

/* Mantém sessão web viva no Redis por heartbeat WS. */
export default function SessionHeartbeat() {
  useEffect(() => {
    let socket: Socket | null = null
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null
    let disposed = false

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sendSessionCloseBeacon()
      }
    }
    const handlePageHide = () => {
      sendSessionCloseBeacon()
    }

    void fetchMe()
      .then(() => {
        if (disposed) {
          return
        }
        const base = apiBase().replace(/\/$/, '')
        socket = io(`${base}/session`, {
          path: '/socket.io/',
          withCredentials: true,
          transports: ['websocket', 'polling'],
        })

        socket.on('connect', () => {
          socket?.emit('session:heartbeat')
        })

        heartbeatTimer = setInterval(() => {
          socket?.emit('session:heartbeat')
        }, HEARTBEAT_MS)
      })
      .catch(() => {
        /* Sem sessão autenticada, não abre canal de heartbeat. */
      })

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      disposed = true
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer)
      }
      socket?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [])

  return null
}
