/* Tipo de dado para as métricas de administração */
export type MetricsPayload = {
    timestamp: number
    activeSessions: number
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

  /* Tipo de dado para a configuração de um card de métrica */
  export type AdminMetricCardConfig = {
    title: string
    wide?: boolean
    render: MetricRender
  }
  
  /* Tipo de dado para a configuração de um grupo de métricas */
  export type AdminMetricGroupProps = {
    metrics: MetricsPayload
    items: AdminMetricCardConfig[]
  }
  
  /* Tipo de dado para a configuração de um card de métrica */
  export type AdminMetricCardProps = {
    title: string
    metrics: MetricsPayload
    wide?: boolean
    render: MetricRender
  }

  /* Tipo de dado para a renderização de um card de métrica */
export type MetricRender = (title: string, metrics: MetricsPayload) => React.ReactNode