import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Lock, 
  RefreshCw,
  Wrench,
  Shield,
  KeyRound,
  Copy,
  Check
} from 'lucide-react';
import { adminService, AdminUserItem, CreateUserInput } from '../services/adminService';
import { UserProfile } from '../types';

interface AdminUsersScreenProps {
  currentUser: UserProfile;
}

export const AdminUsersScreen: React.FC<AdminUsersScreenProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'TECHNICIAN'>('ALL');

  // Modal State: Create User
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State: Reset Password
  const [resetTargetUser, setResetTargetUser] = useState<AdminUserItem | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formMatricula, setFormMatricula] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formRole, setFormRole] = useState<'ADMIN' | 'TECHNICIAN'>('TECHNICIAN');
  const [formPassword, setFormPassword] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const usersData = await adminService.getUsers();
      setUsers(usersData.users);
    } catch {
      setFeedback({
        type: 'error',
        message: 'Não foi possível carregar a lista de usuários.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!formName.trim() || !formMatricula.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFeedback({
        type: 'error',
        message: 'Preencha todos os campos obrigatórios para cadastrar o usuário.',
      });
      return;
    }

    if (formPassword.length < 6) {
      setFeedback({
        type: 'error',
        message: 'A senha provisória deve conter no mínimo 6 caracteres.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const input: CreateUserInput = {
        name: formName.trim(),
        matricula: formMatricula.trim().toUpperCase(),
        email: formEmail.trim().toLowerCase(),
        department: formDept.trim() || 'Tecnologia da Informação',
        jobTitle: formJobTitle.trim() || 'Especialista de TI',
        role: formRole,
        password: formPassword.trim(),
      };

      const result = await adminService.createUser(input);
      if (result.success) {
        setFeedback({
          type: 'success',
          message: `Usuário "${input.name}" cadastrado com sucesso sob o perfil ${input.role}!`,
        });
        // Reset form
        setFormName('');
        setFormMatricula('');
        setFormEmail('');
        setFormDept('');
        setFormJobTitle('');
        setFormPassword('');
        setFormRole('TECHNICIAN');
        setIsCreateModalOpen(false);
        await loadData();
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Erro ao registrar novo usuário.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Erro inesperado na criação do usuário.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordConfirm = async () => {
    if (!resetTargetUser) return;
    setIsResetting(true);
    setFeedback(null);
    try {
      const result = await adminService.resetPassword(resetTargetUser.id, 'SenhaSimples2026');
      if (result.success) {
        setFeedback({
          type: 'success',
          message: `A senha de ${resetTargetUser.name} (${resetTargetUser.matricula}) foi redefinida com sucesso para: SenhaSimples2026`,
        });
        setResetTargetUser(null);
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Erro ao redefinir a senha do usuário.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Erro inesperado ao redefinir a senha.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const techCount = users.filter((u) => u.role === 'TECHNICIAN').length;

  const getRoleBadge = (role: 'ADMIN' | 'TECHNICIAN') => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            Administrador (Acesso Total)
          </span>
        );
      case 'TECHNICIAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            Técnico Operacional
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Gestão de Usuários & Acessos</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 uppercase tracking-wider">
                  Exclusivo Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Controle de colaboradores e permissões de acesso no sistema
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer min-h-[42px]"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            id="btn-admin-add-user"
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer min-h-[42px]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Usuário</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs underline cursor-pointer"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* Role Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Contas</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{users.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Cadastrados no sistema</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Administradores</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-2">{adminCount}</p>
          <p className="text-[11px] text-purple-600/80 mt-0.5">Acesso irrestrito e gestão</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-blue-100 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Técnicos (N2)</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">{techCount}</p>
          <p className="text-[11px] text-blue-600/80 mt-0.5">Operações e trocas de bens</p>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Search and Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, matrícula, e-mail ou departamento..."
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filtrar por:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 cursor-pointer"
            >
              <option value="ALL">Todos os Perfis ({users.length})</option>
              <option value="ADMIN">Administradores ({adminCount})</option>
              <option value="TECHNICIAN">Técnicos ({techCount})</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-4">Matrícula</th>
                <th className="py-3 px-4">Lotação / Cargo</th>
                <th className="py-3 px-4">Papel no Sistema (RBAC)</th>
                <th className="py-3 px-4">Privilégio</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Nenhum colaborador encontrado com os critérios pesquisados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase();
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900 truncate">{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-medium">
                                  Você
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block truncate">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {u.matricula}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 block truncate">{u.jobTitle}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{u.department}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {getRoleBadge(u.role)}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {u.role === 'ADMIN' && (
                          <span className="text-purple-800 font-medium">Gestão total, rotas de administração e criação de contas</span>
                        )}
                        {u.role === 'TECHNICIAN' && (
                          <span className="text-blue-800 font-medium">Substituição de bens e cadastro de inventário</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {u.role === 'TECHNICIAN' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setResetTargetUser(u);
                              setCopiedPassword(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                            title={`Resetar senha de ${u.name} para SenhaSimples2026`}
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span>Resetar Senha</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium italic">Admin</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Reset de Senha de Usuário Técnico */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Resetar Senha de Técnico</h2>
                  <p className="text-xs text-slate-500">Definição de senha genérica de acesso</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetTargetUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* Card de Informações do Técnico */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Colaborador:</span>
                  <span className="font-bold text-slate-900">{resetTargetUser.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Matrícula:</span>
                  <span className="font-mono font-bold text-slate-800">{resetTargetUser.matricula}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">E-mail:</span>
                  <span className="text-slate-700">{resetTargetUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Lotação:</span>
                  <span className="text-slate-700">{resetTargetUser.department}</span>
                </div>
              </div>

              {/* Informação e Destaque da Senha Genérica */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-900 font-medium mb-2">
                  A credencial de acesso desta conta técnica será redefinida para a senha genérica:
                </p>
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-amber-300 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-mono font-bold text-sm text-slate-900 tracking-wider select-all">
                      SenhaSimples2026
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('SenhaSimples2026');
                      setCopiedPassword(true);
                      setTimeout(() => setCopiedPassword(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 px-2.5 py-1 rounded bg-amber-100/70 hover:bg-amber-200/80 transition-colors cursor-pointer"
                    title="Copiar senha genérica"
                  >
                    {copiedPassword ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-700" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ao confirmar, a alteração entra em vigor no mesmo instante. O técnico poderá acessar a plataforma digitando a matrícula ou e-mail com a nova senha.
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleResetPasswordConfirm}
                  disabled={isResetting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isResetting ? (
                    <span>Redefinindo...</span>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Confirmar Reset de Senha</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Novo Usuário */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Novo Colaborador</h2>
                  <p className="text-xs text-slate-500">Cadastre um usuário e defina suas permissões de acesso</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Gabriela Costa Ramos"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Matrícula Funcional *
                  </label>
                  <input
                    type="text"
                    required
                    value={formMatricula}
                    onChange={(e) => setFormMatricula(e.target.value.toUpperCase())}
                    placeholder="Ex: TEC-8820"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="gabriela.costa@empresa.com.br"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departamento / Setor
                  </label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    placeholder="Suporte de TI & Gestão de Ativos"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    value={formJobTitle}
                    onChange={(e) => setFormJobTitle(e.target.value)}
                    placeholder="Analista de TI N2"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Papel de Acesso (RBAC) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormRole('TECHNICIAN')}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      formRole === 'TECHNICIAN'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-blue-600 mb-1" />
                    <span className="text-xs font-bold block">Técnico</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Operações & Trocas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormRole('ADMIN')}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      formRole === 'ADMIN'
                        ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-600 mb-1" />
                    <span className="text-xs font-bold block">Admin</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">Acesso Total</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Senha Provisória de Acesso *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  A senha será criptografada com hash bcrypt antes da gravação.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Cadastrando...</span>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Salvar Usuário</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
