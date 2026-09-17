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
  Building
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
}) => {
  const handleGoToNewEquipment = onNavigateToNewEquipment || onNavigateToEquipment || (() => {});
  const handleGoToEquipmentList = onNavigateToEquipmentList || onNavigateToEquipment || (() => {});
  // Stats
  const totalEquipments = equipments.length;
  const availableEquipments = equipments.filter((e) => e.status === 'Disponível').length;
  const totalMovements = movements.length;
  const reversedReturns = movements.filter(
    (m) => m.oldEquipment.destination === 'Devolução ao Almoxarifado'
  ).length;

  return (
    <div className="space-y-8">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={handleGoToEquipmentList}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
              Total de Ativos
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{totalEquipments}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Disponíveis para Entrega
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">{availableEquipments}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Prontos no estoque reserva</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Trocas Realizadas
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-indigo-600">{totalMovements}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Substituições concluídas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Logística Reversa
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600">{reversedReturns}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Devolvidos ao almoxarifado</p>
          </div>
        </div>
      </div>

      {/* Main Content: Recent Movements */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Últimas Movimentações Registradas</h2>
            <p className="text-xs text-slate-500">Histórico imediato de trocas executadas em campo</p>
          </div>

          <button
            type="button"
            onClick={onNavigateToMovements}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Ver Histórico Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {movements.slice(0, 4).map((mov) => (
            <div
              key={mov.id}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {mov.id}
                </span>
                <span className="text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {mov.timestamp}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-red-600 block uppercase">
                    Recolhido (Saiu):
                  </span>
                  <p className="font-mono font-bold text-slate-900">{mov.oldEquipment.tag}</p>
                  <p className="text-[11px] text-slate-500">
                    Motivo: {mov.oldEquipment.condition} ➔ {mov.oldEquipment.destination}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-emerald-600 block uppercase">
                    Entregue (Entrou):
                  </span>
                  <p className="font-mono font-bold text-slate-900">{mov.newEquipment.tag}</p>
                  <p className="text-[11px] text-slate-700 font-medium">
                    {mov.newEquipment.brandModel} ({mov.newEquipment.hostname})
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-600">
                <span>
                  Colaborador: <strong>{mov.locationUser.userName}</strong> ({mov.locationUser.userRegistration})
                </span>
                <span className="text-slate-500">
                  Setor: <em>{mov.locationUser.sectorLocation}</em>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
