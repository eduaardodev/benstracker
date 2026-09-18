import { UserProfile } from '../types';

export interface LocalUserDefinition {
  id: string;
  name: string;
  matricula: string;
  email: string;
  department: string;
  jobTitle: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'VIEWER';
  password: string;
}

export const DEMO_USERS: LocalUserDefinition[] = [
  {
    id: 'usr-tech-01',
    name: 'Carlos Henrique Silva',
    matricula: 'TEC-9042',
    email: 'carlos.silva@empresa.com.br',
    department: 'Suporte de TI & Gestão de Ativos',
    jobTitle: 'Analista de Suporte Técnico N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-adm-01',
    name: 'Dra. Beatriz Mendes',
    matricula: 'ADM-0010',
    email: 'admin.ti@empresa.com.br',
    department: 'Gestão e Governança de TI',
    jobTitle: 'Administradora de Sistemas & Ativos',
    role: 'ADMIN',
    password: 'admin@2026',
  },
  {
    id: 'usr-view-01',
    name: 'Roberto Alencar',
    matricula: 'AUD-7701',
    email: 'auditoria@empresa.com.br',
    department: 'Compliance & Auditoria Corporativa',
    jobTitle: 'Auditor de Custódia e Conformidade',
    role: 'VIEWER',
    password: 'auditor@2026',
  },
];

export const localAuthService = {
  getDemoUsers(): LocalUserDefinition[] {
    return DEMO_USERS;
  },

  /**
   * Autentica estritamente contra as contas corporativas homologadas.
   * Não aceita senhas incorretas nem identificadores desconhecidos.
   */
  authenticate(identifier: string, password: string): { success: boolean; user?: UserProfile; token?: string; error?: string } {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return {
        success: false,
        error: 'Informe o e-mail ou matrícula e a senha de acesso.',
      };
    }

    // 1. Procurar correspondência do identificador nos usuários homologados
    const matchedUser = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.matricula.toLowerCase() === cleanId ||
        // Também aceita variações comuns de matrícula do seed do backend
        (cleanId === 'adm-1001' && u.role === 'ADMIN') ||
        (cleanId === 'aud-3005' && u.role === 'VIEWER')
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'Credenciais inválidas. Usuário não encontrado no sistema.',
      };
    }

    // 2. Validação estrita de senha (deve coincidir exatamente)
    if (matchedUser.password !== cleanPass) {
      return {
        success: false,
        error: 'Senha incorreta. Verifique a senha digitada e tente novamente.',
      };
    }

    // 3. Sucesso na autenticação
    const userProfile: UserProfile = {
      id: matchedUser.id,
      name: matchedUser.name,
      matricula: matchedUser.matricula,
      email: matchedUser.email,
      department: matchedUser.department,
      role: matchedUser.jobTitle,
      roleCode: matchedUser.role,
      token: `mock_jwt_${matchedUser.id}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      user: userProfile,
      token: userProfile.token,
    };
  },
};
