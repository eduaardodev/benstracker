import { Equipment, MovementRecord } from '../types';
import { authService } from './authService';

export const apiService = {
  async fetchEquipments(search?: string, status?: string): Promise<Equipment[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status && status !== 'Todos') params.append('status', status);

      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/equipments${query}`, {
        headers: authService.getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error('Falha ao carregar bens patrimoniais.');
      }

      const data = await res.json();
      return data.equipments || [];
    } catch (err) {
      console.error('Erro ao buscar equipamentos:', err);
      return [];
    }
  },

  async createEquipment(equipment: Equipment): Promise<{ success: boolean; data?: Equipment; error?: string }> {
    try {
      const res = await fetch('/api/equipments', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(equipment),
      });

      const data = await res.json();
      if (!res.ok) {
        const detail = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detail || data?.error?.message || 'Falha ao cadastrar equipamento no servidor.',
        };
      }

      return {
        success: true,
        data: data.equipment,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro de conexão com o servidor.',
      };
    }
  },

  async fetchMovements(): Promise<MovementRecord[]> {
    try {
      const res = await fetch('/api/movements', {
        headers: authService.getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error('Falha ao carregar histórico de movimentações.');
      }

      const data = await res.json();
      return data.movements || [];
    } catch (err) {
      console.error('Erro ao buscar movimentações:', err);
      return [];
    }
  },

  async createMovement(record: MovementRecord): Promise<{ success: boolean; data?: MovementRecord; error?: string }> {
    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(record),
      });

      const data = await res.json();
      if (!res.ok) {
        const detail = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detail || data?.error?.message || 'Falha ao registrar movimentação no servidor.',
        };
      }

      return {
        success: true,
        data: data.movement,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro de conexão com o servidor.',
      };
    }
  },
};
