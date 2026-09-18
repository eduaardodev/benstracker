import { Router, Request, Response } from 'express';
import { userService } from '../services/user.service';
import { comparePassword, hashPassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { loginSchema, registerSchema, changePasswordSchema } from '../schemas/validation.schemas';
import { AuthResponse } from '../types/auth.types';

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Autentica usuário via e-mail ou matrícula + senha criptografada (bcrypt).
 * Protegido por validação estrita no backend via Zod e Prepared Statements.
 */
authRouter.post('/login', validateBody(loginSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    // Prepared statement no service: busca segura por e-mail ou matrícula
    const user = await userService.findByIdentifier(identifier);
    if (!user) {
      res.status(401).json({
        error: {
          message: 'Credenciais inválidas. Verifique seu e-mail/matrícula e senha.',
          code: 'INVALID_CREDENTIALS',
          status: 401,
        },
      });
      return;
    }

    // Validação criptográfica da senha através do bcrypt
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        error: {
          message: 'Credenciais inválidas. Verifique seu e-mail/matrícula e senha.',
          code: 'INVALID_CREDENTIALS',
          status: 401,
        },
      });
      return;
    }

    // Registro do último acesso e geração do JWT
    await userService.updateLastLogin(user.id);
    const token = generateToken({
      userId: user.id,
      email: user.email,
      matricula: user.matricula,
      name: user.name,
      role: user.role,
    });

    const safeUser = userService.toSafeUser(user);

    const response: AuthResponse = {
      token,
      user: safeUser,
      expiresIn: '8h',
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({
      error: {
        message: err?.message || 'Falha ao processar autenticação.',
        status: 500,
      },
    });
  }
});

/**
 * POST /api/auth/register
 * Cadastro de novo usuário com validação de integridade no backend e hash de senha.
 */
authRouter.post('/register', validateBody(registerSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, matricula, email, department, jobTitle, role, password } = req.body;

    const newUser = await userService.createUser({
      name,
      matricula,
      email,
      department,
      jobTitle,
      role,
      password,
    });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user: newUser,
    });
  } catch (err: any) {
    res.status(400).json({
      error: {
        message: err?.message || 'Falha ao registrar novo usuário.',
        status: 400,
      },
    });
  }
});

/**
 * GET /api/auth/me
 * Retorna os dados do usuário autenticado no token JWT.
 */
authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: { message: 'Não autenticado', status: 401 } });
    return;
  }

  const user = await userService.findById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: { message: 'Usuário não encontrado', status: 404 } });
    return;
  }

  res.json({
    user: userService.toSafeUser(user),
    auth: req.user,
  });
});

/**
 * POST /api/auth/change-password
 * Permite ao usuário logado alterar sua senha de forma segura com validação de esquema e hash bcrypt.
 */
authRouter.post(
  '/change-password',
  authenticateToken,
  validateBody(changePasswordSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: { message: 'Não autenticado', status: 401 } });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      const user = await userService.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ error: { message: 'Usuário não encontrado.', status: 404 } });
        return;
      }

      const isMatch = await comparePassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({
          error: { message: 'A senha atual informada está incorreta.', status: 400 },
        });
        return;
      }

      const newHash = await hashPassword(newPassword);
      await userService.updatePassword(user.id, newHash);

      res.json({
        message: 'Senha alterada com sucesso.',
      });
    } catch (err: any) {
      res.status(500).json({
        error: { message: err?.message || 'Erro ao alterar senha.', status: 500 },
      });
    }
  }
);

/**
 * GET /api/auth/demo-accounts
 * Lista de contas cadastradas para referência de acesso.
 */
authRouter.get('/demo-accounts', (_req: Request, res: Response): void => {
  res.json({
    accounts: [
      {
        role: 'TECHNICIAN',
        name: 'Carlos Henrique Silva',
        email: 'carlos.silva@empresa.com.br',
        matricula: 'TEC-9042',
      },
      {
        role: 'ADMIN',
        name: 'Mariana Duarte - Coordenação de TI',
        email: 'admin.ti@empresa.com.br',
        matricula: 'ADM-1001',
      },
    ],
  });
});
