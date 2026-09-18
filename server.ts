import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ENV } from './server/config/env.config';
import { apiRouter } from './server/routes/api.routes';
import { requestLogger } from './server/middleware/requestLogger';
import { errorHandler } from './server/middleware/errorHandler';

// Prevenção de quebra do processo Node por exceções ou rejeições não capturadas
process.on('uncaughtException', (error: Error) => {
  console.error('[Resilience] Exceção não capturada interceptada para evitar encerramento do serviço:', error);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Resilience] Rejeição assíncrona não tratada interceptada:', reason);
});

async function startServer() {
  const app = express();
  const PORT = ENV.PORT;

  // Habilita trust proxy para identificar IPs corretamente atrás de reverse proxies/Cloud Run
  app.set('trust proxy', 1);

  // Middlewares básicos
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Registro das rotas da API (/api/*) com rate limiters e validadores
  app.use('/api', apiRouter);

  // Tratamento central de erros da API
  app.use(errorHandler);

  // Integração com Vite (desenvolvimento) ou arquivos estáticos (produção)
  if (ENV.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BensTracker Server] Servidor ativo e disponível em http://0.0.0.0:${PORT}`);
  });

  // Encerramento gracioso em sinais de orquestração (Kubernetes, Docker, Cloud Run)
  const shutdown = (signal: string) => {
    console.log(`[BensTracker Server] Sinal ${signal} recebido. Finalizando servidor...`);
    server.close(() => {
      console.log('[BensTracker Server] Conexões finalizadas com sucesso.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[BensTracker Server] Falha crítica ao iniciar servidor:', err);
  process.exit(1);
});
