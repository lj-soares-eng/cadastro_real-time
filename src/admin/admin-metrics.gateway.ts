import { Logger, OnModuleDestroy } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import { AdminSocketAuthService } from './admin-socket-auth.service';
import { SystemMetricsService } from './system-metrics.service';

const METRICS_INTERVAL_MS = 1000;

function adminCorsOrigin(): string {
  return process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
}

@WebSocketGateway({
  namespace: '/admin',
  cors: {
    origin: adminCorsOrigin(),
    credentials: true,
  },
})
export class AdminMetricsGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleDestroy
{
  private readonly logger = new Logger(AdminMetricsGateway.name);
  private metricsInterval?: ReturnType<typeof setInterval>;
  private activeAdminSessions = 0;

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly adminSocketAuth: AdminSocketAuthService,
    private readonly systemMetrics: SystemMetricsService,
  ) {}

  afterInit(server: Server): void {
    this.metricsInterval = setInterval(() => {
      void this.emitMetrics(server);
    }, METRICS_INTERVAL_MS);
  }

  onModuleDestroy(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }

  private async emitMetrics(server: Server): Promise<void> {
    try {
      const payload = await this.systemMetrics.sample(
        this.activeAdminSessions,
      );
      server.emit('metrics', payload);
    } catch (err) {
      this.logger.warn(
        `Falha ao emitir métricas: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async handleConnection(client: Socket): Promise<void> {
    const ok = await this.adminSocketAuth.verifyAdminSocket(client);
    if (!ok) {
      client.disconnect(true);
      return;
    }
    client.data.adminMetricsSession = true as const;
    this.activeAdminSessions += 1;
  }

  handleDisconnect(client: Socket): void {
    if (client.data.adminMetricsSession) {
      this.activeAdminSessions = Math.max(0, this.activeAdminSessions - 1);
    }
  }
}
