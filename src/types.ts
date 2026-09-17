export type EquipmentType = 
  | 'Notebook' 
  | 'Monitor' 
  | 'Desktop' 
  | 'Celular/Smartphone' 
  | 'Teclado/Mouse';

export type OldEquipmentCondition = 'Funcional' | 'Defeito' | 'Sucata';

export type OldEquipmentDestination = 
  | 'Estoque Reserva' 
  | 'Descarte/Leilão' 
  | 'Devolução ao Almoxarifado';

export interface Equipment {
  id: string;
  type: EquipmentType;
  tag: string; // Ex: PAT-001234
  serialNumber: string; // Máx 25 alfanumérico maiúsculas
  brandModel: string; // Máx ~40 chars
  accessories: string[]; // ['Carregador/Fonte', 'Adaptador de Vídeo', etc]
  conditionNotes: string; // 100 a 140 caracteres
  checkoutDate: string; // YYYY-MM-DD
  responsibilityTermAccepted: boolean;
  status: 'Disponível' | 'Em Uso' | 'Em Manutenção' | 'Recolhido';
  assignedToUser?: string;
  assignedLocation?: string;
  createdAt: string;
}

export interface MigrationChecklist {
  dataBackupDone: boolean; // Backup de dados realizado
  domainAdJoined: boolean; // Ingressada no domínio/AD
  printersMapped: boolean; // Impressoras mapeadas
  userProfileConfigured: boolean; // Perfil de usuário configurado
}

export interface MovementRecord {
  id: string;
  timestamp: string; // Data e Hora da Troca gerado automaticamente
  // Dados da Substituição (De -> Para)
  oldEquipment: {
    tag: string; // Patrimônio antigo
    serialNumber: string; // Número de Série
    condition: OldEquipmentCondition; // Funcional, Defeito, Sucata
    destination: OldEquipmentDestination; // Estoque Reserva, Descarte/Leilão, Devolução ao Almoxarifado
  };
  newEquipment: {
    tag: string; // Patrimônio novo
    serialNumber: string; // Número de Série
    brandModel: string; // Marca e Modelo
    hostname: string; // Hostname / Nome na rede
  };
  // Localização e Usuário
  locationUser: {
    sectorLocation: string; // Departamento, andar, sala ou posto de trabalho
    userName: string; // Nome completo do colaborador
    userRegistration: string; // Matrícula do colaborador
  };
  // Validação Técnica e Procedimentos
  checklist: MigrationChecklist;
  techResponsible: string; // Matrícula ou login do profissional de campo
  // Encerramento e Auditoria
  auditClosure: {
    acceptanceTermSigned: boolean;
    signatureDataUrl?: string; // Desenho ou confirmação eletrônica
    signerName: string;
    technicalNotes: string; // Campo curto máx 150 chars
  };
}

export interface UserProfile {
  id: string;
  name: string;
  matricula: string;
  email: string;
  department: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}
