import { Router, Request, Response } from 'express';
import { movementService } from '../services/movement.service';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { movementCreateSchema } from '../schemas/validation.schemas';

export const movementRouter = Router();

/**
 * GET /api/movements
 * Lista o histórico de termos de movimentação e substituição.
 */
movementRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await movementService.findAll();
    res.json({ movements: list, total: list.length });
  } catch (err: any) {
    res.status(500).json({
      error: {
        message: err?.message || 'Falha ao buscar movimentações.',
        status: 500,
      },
    });
  }
});

/**
 * POST /api/movements
 * Registra movimentação de bem patrimonial com integridade transacional ACID.
 * Requer papel de Técnico ou Administrador.
 */
movementRouter.post(
  '/',
  authenticateToken,
  requireRole('ADMIN', 'TECHNICIAN'),
  validateBody(movementCreateSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = req.user!;
      const movementData = {
        ...req.body,
        techResponsible: user.matricula,
        techName: user.name,
      };

      const created = await movementService.create(movementData);
      res.status(201).json({
        message: 'Termo de movimentação registrado com sucesso.',
        movement: created,
      });
    } catch (err: any) {
      res.status(400).json({
        error: {
          message: err?.message || 'Falha ao processar movimentação.',
          status: 400,
        },
      });
    }
  }
);
