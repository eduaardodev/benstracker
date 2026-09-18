import { Router, Request, Response } from 'express';
import { sqliteDb } from '../db/database';
import { ENV } from '../config/env.config';

export const healthRouter = Router();

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

/**
 * GET /api/health
 * Health check detalhado para monitoramento de disponibilidade, banco de dados e recursos de sistema.
 */
healthRouter.get('/health', async (_req: Request, res: Response) => {
  const startDbCheck = performance.now();
  let dbHealthy = false;
  let dbError: string | null = null;

  try {
    // Teste de conectividade e integridade do banco de dados relacional
    const dbTest = sqliteDb.prepare('SELECT 1 as status;').get() as { status?: number } | undefined;
    if (dbTest && dbTest.status === 1) {
      dbHealthy = true;
    } else {
      dbError = 'Resposta inesperada na verificação de banco de dados';
    }
  } catch (err: any) {
    dbHealthy = false;
    dbError = err?.message || 'Falha de comunicação com o banco de dados';
  }

  const dbLatencyMs = Math.round((performance.now() - startDbCheck) * 100) / 100;
  const memory = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const overallStatus = dbHealthy ? 'healthy' : 'degraded';
  const statusCode = dbHealthy ? 200 : 503;

  res.status(statusCode).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptimeSeconds,
      formatted: formatUptime(uptimeSeconds),
    },
    service: 'benstracker-backend',
    environment: ENV.NODE_ENV,
    checks: {
      database: {
        status: dbHealthy ? 'up' : 'down',
        latencyMs: dbLatencyMs,
        ...(dbError ? { error: dbError } : {}),
      },
      memory: {
        heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
      },
    },
  });
});

/**
 * GET /api/health/live
 * Liveness probe rápida para balanceadores de carga / orquestradores (K8s, Cloud Run).
 */
healthRouter.get('/health/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

/**
 * GET /api/health/ready
 * Readiness probe para confirmar prontidão para receber tráfego.
 */
healthRouter.get('/health/ready', (_req: Request, res: Response) => {
  try {
    const row = sqliteDb.prepare('SELECT 1 as ready;').get() as { ready?: number };
    if (row?.ready === 1) {
      res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
      return;
    }
    res.status(503).json({ status: 'not_ready', error: 'Database not initialized' });
  } catch (err: any) {
    res.status(503).json({ status: 'not_ready', error: err?.message || 'Readiness check failed' });
  }
});
