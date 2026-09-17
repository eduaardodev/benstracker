import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api.routes';
import { requestLogger } from './server/middleware/requestLogger';
import { errorHandler } from './server/middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares básicos
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Registro das rotas da API (/api/*)
  app.use('/api', apiRouter);

  // Tratamento de erros para rotas da API
  app.use(errorHandler);

  // Integração com Vite (desenvolvimento) ou arquivos estáticos (produção)
  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BensTracker Server] Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[BensTracker Server] Falha ao iniciar servidor:', err);
  process.exit(1);
});
