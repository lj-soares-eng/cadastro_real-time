import AdminMetricCard from './AdminMetricCard';
import type { AdminMetricGroupProps } from './admin-metrics.types';

/* Componente AdminMetricGroup */
export default function AdminMetricGroup({ metrics, items }: AdminMetricGroupProps) {
    /* Renderização do componente */
    return (
      <>
        {items.map((item) => (
          <AdminMetricCard
            key={item.title}
            title={item.title}
            metrics={metrics}
            wide={item.wide}
            render={item.render}
          />
        ))}
      </>
    )
  }
