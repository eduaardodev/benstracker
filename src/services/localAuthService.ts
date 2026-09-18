import { UserProfile } from '../types';

export interface LocalUserDefinition {
  id: string;
  name: string;
  matricula: string;
  email: string;
  department: string;
  jobTitle: string;
  role: 'ADMIN' | 'TECHNICIAN';
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
    id: 'usr-tech-02',
    name: 'Mariana Souza Oliveira',
    matricula: 'TEC-9043',
    email: 'mariana.oliveira@empresa.com.br',
    department: 'Suporte de TI - Atendimento Local',
    jobTitle: 'Analista de Suporte Técnico N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-03',
    name: 'Lucas Gabriel Ferreira',
    matricula: 'TEC-9044',
    email: 'lucas.ferreira@empresa.com.br',
    department: 'Manutenção de Hardware & Periféricos',
    jobTitle: 'Técnico de Suporte N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-04',
    name: 'Juliana Martins Costa',
    matricula: 'TEC-9045',
    email: 'juliana.costa@empresa.com.br',
    department: 'Suporte de TI & Field Service',
    jobTitle: 'Analista de Suporte Técnico N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-05',
    name: 'Rodrigo Alves Santos',
    matricula: 'TEC-9046',
    email: 'rodrigo.santos@empresa.com.br',
    department: 'Infraestrutura e Redes Locais',
    jobTitle: 'Técnico de Suporte N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-06',
    name: 'Fernanda Lima Ribeiro',
    matricula: 'TEC-9047',
    email: 'fernanda.ribeiro@empresa.com.br',
    department: 'Suporte Operacional N2',
    jobTitle: 'Analista de Suporte Técnico N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-07',
    name: 'Bruno Henrique Cardoso',
    matricula: 'TEC-9048',
    email: 'bruno.cardoso@empresa.com.br',
    department: 'Logística e Troca de Ativos',
    jobTitle: 'Técnico de Suporte N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-08',
    name: 'Camila Rocha Barbosa',
    matricula: 'TEC-9049',
    email: 'camila.barbosa@empresa.com.br',
    department: 'Central de Serviços de TI',
    jobTitle: 'Analista de Suporte Técnico N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-09',
    name: 'Rafael Pinheiro Guimarães',
    matricula: 'TEC-9050',
    email: 'rafael.guimaraes@empresa.com.br',
    department: 'Suporte de TI & Gestão de Ativos',
    jobTitle: 'Técnico de Suporte N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-10',
    name: 'Aline Cristina Mendes',
    matricula: 'TEC-9051',
    email: 'aline.mendes@empresa.com.br',
    department: 'Atendimento VIP & Workstations',
    jobTitle: 'Analista de Suporte Técnico N2',
    role: 'TECHNICIAN',
    password: 'suporte@2026',
  },
  {
    id: 'usr-tech-11',
    name: 'Thiago Nogueira Duarte',
    matricula: 'TEC-9052',
    email: 'thiago.duarte@empresa.com.br',
    department: 'Suporte de TI - Filial São Paulo',
    jobTitle: 'Técnico de Suporte N2',
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
        (cleanId === 'adm-1001' && u.role === 'ADMIN')
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
