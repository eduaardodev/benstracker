import React from 'react';
import { 
  UserCircle, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { UserProfile, MovementRecord } from '../types';

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
  const { name, matricula, email, department, role } = currentUser;

  // Filter movements executed by this tech
  const userMovements = movements.filter(
    (m) =>
      m.techResponsible.toLowerCase() === currentUser.matricula.toLowerCase() ||
      m.techResponsible.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
  );

  const totalReplacements = userMovements.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
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
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                Técnico Credenciado
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
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex items-center gap-2 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Encerrar Sessão</span>
        </button>
      </div>

      {/* Dados Cadastrais do Profissional */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="pb-4 mb-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-600" />
            Dados Cadastrais do Profissional
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informações cadastrais e nível de acesso atribuídos pela administração de TI
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <input
                  id="input-profile-name"
                  type="text"
                  readOnly
                  value={name}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula / Registro de Técnico
              </label>
              <div className="relative">
                <input
                  id="input-profile-matricula"
                  type="text"
                  readOnly
                  value={matricula}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm uppercase font-mono text-slate-700 font-medium focus:outline-none cursor-default select-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Corporativo
              </label>
              <div className="relative">
                <input
                  id="input-profile-email"
                  type="email"
                  readOnly
                  value={email}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cargo / Função
              </label>
              <div className="relative">
                <input
                  id="input-profile-role"
                  type="text"
                  readOnly
                  value={role}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departamento / Setor de TI
              </label>
              <div className="relative">
                <input
                  id="input-profile-dept"
                  type="text"
                  readOnly
                  value={department}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none cursor-default select-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Métricas de Substituição
              </label>
              <div className="relative">
                <input
                  id="input-profile-replacements"
                  type="text"
                  readOnly
                  value={`${totalReplacements} ${totalReplacements === 1 ? 'troca efetuada com termo' : 'trocas efetuadas com termo'}`}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-700 font-semibold focus:outline-none cursor-default select-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Auditing Notice */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <div>
          <span className="font-bold text-slate-800 block">Auditoria de Segurança Patrimonial</span>
          Todas as movimentações e trocas associadas à matrícula {currentUser.matricula} são
          armazenadas com carimbo de tempo inviolável para auditorias de inventário físico anual.
        </div>
      </div>
    </div>
  );
};
