import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware genérico de validação de esquema no backend.
 * Rejeita requisições com dados malformados, campos ausentes ou tipos incompatíveis,
 * garantindo integridade estrita antes do acesso ao banco de dados ou lógica de negócio.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const sanitized = schema.parse(req.body);
      // Substitui o corpo da requisição pelo objeto tipado e sanitizado (eliminando campos não declarados)
      req.body = sanitized;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          rule: issue.code,
        }));

        res.status(400).json({
          error: {
            message: 'Falha na validação dos dados de entrada.',
            code: 'VALIDATION_ERROR',
            status: 400,
            details: issues,
          },
        });
        return;
      }

      next(err);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const sanitized = schema.parse(req.query);
      req.query = sanitized as any;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        res.status(400).json({
          error: {
            message: 'Parâmetros de consulta inválidos.',
            code: 'QUERY_VALIDATION_ERROR',
            status: 400,
            details: issues,
          },
        });
        return;
      }

      next(err);
    }
  };
}
