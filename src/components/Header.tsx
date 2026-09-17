import React from 'react';
import { 
  Home, 
  PackagePlus, 
  ArrowLeftRight, 
  UserCircle, 
  LogOut, 
  Laptop,
  Boxes
} from 'lucide-react';
import { UserProfile } from '../types';

export type ActiveTab = 'home' | 'equipment-list' | 'new-equipment' | 'movements' | 'profile';

interface HeaderProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  onOpenNewMovementModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col items-center justify-center shadow-sm gap-0.5 py-1">
              <Laptop className="w-4 h-4 text-white shrink-0" strokeWidth={2.2} />
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-200 shrink-0" strokeWidth={2.6} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight [font-family:'Montserrat_Alternates',sans-serif] not-italic">
                  BensTracker
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium [font-family:'Montserrat',sans-serif]">Controle de Ativos</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5">
            <button
              id="nav-home"
              type="button"
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">Início</span>
            </button>

            <button
              id="nav-equipment-list"
              type="button"
              onClick={() => onSelectTab('equipment-list')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'equipment-list'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Boxes className="w-4 h-4 shrink-0" />
              <span>Equipamentos Cadastrados</span>
            </button>

            <button
              id="nav-new-equipment"
              type="button"
              onClick={() => onSelectTab('new-equipment')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'new-equipment'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PackagePlus className="w-4 h-4 shrink-0" />
              <span>Registrar Equipamento</span>
            </button>

            <button
              id="nav-movements"
              type="button"
              onClick={() => onSelectTab('movements')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'movements'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 shrink-0" />
              <span>Movimentações</span>
            </button>

            <button
              id="nav-profile"
              type="button"
              onClick={() => onSelectTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Perfil</span>
            </button>
          </nav>

          {/* User badge and logout */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
            <div 
              className="text-right cursor-pointer hidden lg:block"
              onClick={() => onSelectTab('profile')}
            >
              <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 font-mono">{currentUser.matricula}</p>
            </div>
            
            <button
              id="btn-logout-header"
              type="button"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sair do sistema"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
