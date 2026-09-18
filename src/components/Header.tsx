import React, { useState } from 'react';
import { 
  Home, 
  PackagePlus, 
  ArrowLeftRight, 
  UserCircle, 
  LogOut, 
  Laptop,
  Boxes,
  Menu,
  X,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { UserProfile } from '../types';

export type ActiveTab = 'home' | 'equipment-list' | 'new-equipment' | 'movements' | 'profile' | 'admin';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = currentUser.roleCode === 'ADMIN' || currentUser.email.toLowerCase().includes('admin');

  const handleTabClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand & Logo */}
            <div 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" 
              onClick={() => handleTabClick('home')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col items-center justify-center shadow-xs gap-0.5 py-1 shrink-0">
                <Laptop className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" strokeWidth={2.2} />
                <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-200 shrink-0" strokeWidth={2.6} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight [font-family:'Montserrat_Alternates',sans-serif] not-italic truncate">
                    BensTracker
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium [font-family:'Montserrat',sans-serif] truncate">
                  Controle de Ativos
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              <button
                id="nav-home"
                type="button"
                onClick={() => handleTabClick('home')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'home'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Início</span>
              </button>

              <button
                id="nav-equipment-list"
                type="button"
                onClick={() => handleTabClick('equipment-list')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'equipment-list'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Boxes className="w-4 h-4 shrink-0" />
                <span>Equipamentos</span>
              </button>

              <button
                id="nav-new-equipment"
                type="button"
                onClick={() => handleTabClick('new-equipment')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'new-equipment'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PackagePlus className="w-4 h-4 shrink-0" />
                <span>Cadastrar Ativo</span>
              </button>

              <button
                id="nav-movements"
                type="button"
                onClick={() => handleTabClick('movements')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'movements'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4 shrink-0" />
                <span>Movimentações</span>
              </button>

              {/* Aba Exclusiva do Administrador */}
              {isAdmin && (
                <button
                  id="nav-admin-users"
                  type="button"
                  onClick={() => handleTabClick('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    currentTab === 'admin'
                      ? 'bg-purple-50 text-purple-800 ring-1 ring-purple-200 font-semibold'
                      : 'text-purple-700 hover:bg-purple-50/70'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600" />
                  <span>Gestão & Acessos</span>
                </button>
              )}

              <button
                id="nav-profile"
                type="button"
                onClick={() => handleTabClick('profile')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <UserCircle className="w-4 h-4 shrink-0" />
                <span>Perfil</span>
              </button>
            </nav>

            {/* Right side items: Desktop user badge & logout, Mobile hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Badge indicativo de perfil */}
              <div 
                className="text-right cursor-pointer hidden lg:flex items-center gap-2"
                onClick={() => handleTabClick('profile')}
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{currentUser.matricula}</p>
                </div>
                {isAdmin ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Técnico
                  </span>
                )}
              </div>
              
              <button
                id="btn-logout-header"
                type="button"
                onClick={onLogout}
                className="hidden md:flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors items-center justify-center min-w-[36px] min-h-[36px] cursor-pointer"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile Menu Button */}
              <button
                id="btn-mobile-menu"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label="Abrir menu de navegação"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
              <div 
                className="cursor-pointer"
                onClick={() => handleTabClick('profile')}
              >
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">Matrícula: {currentUser.matricula}</p>
              </div>
              {isAdmin ? (
                <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold border border-purple-200">
                  Admin
                </span>
              ) : (
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                  Técnico N2
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleTabClick('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                currentTab === 'home'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Painel Inicial</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('equipment-list')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                currentTab === 'equipment-list'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Equipamentos Cadastrados</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('new-equipment')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                currentTab === 'new-equipment'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PackagePlus className="w-4 h-4" />
              <span>Cadastrar Novo Ativo</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('movements')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                currentTab === 'movements'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Movimentações & Trocas</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleTabClick('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  currentTab === 'admin'
                    ? 'bg-purple-50 text-purple-800 font-semibold'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Gestão de Usuários & Acessos</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleTabClick('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                currentTab === 'profile'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              <span>Meu Perfil</span>
            </button>

            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors min-h-[44px] cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair do Sistema</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <nav 
        aria-label="Navegação móvel inferior"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around"
      >
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors min-w-[52px] min-h-[48px] ${
            currentTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Início</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('equipment-list')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors min-w-[52px] min-h-[48px] ${
            currentTab === 'equipment-list' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-5 h-5 mb-0.5" />
          <span>Ativos</span>
        </button>

        {/* Botão Central: Novo Ativo */}
        <button
          type="button"
          onClick={() => handleTabClick('new-equipment')}
          className="flex flex-col items-center justify-center -mt-3 text-[10px] font-medium transition-transform active:scale-95 min-w-[52px]"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
            currentTab === 'new-equipment' ? 'bg-blue-700 text-white ring-2 ring-blue-300' : 'bg-blue-600 text-white'
          }`}>
            <PackagePlus className="w-5 h-5" />
          </div>
          <span className={`mt-0.5 ${currentTab === 'new-equipment' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>Novo</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('movements')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors min-w-[52px] min-h-[48px] ${
            currentTab === 'movements' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 mb-0.5" />
          <span>Trocas</span>
        </button>

        {isAdmin ? (
          <button
            type="button"
            onClick={() => handleTabClick('admin')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors min-w-[52px] min-h-[48px] ${
              currentTab === 'admin' ? 'text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5 text-purple-600" />
            <span>Admin</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors min-w-[52px] min-h-[48px] ${
              currentTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCircle className="w-5 h-5 mb-0.5" />
            <span>Perfil</span>
          </button>
        )}
      </nav>
    </>
  );
};
