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
      authorizedRoles: ['ADMIN', 'TECHNICIAN'],
    },
  });
});

/**
 * POST /api/admin/users/:id/reset-password
 * Redefine a senha de um colaborador para a senha genérica (SenhaSimples2026).
 */
adminRouter.post('/users/:id/reset-password', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const targetUser = await userService.findById(id);

    if (!targetUser) {
      res.status(404).json({
        success: false,
        error: { message: 'Usuário não encontrado.' },
      });
      return;
    }

    const defaultGenericPassword = 'SenhaSimples2026';
    const newPassword = req.body?.password?.trim() || defaultGenericPassword;

    const safeUser = await userService.resetPassword(id, newPassword);

    res.json({
      success: true,
      message: `A senha de ${safeUser.name} foi redefinida com sucesso para: ${newPassword}`,
      newPassword,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Erro ao redefinir a senha do usuário.' },
    });
  }
});

