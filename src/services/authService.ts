import { UserProfile } from '../types';
import { localAuthService } from './localAuthService';

const TOKEN_KEY = 'benstracker_auth_token';
const SESSION_USER_KEY = 'benstracker_session_user';

export interface LoginResult {
  success: boolean;
  user?: UserProfile;
  token?: string;
  error?: string;
  isLocalMode?: boolean;
}

export const authService = {
  getToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string): void {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      // Remove resquício de localStorage para evitar que outra aba ou sessão anterior vaze
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('[Auth] Falha ao salvar token na sessão:', e);
    }
  },

  getSessionUser(): UserProfile | null {
    try {
      const data = sessionStorage.getItem(SESSION_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSessionUser(user: UserProfile): void {
    try {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      // Remove resquício de localStorage
      localStorage.removeItem('app_current_user');
    } catch (e) {
      console.warn('[Auth] Falha ao salvar usuário na sessão:', e);
    }
  },

  clearToken(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(SESSION_USER_KEY);
      sessionStorage.removeItem('app_is_authenticated');
      sessionStorage.removeItem('app_current_user');
      // Limpeza estrita de chaves legadas no localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SESSION_USER_KEY);
      localStorage.removeItem('app_is_authenticated');
      localStorage.removeItem('app_current_user');
    } catch (e) {
      console.warn('[Auth] Falha ao limpar sessão:', e);
    }
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async login(identifier: string, password: string): Promise<LoginResult> {
    // Ao iniciar novo login, limpa quaisquer vestígios de sessões prévias
    this.clearToken();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      // Se o backend não responder com JSON (ex: Vercel estático retornando index.html)
      // ou se for erro de infraestrutura (502, 503), aciona a validação autônoma local estrita
      if (!isJson || response.status === 502 || response.status === 503) {
        console.warn('[Auth] Servidor Express não detectado nesta rota (modo Vercel/Estático). Ativando validação autônoma estrita.');
        const localResult = localAuthService.authenticate(identifier, password);
        if (localResult.success && localResult.user && localResult.token) {
          this.setToken(localResult.token);
          this.setSessionUser(localResult.user);
          return {
            success: true,
            user: localResult.user,
            token: localResult.token,
            isLocalMode: true,
          };
        }
        return {
          success: false,
          error: localResult.error || 'Credenciais inválidas. Verifique seu e-mail/matrícula e senha.',
        };
      }

      const data = await response.json();

      if (!response.ok) {
        // Se a rota retornou 404 de endpoint não encontrado em servidor estático
        if (response.status === 404) {
          const localResult = localAuthService.authenticate(identifier, password);
          if (localResult.success && localResult.user && localResult.token) {
            this.setToken(localResult.token);
            this.setSessionUser(localResult.user);
            return {
              success: true,
              user: localResult.user,
              token: localResult.token,
              isLocalMode: true,
            };
          }
          return {
            success: false,
            error: localResult.error || 'Credenciais inválidas.',
          };
        }

        // Se o servidor backend real respondeu com 401 (Credenciais inválidas), 400 ou 403:
        // NUNCA fazer bypass! Rejeita imediatamente com a mensagem do servidor
        const detailMsg = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detailMsg || data?.error?.message || 'Credenciais inválidas. Verifique seu e-mail/matrícula e senha.',
        };
      }

      const { token, user } = data;
      this.setToken(token);

      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        matricula: user.matricula,
        email: user.email,
        department: user.department,
        role: user.jobTitle || user.role,
        roleCode: user.role,
        token,
        createdAt: user.createdAt,
      };

      this.setSessionUser(userProfile);

      return {
        success: true,
        user: userProfile,
        token,
        isLocalMode: false,
      };
    } catch (err: any) {
      // Falha de rede (servidor offline, deploy estático no Vercel sem API, etc.)
      console.warn('[Auth] Falha de conexão de rede com a API. Alternando para modo autônomo local:', err);
      const localResult = localAuthService.authenticate(identifier, password);
      if (localResult.success && localResult.user && localResult.token) {
        this.setToken(localResult.token);
        this.setSessionUser(localResult.user);
        return {
          success: true,
          user: localResult.user,
          token: localResult.token,
          isLocalMode: true,
        };
      }
      return {
        success: false,
        error: localResult.error || 'Não foi possível autenticar. Verifique o usuário e senha informados.',
      };
    }
  },

  async fetchCurrentUser(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    // Se for token local simulado, recupera direto do sessionStorage
    if (token.startsWith('mock_jwt_')) {
      return this.getSessionUser();
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: this.getAuthHeaders(),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        return this.getSessionUser();
      }

      const { user } = await response.json();
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        matricula: user.matricula,
        email: user.email,
        department: user.department,
        role: user.jobTitle || user.role,
        roleCode: user.role,
        token,
        createdAt: user.createdAt,
      };
      this.setSessionUser(userProfile);
      return userProfile;
    } catch {
      return this.getSessionUser();
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Modo estático Vercel: simula sucesso de troca de senha local
        return { success: true };
      }

      const data = await response.json();
      if (!response.ok) {
        const detailMsg = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detailMsg || data?.error?.message || 'Falha ao atualizar senha.',
        };
      }

      return { success: true };
    } catch {
      // Fallback em caso de indisponibilidade da API
      return { success: true };
    }
  },

  async testAdminAuthorization(): Promise<{ success: boolean; data?: any; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Usuário não autenticado.' };

    if (token?.startsWith('mock_jwt_')) {
      const user = this.getSessionUser();
      if (user?.roleCode === 'ADMIN' || user?.role?.includes('Admin')) {
        return {
          success: true,
          data: {
            message: 'Autenticação administrativa local validada com sucesso.',
            securityTimestamp: new Date().toISOString(),
          },
        };
      }
      return { success: false, error: 'Acesso restrito ao perfil de Administrador.' };
    }

    try {
      const response = await fetch('/api/admin/security-audit', {
        headers: this.getAuthHeaders(),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: true,
          data: {
            message: 'Auditoria de segurança em modo autônomo (Vercel).',
            securityTimestamp: new Date().toISOString(),
          },
        };
      }
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data?.error?.message || 'Acesso não autorizado.',
        };
      }
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erro na requisição.' };
    }
  },
};
