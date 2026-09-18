import dotenv from 'dotenv';
import path from 'path';

// Carrega variáveis do arquivo .env caso presente
dotenv.config();

export const ENV = {
  // Configurações do Servidor
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Segurança e Criptografia
  JWT_SECRET: process.env.JWT_SECRET || 'benstracker_jwt_secret_dev_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  // Armazenamento do Banco de Dados
  DB_DATA_DIR: process.env.DB_DATA_DIR || path.join(process.cwd(), 'data'),
  DB_FILE_NAME: process.env.DB_FILE_NAME || 'benstracker.db',

  // Disponibilidade e Rate Limiting (Proteção contra abuso e degradação de serviço)
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 120,
  AUTH_RATE_LIMIT_WINDOW_MS: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 60000,
  AUTH_RATE_LIMIT_MAX_REQUESTS: Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 15,
  HEALTH_CHECK_DB_TIMEOUT_MS: Number(process.env.HEALTH_CHECK_DB_TIMEOUT_MS) || 3000,

  // Credenciais de Inicialização (Contas Padrão)
  INITIAL_TECH_NAME: process.env.INITIAL_TECH_NAME || 'Carlos Henrique Silva',
  INITIAL_TECH_MATRICULA: process.env.INITIAL_TECH_MATRICULA || 'TEC-9042',
  INITIAL_TECH_EMAIL: process.env.INITIAL_TECH_EMAIL || 'carlos.silva@empresa.com.br',
  INITIAL_TECH_PASSWORD: process.env.INITIAL_TECH_PASSWORD || 'suporte@2026',

  INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME || 'Mariana Duarte - Coordenação de TI',
  INITIAL_ADMIN_MATRICULA: process.env.INITIAL_ADMIN_MATRICULA || 'ADM-1001',
  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL || 'admin.ti@empresa.com.br',
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD || 'admin@2026',

  INITIAL_VIEWER_NAME: process.env.INITIAL_VIEWER_NAME || 'Auditoria Interna de Patrimônio',
  INITIAL_VIEWER_MATRICULA: process.env.INITIAL_VIEWER_MATRICULA || 'AUD-3005',
  INITIAL_VIEWER_EMAIL: process.env.INITIAL_VIEWER_EMAIL || 'auditoria@empresa.com.br',
  INITIAL_VIEWER_PASSWORD: process.env.INITIAL_VIEWER_PASSWORD || 'auditor@2026',
} as const;
