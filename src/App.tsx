import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  UserProfile, 
  Equipment, 
  MovementRecord 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_EQUIPMENTS, 
  INITIAL_MOVEMENTS 
} from './data/mockData';
import { Header, ActiveTab } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { EquipmentScreen } from './components/EquipmentScreen';
import { MovementHistoryScreen } from './components/MovementHistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('app_is_authenticated');
    return savedAuth !== null ? JSON.parse(savedAuth) : true;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('app_current_user');
    return savedUser ? JSON.parse(savedUser) : INITIAL_USER;
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);

  // Equipments Data State (with localStorage persistence)
  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('app_equipments');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENTS;
  });

  // Movements Data State (with localStorage persistence)
  const [movements, setMovements] = useState<MovementRecord[]>(() => {
    const saved = localStorage.getItem('app_movements');
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  // Persist state updates
  useEffect(() => {
    localStorage.setItem('app_is_authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('app_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_equipments', JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem('app_movements', JSON.stringify(movements));
  }, [movements]);

  // Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAddEquipment = (equipment: Equipment) => {
    setEquipments((prev) => [equipment, ...prev]);
  };

  const handleAddMovement = (record: MovementRecord) => {
    setMovements((prev) => [record, ...prev]);

    // Update the statuses of old & new equipment automatically
    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.tag.toUpperCase() === record.oldEquipment.tag.toUpperCase()) {
          return {
            ...eq,
            status: 'Recolhido',
            conditionNotes: `Recolhido em ${record.timestamp}: Condição ${record.oldEquipment.condition} -> ${record.oldEquipment.destination}`,
          };
        }
        if (eq.tag.toUpperCase() === record.newEquipment.tag.toUpperCase()) {
          return {
            ...eq,
            status: 'Em Uso',
            assignedToUser: `${record.locationUser.userName} (${record.locationUser.userRegistration})`,
            assignedLocation: record.locationUser.sectorLocation,
          };
        }
        return eq;
      })
    );
  };

  const handleInitiateTransferWithEquipment = (_equipment: Equipment) => {
    setCurrentTab('movements');
    setOpenTransferModal(true);
  };

  const handleOpenNewTransfer = () => {
    setCurrentTab('movements');
    setOpenTransferModal(true);
  };

  // If not authenticated, render Login/Register Screen with Slide Tab
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Header & Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setOpenTransferModal(false);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 md:pb-8">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <HomeScreen
                currentUser={currentUser}
                equipments={equipments}
                movements={movements}
                onNavigateToEquipment={() => setCurrentTab('equipment-list')}
                onNavigateToEquipmentList={() => setCurrentTab('equipment-list')}
                onNavigateToNewEquipment={() => setCurrentTab('new-equipment')}
                onNavigateToMovements={() => setCurrentTab('movements')}
                onOpenNewTransfer={handleOpenNewTransfer}
              />
            </motion.div>
          )}

          {(currentTab === 'equipment-list' || currentTab === 'new-equipment') && (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <EquipmentScreen
                equipments={equipments}
                onAddEquipment={handleAddEquipment}
                onInitiateTransfer={handleInitiateTransferWithEquipment}
                activeSubTab={currentTab === 'new-equipment' ? 'register' : 'list'}
                onSubTabChange={(sub) => setCurrentTab(sub === 'register' ? 'new-equipment' : 'equipment-list')}
              />
            </motion.div>
          )}

          {currentTab === 'movements' && (
            <motion.div
              key="movements"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <MovementHistoryScreen
                movements={movements}
                equipments={equipments}
                currentUser={currentUser}
                onAddMovement={handleAddMovement}
                openNewTransferDirectly={openTransferModal}
              />
            </motion.div>
          )}

          {currentTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ProfileScreen
                currentUser={currentUser}
                movements={movements}
                onUpdateUser={(updated) => setCurrentUser(updated)}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Collapsible section for guidelines and operational asset lifecycle */}
          <details className="group mb-3 border-b border-slate-100 pb-3">
            <summary className="cursor-pointer select-none list-none flex items-center justify-between text-xs text-slate-500 hover:text-slate-700 transition-colors py-1">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Diretrizes de Movimentação & Status Operacional dos Ativos
              </span>
              <span className="flex items-center gap-1 text-[11px] text-blue-600 group-open:text-slate-500">
                <span className="group-open:hidden">Consultar normas operacionais</span>
                <span className="hidden group-open:inline">Ocultar normas</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-180" />
              </span>
            </summary>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Diretrizes Operacionais */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Procedimento Operacional Padrão de Movimentação (POP-TI)
                </h4>
                <ol className="space-y-2.5 text-[11px] text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-800">Conferência Física e Serial:</strong> Antes de liberar qualquer ativo, valide a etiqueta de patrimônio (PAT-XXXXXX) contra o Serial de fábrica (S/N) gravado na BIOS e no chassi.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-800">Conformidade LGPD e Sanitização:</strong> Todo equipamento recolhido deve passar por backup assistido do usuário e processo de sanitização lógica segura antes do retorno ao estoque ou destinação.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-800">Assinatura Obrigatória de Custódia:</strong> Nenhuma máquina nova ou substituída tem sua entrega homologada sem a rubrica digital formal do colaborador recebedor.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      4
                    </span>
                    <div>
                      <strong className="text-slate-800">Triagem Técnica da Devolução:</strong> O ativo retirado é classificado em até 48h para: estoque de contingência (funcional), bancada de reparo (defeito) ou descarte ecológico (sucata).
                    </div>
                  </li>
                </ol>
              </div>

              {/* Status Operacional dos Ativos */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Status Operacional dos Ativos (Ciclo de Vida)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Disponível (Estoque)
                      </div>
                      <p className="text-slate-500 text-[10px] mt-0.5">
                        Equipamento pronto, higienizado e formatado para entrega imediata.
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Em Uso (Operação)
                      </div>
                      <p className="text-slate-500 text-[10px] mt-0.5">
                        Alocado a colaborador ou posto com termo de responsabilidade ativo.
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Em Manutenção
                      </div>
                      <p className="text-slate-500 text-[10px] mt-0.5">
                        Em análise de hardware, troca de peças ou garantia técnica autorizada.
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1.5 font-semibold text-purple-700">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Recolhido / Logística Reversa
                      </div>
                      <p className="text-slate-500 text-[10px] mt-0.5">
                        Recolhido em substituição, aguardando triagem no almoxarifado.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Inventário Patrimonial Auditado</span>
                  <span className="font-semibold text-slate-700">Norma Corporativa ITAM</span>
                </div>
              </div>
            </div>
          </details>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>BensTracker • Sistema de Movimentação de Bens</p>
            <div className="flex items-center gap-4">
              <span>Sessão: {currentUser.matricula}</span>
              <span>Operador: {currentUser.name}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
