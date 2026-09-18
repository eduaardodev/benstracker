import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ENV } from '../config/env.config';

/**
 * Limitador geral de requisições para a API.
 * Protege a aplicação contra rajadas de tráfego, DoS acidental e degradação de desempenho.
 */
export const apiRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  limit: ENV.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true, // Retorna os cabeçalhos padrão RateLimit-* (RFC)
  legacyHeaders: false, // Desativa X-RateLimit-* legados
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      error: {
        message: 'Limite de requisições excedido. Por favor, aguarde alguns instantes antes de tentar novamente.',
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfterMs: ENV.RATE_LIMIT_WINDOW_MS,
      },
    });
  },
});

/**
 * Limitador de taxa estrito para rotas de autenticação (/api/auth/*).
 * Protege os endpoints de login, cadastro e alteração de senha contra ataques de força bruta.
 */
export const authRateLimiter = rateLimit({
  windowMs: ENV.AUTH_RATE_LIMIT_WINDOW_MS,
  limit: ENV.AUTH_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      error: {
        message: 'Muitas tentativas de autenticação registradas. Por segurança, tente novamente em instantes.',
        status: 429,
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        retryAfterMs: ENV.AUTH_RATE_LIMIT_WINDOW_MS,
      },
    });
  },
});
