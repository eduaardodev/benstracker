import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || err.status || 500;
  console.error(`[Error] ${req.method} ${req.url} -> ${err.message}`, err.stack);

  res.status(statusCode).json({
    error: {
      message: err.message || 'Erro interno no servidor',
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  });
}
