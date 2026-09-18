import React from 'react';
import { 
  ArrowLeftRight, 
  PackagePlus, 
  Boxes, 
  History, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Laptop, 
  RotateCcw, 
  TrendingUp, 
  Building, 
  Wrench, 
  FileText, 
  Shield
} from 'lucide-react';
import { UserProfile, Equipment, MovementRecord } from '../types';

interface HomeScreenProps {
  currentUser: UserProfile;
  equipments: Equipment[];
  movements: MovementRecord[];
  onNavigateToEquipment?: () => void;
  onNavigateToEquipmentList?: () => void;
  onNavigateToNewEquipment?: () => void;
  onNavigateToMovements: () => void;
  onOpenNewTransfer: () => void;
  onNavigateToAdmin?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  equipments,
  movements,
  onNavigateToEquipment,
  onNavigateToEquipmentList,
  onNavigateToNewEquipment,
  onNavigateToMovements,
  onOpenNewTransfer,
  onNavigateToAdmin,
}) => {
  const isAdmin = currentUser.roleCode === 'ADMIN' || currentUser.email.toLowerCase().includes('admin');

  const handleGoToNewEquipment = onNavigateToNewEquipment || onNavigateToEquipment || (() => {});
  const handleGoToEquipmentList = onNavigateToEquipmentList || onNavigateToEquipment || (() => {});
  // Stats
  const totalEquipments = equipments.length;
  const availableEquipments = equipments.filter((e) => e.status === 'Disponível').length;
  const inUseEquipments = equipments.filter((e) => e.status === 'Em Uso').length;
  const maintenanceEquipments = equipments.filter((e) => e.status === 'Em Manutenção').length;
  const recollectedEquipments = equipments.filter((e) => e.status === 'Recolhido').length;
  const totalMovements = movements.length;
  const reversedReturns = movements.filter(
    (m) => m.oldEquipment.destination === 'Devolução ao Almoxarifado'
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onOpenNewTransfer}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors min-h-[44px] cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4 shrink-0" />
          <span>Fazer Nova Transferência de Equipamento</span>
        </button>

        <button
          type="button"
          onClick={handleGoToNewEquipment}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-xs transition-colors min-h-[44px] cursor-pointer"
        >
          <PackagePlus className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Cadastrar Novo Ativo</span>
        </button>

        {isAdmin && onNavigateToAdmin && (
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors min-h-[44px] cursor-pointer"
            title="Abrir Painel de Gestão de Usuários"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Gestão de Usuários</span>
          </button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        <div 
          onClick={handleGoToEquipmentList}
          className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
              Total de Ativos
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
              <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">{totalEquipments}</span>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Registrados no sistema</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Disponíveis p/ Entrega
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Laptop className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-2xl font-bold text-emerald-600">{availableEquipments}</span>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Prontos no estoque</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Trocas Concluídas
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-2xl font-bold text-indigo-600">{totalMovements}</span>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Substituições feitas</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Logística Reversa
            </span>
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-xl sm:text-2xl font-bold text-amber-600">{reversedReturns}</span>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">Devolvidos ao almox.</p>
          </div>
        </div>
      </div>

      {/* Status Operacional dos Ativos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Boxes className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Status Operacional dos Ativos</h3>
            </div>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalEquipments} no inventário
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Ciclo de vida dos equipamentos e prontidão operacional para atendimento em campo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-emerald-900 block">Disponível (Estoque)</span>
                  <span className="text-[10px] text-emerald-700">Prontos para rollout</span>
                </div>
              </div>
              <span className="text-base font-bold text-emerald-700 ml-2">{availableEquipments}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-blue-900 block">Em Uso (Operação)</span>
                  <span className="text-[10px] text-blue-700">Com termo assinado</span>
                </div>
              </div>
              <span className="text-base font-bold text-blue-700 ml-2">{inUseEquipments}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-amber-900 block">Em Manutenção</span>
                  <span className="text-[10px] text-amber-700">Troca de peças / Reparo</span>
                </div>
              </div>
              <span className="text-base font-bold text-amber-700 ml-2">{maintenanceEquipments}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50/70 border border-purple-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-purple-900 block">Recolhido / Triagem</span>
                  <span className="text-[10px] text-purple-700">Logística reversa</span>
                </div>
              </div>
              <span className="text-base font-bold text-purple-700 ml-2">{recollectedEquipments}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Rastreabilidade Contínua do Inventário</span>
          <button
            type="button"
            onClick={handleGoToEquipmentList}
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer hover:underline"
          >
            Consultar Inventário Completo ➔
          </button>
        </div>
      </div>
    </div>
  );
};
