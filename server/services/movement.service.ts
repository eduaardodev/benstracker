import { db } from '../db/database';
import { movements, equipments, MovementSelect } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface MovementEntity {
  id: string;
  timestamp: string;
  oldEquipment: {
    tag: string;
    serialNumber: string;
    condition: string;
    destination: string;
  };
  newEquipment: {
    tag: string;
    serialNumber: string;
    brandModel: string;
    hostname?: string;
  };
  locationUser: {
    sectorLocation: string;
    userName: string;
    userRegistration: string;
  };
  techResponsible: string;
  techName: string;
  signatureData?: string;
  observation?: string;
  createdAt: string;
}

function mapRowToMovement(row: MovementSelect): MovementEntity {
  return {
    id: row.id,
    timestamp: row.timestamp,
    oldEquipment: {
      tag: row.oldTag,
      serialNumber: row.oldSerialNumber,
      condition: row.oldCondition,
      destination: row.oldDestination,
    },
    newEquipment: {
      tag: row.newTag,
      serialNumber: row.newSerialNumber,
      brandModel: row.newBrandModel,
      hostname: row.newHostname || undefined,
    },
    locationUser: {
      sectorLocation: row.sectorLocation,
      userName: row.userName,
      userRegistration: row.userRegistration,
    },
    techResponsible: row.techResponsible,
    techName: row.techName,
    signatureData: row.signatureData || undefined,
    observation: row.observation || undefined,
    createdAt: row.createdAt,
  };
}

class MovementService {
  /**
   * Consulta histórico de movimentações através do ORM.
   */
  public async findAll(): Promise<MovementEntity[]> {
    const rows = await db
      .select()
      .from(movements)
      .orderBy(desc(movements.createdAt));

    return rows.map(mapRowToMovement);
  }

  /**
   * Registra uma nova movimentação garantindo integridade transacional ACID via ORM.
   */
  public async create(data: {
    oldEquipment: {
      tag: string;
      serialNumber: string;
      condition: string;
      destination: string;
    };
    newEquipment: {
      tag: string;
      serialNumber: string;
      brandModel: string;
      hostname?: string;
    };
    locationUser: {
      sectorLocation: string;
      userName: string;
      userRegistration: string;
    };
    techResponsible: string;
    techName: string;
    signatureData?: string;
    observation?: string;
  }): Promise<MovementEntity> {
    const id = `mov-${Date.now()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const createdAt = new Date().toISOString();

    const oldNotes = `Recolhido em ${timestamp}: Condição ${data.oldEquipment.condition} -> ${data.oldEquipment.destination}`;
    const assignedUser = `${data.locationUser.userName} (${data.locationUser.userRegistration})`;

    // Execução atômica no ORM
    await db.transaction(async (tx) => {
      // Inserção da movimentação
      await tx.insert(movements).values({
        id,
        timestamp,
        oldTag: data.oldEquipment.tag.toUpperCase(),
        oldSerialNumber: data.oldEquipment.serialNumber,
        oldCondition: data.oldEquipment.condition,
        oldDestination: data.oldEquipment.destination,
        newTag: data.newEquipment.tag.toUpperCase(),
        newSerialNumber: data.newEquipment.serialNumber,
        newBrandModel: data.newEquipment.brandModel,
        newHostname: data.newEquipment.hostname || null,
        userName: data.locationUser.userName,
        userRegistration: data.locationUser.userRegistration,
        sectorLocation: data.locationUser.sectorLocation,
        techResponsible: data.techResponsible,
        techName: data.techName,
        signatureData: data.signatureData || null,
        observation: data.observation || null,
        createdAt,
      });

      // Atualização do equipamento recolhido
      await tx
        .update(equipments)
        .set({
          status: 'Recolhido',
          conditionNotes: oldNotes,
        })
        .where(eq(sql`UPPER(${equipments.tag})`, data.oldEquipment.tag.trim().toUpperCase()));

      // Atualização do novo equipamento entregue
      await tx
        .update(equipments)
        .set({
          status: 'Em Uso',
          assignedToUser: assignedUser,
          assignedLocation: data.locationUser.sectorLocation,
        })
        .where(eq(sql`UPPER(${equipments.tag})`, data.newEquipment.tag.trim().toUpperCase()));
    });

    const rows = await db
      .select()
      .from(movements)
      .where(eq(movements.id, id))
      .limit(1);

    if (rows.length === 0) {
      throw new Error('Falha ao registrar movimentação.');
    }

    return mapRowToMovement(rows[0]);
  }
}

export const movementService = new MovementService();
