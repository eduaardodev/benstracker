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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Collapsible hidden section for guidelines and service status */}
          <details className="group mb-3 border-b border-slate-100 pb-3">
            <summary className="cursor-pointer select-none list-none flex items-center justify-between text-xs text-slate-500 hover:text-slate-700 transition-colors py-1">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Diretrizes de Movimentação & Status Operacional
              </span>
              <span className="flex items-center gap-1 text-[11px] text-blue-600 group-open:text-slate-500">
                <span className="group-open:hidden">Expandir detalhes</span>
                <span className="hidden group-open:inline">Ocultar</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-180" />
              </span>
            </summary>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Diretrizes */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Diretrizes de Movimentação
                </h4>
                <ol className="space-y-2 text-[11px] text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-800">Conferência de Patrimônio:</strong> Sempre valide
                      o código gravado na etiqueta (PAT-XXXXXX) e o Serial de fábrica (S/N) antes de liberar.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-800">Checklist Obrigatório:</strong> Garantir backup
                      local, ingresso no domínio e mapeamento de impressoras antes de recolher a máquina antiga.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-800">Aceite e Assinatura:</strong> Obter a rubrica ou
                      carimbo digital do colaborador formalizando a custódia do bem.
                    </div>
                  </li>
                </ol>
              </div>

              {/* Status dos Serviços */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Status dos Serviços Internos
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Active Directory sincronizado • Mapeamento de DNS corporativo operacional • Termos digitais criptografados com timestamp.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-blue-200/50 flex items-center justify-between text-[10px] text-blue-800">
                  <span>Monitoramento Ativo</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sistemas Operacionais
                  </span>
                </div>
              </div>
            </div>
          </details>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>BensTracker • Sistema de Movimentação de Bens</p>
            <div className="flex items-center gap-4">
              <span>Sessão: {currentUser.matricula}</span>
              <span>Ambiente: Produção Local</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
