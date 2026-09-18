import { Router, Request, Response } from 'express';
import { equipmentService } from '../services/equipment.service';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { equipmentCreateSchema, equipmentQuerySchema } from '../schemas/validation.schemas';

export const equipmentRouter = Router();

/**
 * GET /api/equipments
 * Lista equipamentos cadastrados com suporte a busca e filtro por status.
 * Consultas 100% protegidas com Prepared Statements (sem concatenação de SQL).
 */
equipmentRouter.get(
  '/',
  validateQuery(equipmentQuerySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { search, status } = req.query as { search?: string; status?: string };
      const list = await equipmentService.findAll({ search, status });
      res.json({ equipments: list, total: list.length });
    } catch (err: any) {
      res.status(500).json({
        error: {
          message: err?.message || 'Falha ao consultar equipamentos.',
          status: 500,
        },
      });
    }
  }
);

/**
 * GET /api/equipments/:tag
 * Busca equipamento por patrimônio (tag) usando Prepared Statement.
 */
equipmentRouter.get('/:tag', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag } = req.params;
    if (!tag || tag.length > 50) {
      res.status(400).json({ error: { message: 'Patrimônio inválido.', status: 400 } });
      return;
    }

    const item = await equipmentService.findByTag(tag);
    if (!item) {
      res.status(404).json({ error: { message: 'Equipamento não encontrado.', status: 404 } });
      return;
    }

    res.json({ equipment: item });
  } catch (err: any) {
    res.status(500).json({
      error: { message: err?.message || 'Erro ao buscar equipamento.', status: 500 },
    });
  }
});

/**
 * POST /api/equipments
 * Cadastro de novo bem patrimonial com validação estrita no backend.
 * Requer autenticação e valida integridade e unicidade de patrimônio.
 */
equipmentRouter.post(
  '/',
  authenticateToken,
  validateBody(equipmentCreateSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const created = await equipmentService.create(req.body);
      res.status(201).json({
        message: 'Equipamento cadastrado com sucesso.',
        equipment: created,
      });
    } catch (err: any) {
      res.status(400).json({
        error: {
          message: err?.message || 'Falha ao cadastrar equipamento.',
          status: 400,
        },
      });
    }
  }
);
