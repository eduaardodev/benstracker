import { Equipment, MovementRecord } from '../types';
import { authService } from './authService';
import { INITIAL_EQUIPMENTS, INITIAL_MOVEMENTS } from '../data/mockData';
import { sanitizeMovement, sanitizeMovementsList } from '../utils/movementSanitizer';

const LOCAL_EQUIPMENTS_KEY = 'app_equipments';
const LOCAL_MOVEMENTS_KEY = 'app_movements';

function getStoredEquipments(): Equipment[] {
  try {
    const saved = localStorage.getItem(LOCAL_EQUIPMENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('[Storage] Falha ao ler equipamentos locais:', e);
  }
  localStorage.setItem(LOCAL_EQUIPMENTS_KEY, JSON.stringify(INITIAL_EQUIPMENTS));
  return INITIAL_EQUIPMENTS;
}

function saveStoredEquipments(list: Equipment[]): void {
  try {
    localStorage.setItem(LOCAL_EQUIPMENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[Storage] Falha ao salvar equipamentos locais:', e);
  }
}

function getStoredMovements(): MovementRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_MOVEMENTS_KEY);
    if (saved) return sanitizeMovementsList(JSON.parse(saved));
  } catch (e) {
    console.warn('[Storage] Falha ao ler movimentações locais:', e);
  }
  const initial = sanitizeMovementsList(INITIAL_MOVEMENTS);
  localStorage.setItem(LOCAL_MOVEMENTS_KEY, JSON.stringify(initial));
  return initial;
}

function saveStoredMovements(list: MovementRecord[]): void {
  try {
    localStorage.setItem(LOCAL_MOVEMENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[Storage] Falha ao salvar movimentações locais:', e);
  }
}

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

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        // Fallback autônomo (Vercel/Offline)
        let local = getStoredEquipments();
        if (search) {
          const s = search.toLowerCase();
          local = local.filter(
            (e) =>
              e.tag.toLowerCase().includes(s) ||
              e.brandModel.toLowerCase().includes(s) ||
              e.serialNumber.toLowerCase().includes(s)
          );
        }
        if (status && status !== 'Todos') {
          local = local.filter((e) => e.status === status);
        }
        return local;
      }

      const data = await res.json();
      const serverEquipments = data.equipments || [];
      if (serverEquipments.length > 0) {
        saveStoredEquipments(serverEquipments);
      }
      return serverEquipments;
    } catch {
      // Fallback em caso de erro de rede ou deploy estático no Vercel
      return getStoredEquipments();
    }
  },

  async createEquipment(equipment: Equipment): Promise<{ success: boolean; data?: Equipment; error?: string }> {
    try {
      const res = await fetch('/api/equipments', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(equipment),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json') || res.status === 404 || res.status === 502) {
        // Fallback local Vercel: salva localmente
        const currentList = getStoredEquipments();
        const updatedList = [equipment, ...currentList.filter((e) => e.id !== equipment.id)];
        saveStoredEquipments(updatedList);
        return { success: true, data: equipment };
      }

      const data = await res.json();
      if (!res.ok) {
        // Se falhou por validação real do servidor, retorna mensagem
        const detail = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detail || data?.error?.message || 'Falha ao cadastrar equipamento.',
        };
      }

      const saved = data.equipment || equipment;
      const currentList = getStoredEquipments();
      saveStoredEquipments([saved, ...currentList.filter((e) => e.id !== saved.id)]);
      return {
        success: true,
        data: saved,
      };
    } catch {
      // Falha de rede: salva localmente para não bloquear a experiência do usuário no Vercel
      const currentList = getStoredEquipments();
      const updatedList = [equipment, ...currentList.filter((e) => e.id !== equipment.id)];
      saveStoredEquipments(updatedList);
      return {
        success: true,
        data: equipment,
      };
    }
  },

  async fetchMovements(): Promise<MovementRecord[]> {
    try {
      const res = await fetch('/api/movements', {
        headers: authService.getAuthHeaders(),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        return getStoredMovements();
      }

      const data = await res.json();
      const serverMovements = sanitizeMovementsList(data.movements || []);
      if (serverMovements.length > 0) {
        saveStoredMovements(serverMovements);
      }
      return serverMovements;
    } catch {
      return getStoredMovements();
    }
  },

  async createMovement(record: MovementRecord): Promise<{ success: boolean; data?: MovementRecord; error?: string }> {
    const sanitized = sanitizeMovement(record);
    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(sanitized),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json') || res.status === 404 || res.status === 502) {
        // Fallback local Vercel: salva localmente
        const currentList = getStoredMovements();
        const updatedList = [sanitized, ...currentList.filter((m) => m.id !== sanitized.id)];
        saveStoredMovements(updatedList);
        return { success: true, data: sanitized };
      }

      const data = await res.json();
      if (!res.ok) {
        const detail = data?.error?.details?.[0]?.message;
        return {
          success: false,
          error: detail || data?.error?.message || 'Falha ao registrar movimentação.',
        };
      }

      const saved = sanitizeMovement(data.movement || sanitized);
      const currentList = getStoredMovements();
      saveStoredMovements([saved, ...currentList.filter((m) => m.id !== saved.id)]);
      return {
        success: true,
        data: saved,
      };
    } catch {
      // Falha de rede: salva localmente
      const currentList = getStoredMovements();
      const updatedList = [sanitized, ...currentList.filter((m) => m.id !== sanitized.id)];
      saveStoredMovements(updatedList);
      return {
        success: true,
        data: sanitized,
      };
    }
  },
};
