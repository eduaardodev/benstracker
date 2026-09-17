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
  FileText
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
  const inUseEquipments = equipments.filter((e) => e.status === 'Em Uso').length;
  const maintenanceEquipments = equipments.filter((e) => e.status === 'Em Manutenção').length;
  const recollectedEquipments = equipments.filter((e) => e.status === 'Recolhido').length;
  const totalMovements = movements.length;
  const reversedReturns = movements.filter(
    (m) => m.oldEquipment.destination === 'Devolução ao Almoxarifado'
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Quick Action Buttons for Field Technicians */}
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

      {/* Main Content: Recent Movements */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Últimas Movimentações Registradas</h2>
            <p className="text-xs text-slate-500">Histórico imediato de trocas executadas em campo</p>
          </div>

          <button
            type="button"
            onClick={onNavigateToMovements}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 hover:underline cursor-pointer min-h-[36px] self-start sm:self-auto"
          >
            <span>Ver Histórico Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {movements.slice(0, 4).map((mov) => (
            <div
              key={mov.id}
              className="p-3 sm:p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-2 gap-2">
                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[11px] sm:text-xs">
                  {mov.id}
                </span>
                <span className="text-slate-500 font-mono flex items-center gap-1 text-[11px] sm:text-xs">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{mov.timestamp}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-red-50/50 border border-red-100 sm:bg-transparent sm:border-0 sm:p-0">
                  <span className="text-[10px] font-bold text-red-600 block uppercase">
                    Recolhido (Saiu):
                  </span>
                  <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{mov.oldEquipment.tag}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Motivo: <span className="font-medium">{mov.oldEquipment.condition}</span> ➔ {mov.oldEquipment.destination}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 sm:bg-transparent sm:border-0 sm:p-0">
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                    Entregue (Entrou):
                  </span>
                  <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{mov.newEquipment.tag}</p>
                  <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                    {mov.newEquipment.brandModel} ({mov.newEquipment.hostname})
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-600">
                <span>
                  Colaborador: <strong className="text-slate-800">{mov.locationUser.userName}</strong> ({mov.locationUser.userRegistration})
                </span>
                <span className="text-slate-500">
                  Setor: <em>{mov.locationUser.sectorLocation}</em>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diretrizes de Movimentação e Status Operacional dos Ativos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Status Operacional do Inventário */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
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

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-900 block">Disponível (Estoque Reserva)</span>
                    <span className="text-[10px] text-emerald-700">Higienizados e prontos para rollout imediato</span>
                  </div>
                </div>
                <span className="text-base font-bold text-emerald-700">{availableEquipments}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <div>
                    <span className="text-xs font-semibold text-blue-900 block">Em Operação (Em Uso)</span>
                    <span className="text-[10px] text-blue-700">Custódia formalizada com Termo assinado</span>
                  </div>
                </div>
                <span className="text-base font-bold text-blue-700">{inUseEquipments}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div>
                    <span className="text-xs font-semibold text-amber-900 block">Em Manutenção / Bancada</span>
                    <span className="text-[10px] text-amber-700">Em diagnóstico técnico ou troca de peças</span>
                  </div>
                </div>
                <span className="text-base font-bold text-amber-700">{maintenanceEquipments}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <div>
                    <span className="text-xs font-semibold text-purple-900 block">Recolhido / Triagem</span>
                    <span className="text-[10px] text-purple-700">Retirado da ponta em devolução reversa</span>
                  </div>
                </div>
                <span className="text-base font-bold text-purple-700">{recollectedEquipments}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Rastreabilidade Contínua</span>
            <button
              type="button"
              onClick={handleGoToEquipmentList}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer hover:underline"
            >
              Consultar Inventário ➔
            </button>
          </div>
        </div>

        {/* Diretrizes de Movimentação (Procedimento Padrão) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Diretrizes de Movimentação de Ativos</h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                POP TI & Compliance
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Padrões operacionais mandatórios para movimentação física, substituição e descarte de bens.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Conferência de Serial/BIOS</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Validação presencial obrigatória da plaqueta <strong className="text-slate-700 font-mono">PAT-XXXXXX</strong> com o Serial de fábrica (S/N) impresso na carcaça e na BIOS.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Backup & Sanitização LGPD</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Garantir backup dos dados do usuário antes da remoção e executar procedimento de sanitização lógica (wipe) no ativo recolhido.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Termo de Custódia Assinado</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Nenhum bem é entregue sem a assinatura digital ou física do Termo de Responsabilidade pelo colaborador solicitante.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>Triagem Técnica em 48h</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ativos substituídos devem ser triados em até 48h para reincorporação ao estoque reserva, encaminhamento a reparo ou baixa por sucata.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Procedimento Operacional Padrão • ITIL / ITAM</span>
            <button
              type="button"
              onClick={onOpenNewTransfer}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer hover:underline"
            >
              Registrar Movimentação ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
