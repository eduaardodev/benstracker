import { UserProfile } from '../types';

const TOKEN_KEY = 'benstracker_auth_token';

export interface LoginResult {
  success: boolean;
  user?: UserProfile;
  token?: string;
  error?: string;
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detailMsg = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detailMsg || data?.error?.message || 'Falha na autenticação.',
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

      return {
        success: true,
        user: userProfile,
        token,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Não foi possível conectar ao servidor de autenticação.',
      };
    }
  },

  async fetchCurrentUser(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch('/api/auth/me', {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        this.clearToken();
        return null;
      }

      const { user } = await response.json();
      return {
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
    } catch {
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        const detailMsg = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detailMsg || data?.error?.message || 'Falha ao atualizar senha.',
        };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro ao conectar ao servidor.',
      };
    }
  },

  async testAdminAuthorization(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('/api/admin/security-audit', {
        headers: this.getAuthHeaders(),
      });
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
