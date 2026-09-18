import { z } from 'zod';

// ==========================================
// Schemas de Validação de Autenticação
// ==========================================

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'O identificador deve conter pelo menos 3 caracteres.')
    .max(100, 'O identificador não pode exceder 100 caracteres.'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória.')
    .max(100, 'A senha não pode exceder 100 caracteres.'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve conter ao menos 2 caracteres.')
    .max(100, 'O nome não pode exceder 100 caracteres.'),
  matricula: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9\-_]{3,20}$/, 'Matrícula inválida. Use de 3 a 20 caracteres alfanuméricos.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Formato de e-mail corporativo inválido.')
    .max(100, 'E-mail não pode exceder 100 caracteres.'),
  department: z
    .string()
    .trim()
    .min(2, 'Departamento deve conter ao menos 2 caracteres.')
    .max(100, 'Departamento não pode exceder 100 caracteres.'),
  jobTitle: z
    .string()
    .trim()
    .min(2, 'Cargo deve conter ao menos 2 caracteres.')
    .max(100, 'Cargo não pode exceder 100 caracteres.'),
  role: z
    .enum(['ADMIN', 'TECHNICIAN'])
    .default('TECHNICIAN'),
  password: z
    .string()
    .min(6, 'A senha deve conter no mínimo 6 caracteres.')
    .max(100, 'A senha não pode exceder 100 caracteres.'),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória.')
    .max(100, 'Senha não pode exceder 100 caracteres.'),
  newPassword: z
    .string()
    .min(6, 'A nova senha deve possuir no mínimo 6 caracteres.')
    .max(100, 'A nova senha não pode exceder 100 caracteres.'),
});

// ==========================================
// Schemas de Validação de Equipamentos (Bens)
// ==========================================

export const equipmentCreateSchema = z.object({
  type: z
    .string()
    .trim()
    .min(2, 'Tipo deve conter ao menos 2 caracteres.')
    .max(50, 'Tipo não pode exceder 50 caracteres.'),
  tag: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9\-_]{3,30}$/, 'Patrimônio deve conter de 3 a 30 caracteres alfanuméricos.'),
  serialNumber: z
    .string()
    .trim()
    .min(2, 'Número de série deve conter ao menos 2 caracteres.')
    .max(50, 'Número de série não pode exceder 50 caracteres.'),
  brandModel: z
    .string()
    .trim()
    .min(2, 'Marca/Modelo deve conter ao menos 2 caracteres.')
    .max(100, 'Marca/Modelo não pode exceder 100 caracteres.'),
  accessories: z
    .array(z.string().trim().max(100))
    .default([]),
  conditionNotes: z
    .string()
    .trim()
    .max(500, 'Observações não podem exceder 500 caracteres.')
    .optional()
    .default(''),
  checkoutDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de registro inválida. Utilize o formato AAAA-MM-DD.'),
  responsibilityTermAccepted: z
    .boolean()
    .optional()
    .default(true),
  status: z
    .enum(['Disponível', 'Em Uso', 'Recolhido', 'Em Manutenção'])
    .default('Disponível'),
  assignedToUser: z.string().trim().max(100).optional(),
  assignedLocation: z.string().trim().max(150).optional(),
});

export const equipmentQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.enum(['Disponível', 'Em Uso', 'Recolhido', 'Em Manutenção', 'Todos']).optional(),
});

// ==========================================
// Schemas de Validação de Movimentações (Termos)
// ==========================================

export const movementCreateSchema = z.object({
  oldEquipment: z.object({
    tag: z
      .string()
      .trim()
      .min(2, 'Patrimônio recolhido deve conter ao menos 2 caracteres.')
      .max(30),
    serialNumber: z
      .string()
      .trim()
      .min(2, 'Número de série recolhido deve conter ao menos 2 caracteres.')
      .max(50),
    condition: z
      .string()
      .trim()
      .min(2, 'Condição é obrigatória.')
      .max(50),
    destination: z
      .string()
      .trim()
      .min(2, 'Destino é obrigatório.')
      .max(100),
  }),
  newEquipment: z.object({
    tag: z
      .string()
      .trim()
      .min(2, 'Patrimônio novo deve conter ao menos 2 caracteres.')
      .max(30),
    serialNumber: z
      .string()
      .trim()
      .min(2, 'Número de série novo deve conter ao menos 2 caracteres.')
      .max(50),
    brandModel: z
      .string()
      .trim()
      .min(2, 'Marca/modelo novo deve conter ao menos 2 caracteres.')
      .max(100),
    hostname: z
      .string()
      .trim()
      .max(50)
      .optional()
      .default(''),
  }),
  locationUser: z.object({
    sectorLocation: z
      .string()
      .trim()
      .min(3, 'Localização deve conter ao menos 3 caracteres.')
      .max(150),
    userName: z
      .string()
      .trim()
      .min(3, 'Nome do usuário deve conter ao menos 3 caracteres.')
      .max(100),
    userRegistration: z
      .string()
      .trim()
      .min(2, 'Matrícula do usuário é obrigatória.')
      .max(30),
  }),
  observation: z
    .string()
    .trim()
    .max(500, 'Observação não pode exceder 500 caracteres.')
    .optional()
    .default(''),
  signatureData: z
    .string()
    .optional(),
});
