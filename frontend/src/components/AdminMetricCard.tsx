import type { AdminMetricCardProps as AdminMetricCardPropsType } from './admin-metrics.types';

/* Componente AdminMetricCard */
export default function AdminMetricCard({ title, metrics, wide = false, render }: AdminMetricCardPropsType) {
    /* Renderização do componente */
    return (
      <li className={`admin-metric-card ${wide ? 'admin-metric-card--wide' : ''}`.trim()}>
        <p className="admin-metric-label">{title}</p>
        {render(title, metrics)}
      </li>
    )
  }
