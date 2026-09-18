import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { eq, sql } from 'drizzle-orm';
import { ENV } from '../config/env.config';
import { hashPassword } from '../utils/password.utils';
import * as schema from './schema';
import { users, equipments, movements } from './schema';

// Diretório e arquivo do banco de dados configurados via ambiente (.env)
const DATA_DIR = path.isAbsolute(ENV.DB_DATA_DIR)
  ? ENV.DB_DATA_DIR
  : path.join(process.cwd(), ENV.DB_DATA_DIR);

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, ENV.DB_FILE_NAME);
export const sqliteDb = new DatabaseSync(DB_PATH);

// Configuração de integridade e concorrência no SQLite
sqliteDb.exec('PRAGMA foreign_keys = ON;');
sqliteDb.exec('PRAGMA journal_mode = WAL;');

/**
 * Instância principal do ORM (Drizzle ORM).
 * O acesso ao banco é 100% mediado pelo ORM através de modelos fortemente tipados,
 * garantindo abstração de dados, integridade e proteção nativa contra injeção SQL.
 */
export const db = drizzle(async (querySql, params, method) => {
  const stmt = sqliteDb.prepare(querySql);
  if (method === 'all') {
    const rows = stmt.all(...params);
    return { rows: rows.map((r: any) => (r && typeof r === 'object' ? Object.values(r) : [])) };
  } else if (method === 'get') {
    const row = stmt.get(...params);
    return { rows: row && typeof row === 'object' ? Object.values(row as any) : undefined };
  } else {
    stmt.run(...params);
    return { rows: [] };
  }
}, { schema });

/**
 * Inicialização das tabelas mapeadas pelo ORM e carga dos registros padrão.
 */
