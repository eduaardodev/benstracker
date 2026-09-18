import { Router } from 'express';
import { healthRouter } from './health.routes';
import { authRouter } from './auth.routes';
import { adminRouter } from './admin.routes';
import { equipmentRouter } from './equipment.routes';
import { movementRouter } from './movement.routes';
import { apiRateLimiter, authRateLimiter } from '../middleware/rateLimiter';
import { notFoundHandler } from '../middleware/errorHandler';

export const apiRouter = Router();

// 1. Rota de monitoramento e verificação de saúde da API (isenta do rate limiting para observabilidade contínua)
apiRouter.use(healthRouter);

// 2. Proteção contra abuso e rajadas de tráfego para a API
apiRouter.use(apiRateLimiter);

// 3. Módulo de Autenticação com rate limiting estrito contra ataques de força bruta (/api/auth/*)
apiRouter.use('/auth', authRateLimiter, authRouter);

// 4. Módulo de Bens e Equipamentos Patrimoniais (/api/equipments/*)
apiRouter.use('/equipments', equipmentRouter);

// 5. Módulo de Movimentações e Substituições (/api/movements/*)
apiRouter.use('/movements', movementRouter);

// 6. Módulo Administrativo com Autorização RBAC (/api/admin/*)
apiRouter.use('/admin', adminRouter);

// 7. Handler para rotas /api/* inexistentes (retorno JSON padronizado)
apiRouter.use(notFoundHandler);
