import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as si from 'systeminformation';

export type AdminMetricsPayload = {
  timestamp: number;
  activeAdminConnections: number;
  cpuPercent: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    systemUsed: number;
    systemTotal: number;
  };
  network: {
    rxBytesPerSec: number;
    txBytesPerSec: number;
  } | null;
};

@Injectable()
export class SystemMetricsService {
  private lastCpuUsage = process.cpuUsage();
  private lastSampleAt = Date.now();

  async sample(activeAdminConnections: number): Promise<AdminMetricsPayload> {
    const now = Date.now();
    const dtSec = Math.max((now - this.lastSampleAt) / 1000, 0.001);
    const cpuDelta = process.cpuUsage(this.lastCpuUsage);
    const cpuUserSec = cpuDelta.user / 1e6;
    const cpuSysSec = cpuDelta.system / 1e6;
    const cpuBusySec = cpuUserSec + cpuSysSec;
    const cpus = Math.max(1, os.cpus().length);
    const cpuPercent = Math.min(
      100,
      (cpuBusySec / dtSec / cpus) * 100,
    );
    this.lastCpuUsage = process.cpuUsage();
    this.lastSampleAt = now;

    const pm = process.memoryUsage();
    const systemTotal = os.totalmem();
    const systemUsed = systemTotal - os.freemem();

    let network: AdminMetricsPayload['network'] = null;
    try {
      const stats = await si.networkStats();
      let rxBytesPerSec = 0;
      let txBytesPerSec = 0;
      for (const row of stats) {
        rxBytesPerSec += row.rx_sec ?? 0;
        txBytesPerSec += row.tx_sec ?? 0;
      }
      network = {
        rxBytesPerSec: Math.max(0, rxBytesPerSec),
        txBytesPerSec: Math.max(0, txBytesPerSec),
      };
    } catch {
      network = null;
    }

    return {
      timestamp: now,
      activeAdminConnections,
      cpuPercent,
      memory: {
        heapUsed: pm.heapUsed,
        heapTotal: pm.heapTotal,
        rss: pm.rss,
        systemUsed,
        systemTotal,
      },
      network,
    };
  }
}