export async function initializeDatabase(): Promise<void> {
  // Criação dos esquemas relacionais se não existirem
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      matricula TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      job_title TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('ADMIN', 'TECHNICIAN')),
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS equipments (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      tag TEXT NOT NULL UNIQUE,
      serial_number TEXT NOT NULL,
      brand_model TEXT NOT NULL,
      accessories TEXT NOT NULL,
      condition_notes TEXT,
      checkout_date TEXT NOT NULL,
      responsibility_term_accepted INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL CHECK (status IN ('Disponível', 'Em Uso', 'Recolhido', 'Em Manutenção')),
      assigned_to_user TEXT,
      assigned_location TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS movements (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      old_tag TEXT NOT NULL,
      old_serial_number TEXT NOT NULL,
      old_condition TEXT NOT NULL,
      old_destination TEXT NOT NULL,
      new_tag TEXT NOT NULL,
      new_serial_number TEXT NOT NULL,
      new_brand_model TEXT NOT NULL,
      new_hostname TEXT,
      user_name TEXT NOT NULL,
      user_registration TEXT NOT NULL,
      sector_location TEXT NOT NULL,
      tech_responsible TEXT NOT NULL,
      tech_name TEXT NOT NULL,
      signature_data TEXT,
      observation TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await seedInitialData();
}

/**
 * População inicial utilizando operações tipadas do ORM.
 */
async function seedInitialData(): Promise<void> {
  // Contas padrão de acesso com hashes gerados dinamicamente a partir do .env
  const technicianPasswordHash = await hashPassword(ENV.INITIAL_TECH_PASSWORD);
  const adminPasswordHash = await hashPassword(ENV.INITIAL_ADMIN_PASSWORD);

  // Remove conta de auditor caso já exista
  await db.delete(users).where(eq(users.id, 'usr-view-01'));

  // Lista de 10 técnicos N2 adicionais
  const additionalTechnicians = [
    {
      id: 'usr-tech-02',
      name: 'Mariana Souza Oliveira',
      matricula: 'TEC-9043',
      email: 'mariana.oliveira@empresa.com.br',
      department: 'Suporte de TI - Atendimento Local',
      jobTitle: 'Analista de Suporte Técnico N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-04-01T08:00:00.000Z',
    },
    {
      id: 'usr-tech-03',
      name: 'Lucas Gabriel Ferreira',
      matricula: 'TEC-9044',
      email: 'lucas.ferreira@empresa.com.br',
      department: 'Manutenção de Hardware & Periféricos',
      jobTitle: 'Técnico de Suporte N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-04-05T08:00:00.000Z',
    },
    {
      id: 'usr-tech-04',
      name: 'Juliana Martins Costa',
      matricula: 'TEC-9045',
      email: 'juliana.costa@empresa.com.br',
      department: 'Suporte de TI & Field Service',
      jobTitle: 'Analista de Suporte Técnico N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-04-10T08:00:00.000Z',
    },
    {
      id: 'usr-tech-05',
      name: 'Rodrigo Alves Santos',
      matricula: 'TEC-9046',
      email: 'rodrigo.santos@empresa.com.br',
      department: 'Infraestrutura e Redes Locais',
      jobTitle: 'Técnico de Suporte N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-04-15T08:00:00.000Z',
    },
    {
      id: 'usr-tech-06',
      name: 'Fernanda Lima Ribeiro',
      matricula: 'TEC-9047',
      email: 'fernanda.ribeiro@empresa.com.br',
      department: 'Suporte Operacional N2',
      jobTitle: 'Analista de Suporte Técnico N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-04-20T08:00:00.000Z',
    },
    {
      id: 'usr-tech-07',
      name: 'Bruno Henrique Cardoso',
      matricula: 'TEC-9048',
      email: 'bruno.cardoso@empresa.com.br',
      department: 'Logística e Troca de Ativos',
      jobTitle: 'Técnico de Suporte N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-05-02T08:00:00.000Z',
    },
    {
      id: 'usr-tech-08',
      name: 'Camila Rocha Barbosa',
      matricula: 'TEC-9049',
      email: 'camila.barbosa@empresa.com.br',
      department: 'Central de Serviços de TI',
      jobTitle: 'Analista de Suporte Técnico N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-05-10T08:00:00.000Z',
    },
    {
      id: 'usr-tech-09',
      name: 'Rafael Pinheiro Guimarães',
      matricula: 'TEC-9050',
      email: 'rafael.guimaraes@empresa.com.br',
      department: 'Suporte de TI & Gestão de Ativos',
      jobTitle: 'Técnico de Suporte N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-05-18T08:00:00.000Z',
    },
    {
      id: 'usr-tech-10',
      name: 'Aline Cristina Mendes',
      matricula: 'TEC-9051',
      email: 'aline.mendes@empresa.com.br',
      department: 'Atendimento VIP & Workstations',
      jobTitle: 'Analista de Suporte Técnico N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-06-01T08:00:00.000Z',
    },
    {
      id: 'usr-tech-11',
      name: 'Thiago Nogueira Duarte',
      matricula: 'TEC-9052',
      email: 'thiago.duarte@empresa.com.br',
      department: 'Suporte de TI - Filial São Paulo',
      jobTitle: 'Técnico de Suporte N2',
      role: 'TECHNICIAN' as const,
      passwordHash: technicianPasswordHash,
      createdAt: '2024-06-15T08:00:00.000Z',
    },
  ];

  const existingUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
  const userCount = Number(existingUsers[0]?.count || 0);

  if (userCount === 0) {
    await db.insert(users).values([
      {
        id: 'usr-tech-01',
        name: ENV.INITIAL_TECH_NAME,
        matricula: ENV.INITIAL_TECH_MATRICULA,
        email: ENV.INITIAL_TECH_EMAIL,
        department: 'Suporte de TI & Gestão de Ativos',
        jobTitle: 'Analista de Suporte Técnico N2',
        role: 'TECHNICIAN',
        passwordHash: technicianPasswordHash,
        createdAt: '2024-03-15T08:00:00.000Z',
      },
      {
        id: 'usr-adm-01',
        name: ENV.INITIAL_ADMIN_NAME,
        matricula: ENV.INITIAL_ADMIN_MATRICULA,
        email: ENV.INITIAL_ADMIN_EMAIL,
        department: 'Gestão e Governança de TI',
        jobTitle: 'Administradora de Sistemas & Ativos',
        role: 'ADMIN',
        passwordHash: adminPasswordHash,
        createdAt: '2023-01-10T08:00:00.000Z',
      },
      ...additionalTechnicians,
    ]);
  } else {
    // Atualização de credenciais pelo ORM conforme ambiente (.env)
    await db.update(users).set({ passwordHash: technicianPasswordHash }).where(eq(users.id, 'usr-tech-01'));
    await db.update(users).set({ passwordHash: adminPasswordHash }).where(eq(users.id, 'usr-adm-01'));

    // Insere os 10 técnicos adicionais caso ainda não existam no banco
    for (const tech of additionalTechnicians) {
      const exists = await db.select({ id: users.id }).from(users).where(eq(users.id, tech.id)).limit(1);
      if (exists.length === 0) {
        await db.insert(users).values(tech);
      } else {
        await db.update(users).set({ passwordHash: technicianPasswordHash }).where(eq(users.id, tech.id));
      }
    }
  }

  // Equipamentos iniciais
  const existingEquipments = await db.select({ count: sql<number>`count(*)` }).from(equipments);
  const eqCount = Number(existingEquipments[0]?.count || 0);

  if (eqCount === 0) {
    await db.insert(equipments).values([
      {
        id: 'eq-1',
        type: 'Notebook',
        tag: 'PAT-004521',
        serialNumber: 'BR5492810X99',
        brandModel: 'Dell Latitude 3420',
        accessories: JSON.stringify(['Carregador/Fonte', 'Mochila/Capa']),
        conditionNotes: 'Equipamento lacrado com imagem corporativa Windows 11 Pro instalada.',
        checkoutDate: '2026-09-10',
        responsibilityTermAccepted: 1,
        status: 'Disponível',
        assignedToUser: null,
        assignedLocation: null,
        createdAt: '2026-09-10T09:00:00Z',
      },
      {
        id: 'eq-2',
        type: 'Monitor',
        tag: 'PAT-003118',
        serialNumber: 'CN44201994MN',
        brandModel: 'Dell UltraSharp 24 P2419H',
        accessories: JSON.stringify(['Cabo de Força', 'Adaptador de Vídeo']),
        conditionNotes: 'Sem avarias na tela, suporte articulado com regulagem de altura.',
        checkoutDate: '2026-09-12',
        responsibilityTermAccepted: 1,
        status: 'Disponível',
        assignedToUser: null,
        assignedLocation: null,
        createdAt: '2026-09-12T14:30:00Z',
      },
      {
        id: 'eq-3',
        type: 'Desktop',
        tag: 'PAT-001984',
        serialNumber: 'LEN-881290-DT',
        brandModel: 'Lenovo ThinkCentre M70s',
        accessories: JSON.stringify(['Cabo de Força']),
        conditionNotes: 'Gabinete íntegro, limpeza interna e manutenção preventiva realizadas.',
        checkoutDate: '2026-08-20',
        responsibilityTermAccepted: 1,
        status: 'Em Uso',
        assignedToUser: 'Mariana Duarte (MAT-4412)',
        assignedLocation: 'Controladoria - 4º Andar - Sala 402',
        createdAt: '2026-08-20T10:15:00Z',
      },
      {
        id: 'eq-4',
        type: 'Celular/Smartphone',
        tag: 'PAT-008712',
        serialNumber: 'SM-A156MZ-BR',
        brandModel: 'Samsung Galaxy A15 128GB',
        accessories: JSON.stringify(['Carregador/Fonte']),
        conditionNotes: 'Aparelho novo com película de vidro e capa de proteção.',
        checkoutDate: '2026-09-14',
        responsibilityTermAccepted: 1,
        status: 'Disponível',
        assignedToUser: null,
        assignedLocation: null,
        createdAt: '2026-09-14T11:00:00Z',
      },
      {
        id: 'eq-5',
        type: 'Teclado/Mouse',
        tag: 'PAT-002045',
        serialNumber: 'LOGI-MK295-88',
        brandModel: 'Logitech MK295 Silent Wireless',
        accessories: JSON.stringify(['Adaptador de Vídeo']),
        conditionNotes: 'Kit wireless em perfeito funcionamento com dongle USB original.',
        checkoutDate: '2026-09-15',
        responsibilityTermAccepted: 1,
        status: 'Disponível',
        assignedToUser: null,
        assignedLocation: null,
        createdAt: '2026-09-15T08:20:00Z',
      },
    ]);
  }

  // Movimentações iniciais
  const existingMovements = await db.select({ count: sql<number>`count(*)` }).from(movements);
  const movCount = Number(existingMovements[0]?.count || 0);

  if (movCount === 0) {
    await db.insert(movements).values([
      {
        id: 'mov-1001',
        timestamp: '2026-09-15 14:45:00',
        oldTag: 'PAT-001432',
        oldSerialNumber: 'HP49201991BB',
        oldCondition: 'Defeito',
        oldDestination: 'Devolução ao Almoxarifado',
        newTag: 'PAT-004521',
        newSerialNumber: 'BR5492810X99',
        newBrandModel: 'Dell Latitude 3420',
        newHostname: 'CORP-NB-8821',
        userName: 'Rodrigo Fernandes de Oliveira',
        userRegistration: 'MAT-9921',
        sectorLocation: 'Financeiro - 3º Andar - Sala 304 - Posição 12',
        techResponsible: 'TEC-9042',
        techName: 'Carlos Henrique Silva',
        signatureData: null,
        observation: 'Substituição por lentidão no boot e falha de bateria.',
        createdAt: '2026-09-15T14:45:00Z',
      },
    ]);
  }
}
