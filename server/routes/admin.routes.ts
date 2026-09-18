import { Router, Response } from 'express';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { userService } from '../services/user.service';
import { ENV } from '../config/env.config';

export const adminRouter = Router();

// Todas as rotas deste router exigem autenticação E papel 'ADMIN'
adminRouter.use(authenticateToken);
adminRouter.use(requireRole('ADMIN'));

/**
 * GET /api/admin/users
 * Lista todos os usuários cadastrados (somente acessível por Administradores).
 */
adminRouter.get('/users', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const users = await userService.getAllUsers();
  res.json({
    total: users.length,
    users,
  });
});

/**
 * GET /api/admin/security-audit
 * Métricas de conformidade e segurança da infraestrutura de TI.
 */
adminRouter.get('/security-audit', (req: AuthenticatedRequest, res: Response): void => {
  res.json({
    auditor: req.user?.name,
    auditDate: new Date().toISOString(),
    compliance: {
      passwordHashing: `bcrypt (${ENV.BCRYPT_SALT_ROUNDS} rounds salt)`,
      tokenStandard: 'JWT (JSON Web Token RS256/HS256)',
      rbacStatus: 'Ativo e monitorado',
      authorizedRoles: ['ADMIN', 'TECHNICIAN', 'VIEWER'],
    },
  });
});
