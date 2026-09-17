import React, { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  BadgeCheck, 
  Building2, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  LogOut, 
  Save, 
  ShieldCheck, 
  FileCheck2, 
  Sliders,
  History,
  Laptop
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
  onUpdateUser,
  onLogout,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [matricula, setMatricula] = useState(currentUser.matricula);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);
  const [role, setRole] = useState(currentUser.role);
  const [isSaved, setIsSaved] = useState(false);

  // Filter movements executed by this tech
  const userMovements = movements.filter(
    (m) =>
      m.techResponsible.toLowerCase() === currentUser.matricula.toLowerCase() ||
      m.techResponsible.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
  );

  const totalReplacements = userMovements.length;
  const verifiedChecklists = userMovements.filter((m) =>
    Object.values(m.checklist).every(Boolean)
  ).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: name.trim(),
      matricula: matricula.trim().toUpperCase(),
      email: email.trim(),
      department: department.trim(),
      role: role.trim(),
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Substituições Realizadas</span>
            <History className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalReplacements}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Atendimentos de troca com termo</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Checklists 100% Válidos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{verifiedChecklists}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Backup, AD e perfil configurados</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Auditoria de Custódia</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">100%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Conformidade com termos digitais</p>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-blue-600" />
              Dados Cadastrais do Profissional
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Atualize as informações do seu crachá digital corporativo
            </p>
          </div>
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Alterações salvas com sucesso!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <input
                  id="input-profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula / Registro de Técnico *
              </label>
              <div className="relative">
                <input
                  id="input-profile-matricula"
                  type="text"
                  required
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm uppercase font-mono text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Corporativo *
              </label>
              <div className="relative">
                <input
                  id="input-profile-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cargo / Função *
              </label>
              <div className="relative">
                <input
                  id="input-profile-role"
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departamento / Setor de TI *
              </label>
              <div className="relative">
                <input
                  id="input-profile-dept"
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              id="btn-save-profile"
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados Cadastrais</span>
            </button>
          </div>
        </form>
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
