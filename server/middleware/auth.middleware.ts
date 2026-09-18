import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthTokenPayload, UserRole } from '../types/auth.types';

// Extensão segura de Request para carregar o payload de autenticação
export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

/**
 * Middleware de Autenticação:
 * Extrai e valida o token JWT do cabeçalho Authorization (Bearer <token>).
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    res.status(401).json({
      error: {
        message: 'Acesso não autorizado: token JWT ausente ou inválido.',
        code: 'UNAUTHORIZED',
        status: 401,
      },
    });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    const isExpired = err?.name === 'TokenExpiredError';
    res.status(401).json({
      error: {
        message: isExpired ? 'Sessão expirada. Por favor, faça login novamente.' : 'Token de autenticação inválido.',
        code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        status: 401,
      },
    });
  }
}

/**
 * Middleware de Autorização (RBAC):
 * Garante que o usuário autenticado possua um dos papéis (roles) requeridos.
 * Exemplo de uso: requireRole('ADMIN') ou requireRole('ADMIN', 'TECHNICIAN')
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Autenticação requerida antes da validação de permissões.',
          code: 'UNAUTHENTICATED',
          status: 401,
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          message: `Acesso negado: seu perfil '${req.user.role}' não possui permissão para este recurso. Perfis autorizados: ${allowedRoles.join(', ')}.`,
          code: 'FORBIDDEN',
          status: 403,
          requiredRoles: allowedRoles,
          currentRole: req.user.role,
        },
      });
      return;
    }

    next();
  };
}
