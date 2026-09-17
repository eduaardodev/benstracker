import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  Laptop,
  ArrowLeftRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loginIdentifier, setLoginIdentifier] = useState('carlos.silva@empresa.com.br');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Informe o e-mail corporativo ou matrícula.');
      return;
    }
    setLoginError('');

    const user: UserProfile = {
      id: 'usr-001',
      name: loginIdentifier.includes('@') 
        ? loginIdentifier.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
        : 'Carlos Henrique Silva',
      matricula: loginIdentifier.startsWith('TEC-') ? loginIdentifier : 'TEC-9042',
      email: loginIdentifier.includes('@') ? loginIdentifier : 'carlos.silva@empresa.com.br',
      department: 'Suporte de TI & Gestão de Ativos',
      role: 'Analista de Infraestrutura e Field Support',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onLoginSuccess(user);
  };

  const fillDemoLogin = () => {
    setLoginIdentifier('carlos.silva@empresa.com.br');
    setLoginPassword('suporte@2026');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand header */}
      <div className="text-center mb-6">
        <div className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25 mb-3 gap-0.5 py-1.5">
          <Laptop className="w-6 h-6 text-white shrink-0" strokeWidth={2.2} />
          <ArrowLeftRight className="w-5 h-5 text-blue-200 shrink-0" strokeWidth={2.6} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight [font-family:'Montserrat_Alternates',sans-serif]">
          BensTracker
        </h1>
        <p className="text-base sm:text-lg font-bold text-blue-700 mt-0.5 tracking-tight">
          Sistema de Movimentação de Bens
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Gestão e controle de patrimônio, transferências de equipamentos e auditoria de TI
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Entrar com credenciais</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informe seu e-mail corporativo ou matrícula de técnico para acessar o painel
          </p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail Corporativo ou Matrícula
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-login-id"
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="ex.: carlos.silva@empresa.com.br ou TEC-9042"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-login-pass"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Lembrar meu acesso</span>
            </label>
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
              Esqueci a senha
            </span>
          </div>

          <button
            id="btn-submit-login"
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Entrar no Painel</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={fillDemoLogin}
              className="text-xs text-slate-500 hover:text-blue-600 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Preencher com credencial de demonstração (Técnico N2)
            </button>
          </div>
        </form>
      </div>

      {/* Footer disclaimer */}
      <div className="mt-6 text-center text-xs text-slate-500">
        Ambiente Corporativo Seguro • Conformidade com Termo de Responsabilidade e Controle Patrimonial
      </div>
    </div>
  );
};
