import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.config';

export interface AppError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  type?: string;
}

/**
 * Middleware central de tratamento e blindagem de erros da aplicação.
 * Garante que nenhuma exceção não tratada cause crash ou vazamento de dados internos.
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Trata erro de parsing de JSON mal formatado no body
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    res.status(400).json({
      error: {
        message: 'Payload JSON inválido ou malformado.',
        code: 'BAD_REQUEST_MALFORMED_JSON',
        status: 400,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const isServerFault = statusCode >= 500;

  // Registro estruturado de erro no servidor para monitoramento
  console.error(
    `[ApiError] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${statusCode} | ${err.message}`,
    isServerFault ? err.stack : ''
  );

  // Em produção, mensagens de erro 500 são sanitizadas para não vazar detalhes de infraestrutura
  const message =
    isServerFault && ENV.NODE_ENV === 'production'
      ? 'Ocorreu um erro interno ao processar a requisição. O incidente foi registrado.'
      : err.message || 'Erro interno no servidor.';

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || (isServerFault ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR'),
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Handler para rotas da API não encontradas (/api/*)
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Rota ${req.method} ${req.originalUrl} não encontrada nesta API.`,
      code: 'RESOURCE_NOT_FOUND',
      status: 404,
      timestamp: new Date().toISOString(),
    },
  });
}
