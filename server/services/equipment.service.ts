import { db } from '../db/database';
import { equipments, EquipmentSelect } from '../db/schema';
import { eq, or, and, like, desc, sql } from 'drizzle-orm';

export interface EquipmentEntity {
  id: string;
  type: string;
  tag: string;
  serialNumber: string;
  brandModel: string;
  accessories: string[];
  conditionNotes: string;
  checkoutDate: string;
  responsibilityTermAccepted: boolean;
  status: 'Disponível' | 'Em Uso' | 'Recolhido' | 'Em Manutenção';
  assignedToUser?: string | null;
  assignedLocation?: string | null;
  createdAt: string;
}

function mapRowToEntity(row: EquipmentSelect): EquipmentEntity {
  let accessoriesList: string[] = [];
  try {
    accessoriesList = JSON.parse(row.accessories || '[]');
  } catch {
    accessoriesList = [];
  }

  return {
    id: row.id,
    type: row.type,
    tag: row.tag,
    serialNumber: row.serialNumber,
    brandModel: row.brandModel,
    accessories: accessoriesList,
    conditionNotes: row.conditionNotes || '',
    checkoutDate: row.checkoutDate,
    responsibilityTermAccepted: Boolean(row.responsibilityTermAccepted),
    status: row.status,
    assignedToUser: row.assignedToUser,
    assignedLocation: row.assignedLocation,
    createdAt: row.createdAt,
  };
}

class EquipmentService {
  /**
   * Consulta equipamentos com suporte a busca e filtros via ORM.
   */
  public async findAll(filters?: { search?: string; status?: string }): Promise<EquipmentEntity[]> {
    const search = filters?.search?.trim();
    const status = filters?.status && filters.status !== 'Todos' ? (filters.status as any) : null;

    let rows: EquipmentSelect[] = [];

    if (status && search) {
      const pattern = `%${search}%`;
      rows = await db
        .select()
        .from(equipments)
        .where(
          and(
            eq(equipments.status, status),
            or(
              like(equipments.tag, pattern),
              like(equipments.brandModel, pattern),
              like(equipments.serialNumber, pattern)
            )
          )
        )
        .orderBy(desc(equipments.createdAt));
    } else if (status) {
      rows = await db
        .select()
        .from(equipments)
        .where(eq(equipments.status, status))
        .orderBy(desc(equipments.createdAt));
    } else if (search) {
      const pattern = `%${search}%`;
      rows = await db
        .select()
        .from(equipments)
        .where(
          or(
            like(equipments.tag, pattern),
            like(equipments.brandModel, pattern),
            like(equipments.serialNumber, pattern)
          )
        )
        .orderBy(desc(equipments.createdAt));
    } else {
      rows = await db
        .select()
        .from(equipments)
        .orderBy(desc(equipments.createdAt));
    }

    return rows.map(mapRowToEntity);
  }

  /**
   * Consulta equipamento pela tag de patrimônio via ORM.
   */
  public async findByTag(tag: string): Promise<EquipmentEntity | null> {
    const rows = await db
      .select()
      .from(equipments)
      .where(eq(sql`UPPER(${equipments.tag})`, tag.trim().toUpperCase()))
      .limit(1);

    return rows.length > 0 ? mapRowToEntity(rows[0]) : null;
  }

  /**
   * Criação de novo equipamento patrimonial através do ORM.
   */
  public async create(data: {
    type: string;
    tag: string;
    serialNumber: string;
    brandModel: string;
    accessories: string[];
    conditionNotes?: string;
    checkoutDate: string;
    responsibilityTermAccepted?: boolean;
    status: 'Disponível' | 'Em Uso' | 'Recolhido' | 'Em Manutenção';
    assignedToUser?: string;
    assignedLocation?: string;
  }): Promise<EquipmentEntity> {
    const existing = await this.findByTag(data.tag);
    if (existing) {
      throw new Error(`O número de patrimônio ${data.tag} já está cadastrado no acervo.`);
    }

    const id = `eq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    await db.insert(equipments).values({
      id,
      type: data.type,
      tag: data.tag.toUpperCase(),
      serialNumber: data.serialNumber,
      brandModel: data.brandModel,
      accessories: JSON.stringify(data.accessories || []),
      conditionNotes: data.conditionNotes || '',
      checkoutDate: data.checkoutDate,
      responsibilityTermAccepted: data.responsibilityTermAccepted !== false ? 1 : 0,
      status: data.status,
      assignedToUser: data.assignedToUser || null,
      assignedLocation: data.assignedLocation || null,
      createdAt,
    });

    const created = await this.findByTag(data.tag);
    if (!created) {
      throw new Error('Falha ao persistir equipamento.');
    }
    return created;
  }
}

export const equipmentService = new EquipmentService();
