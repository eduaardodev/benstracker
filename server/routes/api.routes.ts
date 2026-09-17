import { Router } from 'express';
import { healthRouter } from './health.routes';

export const apiRouter = Router();

// Rota de monitoramento e saúde da API
apiRouter.use(healthRouter);

/**
 * Área para registro de novas rotas e features do sistema.
 * Exemplo para futuras implementações:
 *
 * import { movementsRouter } from './movements.routes';
 * import { assetsRouter } from './assets.routes';
 * import { usersRouter } from './users.routes';
 *
 * apiRouter.use('/movements', movementsRouter);
 * apiRouter.use('/assets', assetsRouter);
 * apiRouter.use('/users', usersRouter);
 */
