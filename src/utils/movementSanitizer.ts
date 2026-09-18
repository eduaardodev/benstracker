import { MovementRecord } from '../types';

/**
 * Sanitiza e normaliza registros de movimentação, garantindo integridade defensiva
 * contra objetos nulos ou atributos parciais vindos do localStorage ou de endpoints legados.
 */
export const sanitizeMovement = (mov: any): MovementRecord => {
  if (!mov || typeof mov !== 'object') {
    return {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      oldEquipment: {
        tag: 'PAT-000000',
        serialNumber: 'S/N-N/A',
        condition: 'Funcional',
        destination: 'Estoque Reserva',
      },
      newEquipment: {
        tag: 'PAT-000000',
        serialNumber: 'S/N-N/A',
        brandModel: 'Equipamento Corporativo',
        hostname: '',
      },
      locationUser: {
        sectorLocation: 'TI Suporte',
        userName: 'Colaborador',
        userRegistration: 'MAT-0000',
      },
      checklist: {
        dataBackupDone: true,
        domainAdJoined: true,
        printersMapped: true,
        userProfileConfigured: true,
      },
      techResponsible: 'TI Field',
      auditClosure: {
        acceptanceTermSigned: true,
        signerName: 'Colaborador',
        technicalNotes: '',
      },
    };
  }

  const checklist =
    mov.checklist && typeof mov.checklist === 'object'
      ? {
          dataBackupDone: Boolean(mov.checklist.dataBackupDone ?? true),
          domainAdJoined: Boolean(mov.checklist.domainAdJoined ?? mov.checklist.domainJoined ?? true),
          printersMapped: Boolean(mov.checklist.printersMapped ?? true),
          userProfileConfigured: Boolean(mov.checklist.userProfileConfigured ?? true),
        }
      : {
          dataBackupDone: true,
          domainAdJoined: true,
          printersMapped: true,
          userProfileConfigured: true,
        };

  const auditClosure =
    mov.auditClosure && typeof mov.auditClosure === 'object'
      ? {
          acceptanceTermSigned: Boolean(mov.auditClosure.acceptanceTermSigned ?? true),
          signatureDataUrl: mov.auditClosure.signatureDataUrl || mov.signatureData || undefined,
          signerName: mov.auditClosure.signerName || mov.locationUser?.userName || 'Colaborador',
          technicalNotes: mov.auditClosure.technicalNotes || mov.observation || '',
        }
      : {
          acceptanceTermSigned: true,
          signatureDataUrl: mov.signatureData || undefined,
          signerName: mov.locationUser?.userName || 'Colaborador',
          technicalNotes: mov.observation || '',
        };

  return {
    id: String(mov.id || `mov-${Date.now()}`),
    timestamp: String(mov.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19)),
    oldEquipment: {
      tag: String(mov.oldEquipment?.tag || 'PAT-000000'),
      serialNumber: String(mov.oldEquipment?.serialNumber || 'S/N-N/A'),
      condition: mov.oldEquipment?.condition || 'Funcional',
      destination: mov.oldEquipment?.destination || 'Estoque Reserva',
    },
    newEquipment: {
      tag: String(mov.newEquipment?.tag || 'PAT-000000'),
      serialNumber: String(mov.newEquipment?.serialNumber || 'S/N-N/A'),
      brandModel: String(mov.newEquipment?.brandModel || 'Equipamento Corporativo'),
      hostname: String(mov.newEquipment?.hostname || ''),
    },
    locationUser: {
      sectorLocation: String(mov.locationUser?.sectorLocation || 'Setor Corporativo'),
      userName: String(mov.locationUser?.userName || 'Colaborador'),
      userRegistration: String(mov.locationUser?.userRegistration || 'MAT-0000'),
    },
    checklist,
    techResponsible: String(mov.techResponsible || mov.techName || 'TI Field'),
    auditClosure,
  };
};

export const sanitizeMovementsList = (list: any[]): MovementRecord[] => {
  if (!Array.isArray(list)) return [];
  return list.map(sanitizeMovement);
};
