import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  Laptop,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Loader2,
  HelpCircle,
  X,
  UserCheck,
  ShieldCheck,
  ClipboardCheck,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { DEMO_USERS, LocalUserDefinition } from '../services/localAuthService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number>(-1);

  const handleSelectDemo = (demo: LocalUserDefinition, index: number, autoSubmit: boolean = false) => {
    setLoginIdentifier(demo.email);
    setLoginPassword(demo.password);
    setSelectedDemoIndex(index);
    setLoginError('');

    if (autoSubmit) {
      executeLogin(demo.email, demo.password);
    }
  };

  const executeLogin = async (idToUse: string, passToUse: string) => {
    setLoginError('');
    setIsLoading(true);

    try {
      const result = await authService.login(idToUse, passToUse);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setLoginError(result.error || 'Credenciais inválidas. Verifique os dados informados.');
      }
    } catch {
      setLoginError('Não foi possível conectar ao serviço. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('Por favor, informe o e-mail ou matrícula e a senha.');
      return;
    }
    await executeLogin(loginIdentifier, loginPassword);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20 mb-3 gap-0.5 py-1.5">
          <Laptop className="w-6 h-6 text-white shrink-0" strokeWidth={2.2} />
          <ArrowLeftRight className="w-5 h-5 text-blue-200 shrink-0" strokeWidth={2.6} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight [font-family:'Montserrat_Alternates',sans-serif]">
          BensTracker
        </h1>
        <p className="text-sm sm:text-base font-bold text-blue-700 mt-0.5 tracking-tight">
          Sistema de Movimentação de Bens & Patrimônio
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Controle patrimonial de TI, transferências de equipamentos e auditoria
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Acesso ao Sistema</h2>
          <p className="text-xs text-slate-500 mt-1">
            Informe suas credenciais corporativas ou selecione uma conta de demonstração abaixo.
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Acesso Rápido para Teste
            </span>
            <span className="text-[10px] text-blue-600 font-medium">1-Clique</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {DEMO_USERS.map((demo, idx) => {
              const isSelected = selectedDemoIndex === idx;
              const Icon = demo.role === 'ADMIN' ? ShieldCheck : demo.role === 'VIEWER' ? ClipboardCheck : UserCheck;
              const roleLabel = demo.role === 'ADMIN' ? 'Admin' : demo.role === 'VIEWER' ? 'Auditor' : 'Técnico';

              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleSelectDemo(demo, idx, false)}
                  className={`p-2 rounded-lg text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs'
                      : 'bg-white hover:bg-slate-100/70 border-slate-200 text-slate-700'
                  }`}
                  title={`${demo.name} (${demo.email})`}
                >
                  <div className="flex items-center gap-1">
                    <Icon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="text-[11px] font-bold leading-none truncate">{roleLabel}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 truncate block mt-1 font-mono">
                    {demo.password}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loginError && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              E-mail Corporativo ou Matrícula
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-login-id"
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => {
                  setLoginIdentifier(e.target.value);
                  setSelectedDemoIndex(-1);
                  setLoginError('');
                }}
                placeholder="nome.sobrenome@empresa.com.br ou matrícula"
                autoComplete="username"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Senha
              </label>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Esqueceu a senha?</span>
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-login-pass"
                type={showPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setSelectedDemoIndex(-1);
                  setLoginError('');
                }}
                placeholder="Informe sua senha"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-xs select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Manter conectado neste dispositivo</span>
            </label>
          </div>

          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Acessando...</span>
              </>
            ) : (
              <>
                <span>Acessar o Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Corporate Footer */}
      <footer className="mt-6 text-center text-xs text-slate-500 space-y-1">
        <p>Acesso restrito a colaboradores e técnicos autorizados.</p>
        <p className="text-slate-400">BensTracker © {new Date().getFullYear()} • Compatível com Vercel, Docker & Modo Autônomo</p>
      </footer>

      {/* Modal de Ajuda / Recuperação de Senha */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Recuperação de Acesso
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Por motivos de conformidade patrimonial e segurança corporativa, a redefinição de senhas é gerenciada pela equipe de Governança de TI.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <p className="font-semibold text-slate-800">Canais de Atendimento:</p>
                <p>• Central de Serviços / Service Desk: <strong>Ramal 4040</strong></p>
                <p>• E-mail: <strong>suporte.ti@empresa.com.br</strong></p>
                <p>• Horário: Segunda a sexta-feira, das 07h às 19h</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Compreendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
