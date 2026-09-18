import React, { useState } from 'react';
import { 
  UserCircle, 
  LogOut, 
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { UserProfile, MovementRecord } from '../types';
import { authService } from '../services/authService';

interface ProfileScreenProps {
  currentUser: UserProfile;
  movements: MovementRecord[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  movements,
  onLogout,
}) => {
  const { name, matricula, email, department, role, roleCode } = currentUser;

  // State for password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filter movements executed by this user/tech
  const userMovements = movements.filter(
    (m) =>
      m.techResponsible.toLowerCase() === currentUser.matricula.toLowerCase() ||
      m.techResponsible.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
  );

  const totalReplacements = userMovements.length;

  const getRoleLabel = () => {
    if (roleCode === 'ADMIN' || email.includes('admin')) return 'Administrador';
    if (roleCode === 'VIEWER' || email.includes('auditoria')) return 'Auditor de Patrimônio';
    return 'Suporte Técnico N2';
  };

  const getRoleBadgeStyle = () => {
    const r = roleCode || (email.includes('admin') ? 'ADMIN' : 'TECHNICIAN');
    if (r === 'ADMIN') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (r === 'VIEWER') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        message: 'Por favor, preencha todos os campos para alterar a senha.',
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({
        type: 'error',
        message: 'A nova senha deve possuir no mínimo 6 caracteres.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        message: 'A nova senha e a confirmação não conferem.',
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordFeedback({
          type: 'success',
          message: 'Sua senha de acesso foi atualizada com sucesso.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordFeedback({
          type: 'error',
          message: result.error || 'Não foi possível atualizar a senha. Verifique a senha atual.',
        });
      }
    } catch {
      setPasswordFeedback({
        type: 'error',
        message: 'Erro na comunicação com o servidor de autenticação.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getRoleBadgeStyle()}`}>
                {getRoleLabel()}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{currentUser.role}</p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Matrícula Funcional: <strong className="text-slate-700">{currentUser.matricula}</strong>
            </p>
          </div>
        </div>

        <button
          id="btn-profile-logout"
          type="button"
          onClick={onLogout}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Encerrar Sessão</span>
        </button>
      </div>

      {/* Dados Cadastrais */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="pb-4 mb-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-600" />
            Dados Cadastrais do Colaborador
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informações funcionais registradas para controle e custódia patrimonial
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Completo
            </label>
            <input
              id="input-profile-name"
              type="text"
              readOnly
              value={name}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Matrícula Funcional
            </label>
            <input
              id="input-profile-matricula"
              type="text"
              readOnly
              value={matricula}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium font-mono focus:outline-none cursor-default select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail Corporativo
            </label>
            <input
              id="input-profile-email"
              type="email"
              readOnly
              value={email}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cargo / Função
            </label>
            <input
              id="input-profile-role"
              type="text"
              readOnly
              value={role}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Departamento / Lotação
            </label>
            <input
              id="input-profile-dept"
              type="text"
              readOnly
              value={department}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Movimentações e Termos Vinculados
            </label>
            <input
              id="input-profile-replacements"
              type="text"
              readOnly
              value={`${totalReplacements} ${totalReplacements === 1 ? 'registro emitido' : 'registros emitidos'}`}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-700 font-semibold focus:outline-none cursor-default select-none"
            />
          </div>
        </div>
      </div>

      {/* Segurança da Conta: Alteração de Senha */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="pb-4 mb-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-700" />
            Segurança da Conta
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Altere sua senha de acesso periodicamente para manter sua conta protegida
          </p>
        </div>

        {passwordFeedback && (
          <div className={`mb-5 p-3 rounded-lg border text-xs flex items-center gap-2.5 ${
            passwordFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {passwordFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{passwordFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Senha Atual
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Informe sua senha atual"
                className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Atualizando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Salvar Nova Senha</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sessão e Conformidade */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div>
            <span className="font-semibold text-slate-800 block">Sessão Autenticada e Ativa</span>
            <span>Conectado como {currentUser.email} • Acesso concedido em conformidade com as políticas internas de TI</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[11px] shrink-0 font-medium">
          <FileCheck className="w-4 h-4 text-slate-400" />
          <span>Custódia Patrimonial Ativa</span>
        </div>
      </div>
    </div>
  );
};
