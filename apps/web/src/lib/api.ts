import {
  AuthResponse,
  Bot,
  BotCategory,
  BotCommand,
  BotConnectionStatus,
  BotCreateInput,
  BotLog,
  BotStats,
  BotUpdateInput,
  CategoryInput,
  CommandInput,
  MenuConfigInput,
  MenuTemplate,
  PluginDefinition,
  User,
} from '@mikasa/types';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('mikasa_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = { ...this.getHeaders(), ...(options.headers as any) };
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `Error en la solicitud (${response.status})`);
    }

    return data.data !== undefined ? data.data : data;
  }

  // Auth
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<{ user: User; botsCount: number }> {
    return this.request<{ user: User; botsCount: number }>('/api/auth/me');
  }

  // Bots
  async getBots(): Promise<(Bot & { commandsCount: number })[]> {
    return this.request<(Bot & { commandsCount: number })[]>('/api/bots');
  }

  async getBot(id: string): Promise<Bot & { categoriesCount: number; commandsCount: number; menu: MenuTemplate }> {
    return this.request<any>(`/api/bots/${id}`);
  }

  async createBot(data: BotCreateInput): Promise<Bot> {
    return this.request<Bot>('/api/bots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBot(id: string, data: BotUpdateInput): Promise<Bot> {
    return this.request<Bot>(`/api/bots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBot(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/bots/${id}`, {
      method: 'DELETE',
    });
  }

  // Connection
  async connectBot(id: string): Promise<BotConnectionStatus> {
    return this.request<BotConnectionStatus>(`/api/bots/${id}/connect`, {
      method: 'POST',
    });
  }

  async disconnectBot(id: string): Promise<BotConnectionStatus> {
    return this.request<BotConnectionStatus>(`/api/bots/${id}/disconnect`, {
      method: 'POST',
    });
  }

  async restartBot(id: string): Promise<BotConnectionStatus> {
    return this.request<BotConnectionStatus>(`/api/bots/${id}/restart`, {
      method: 'POST',
    });
  }

  async requestPairingCode(id: string, phoneNumber: string): Promise<{ pairingCode: string }> {
    return this.request<{ pairingCode: string }>(`/api/bots/${id}/pair-code`, {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async getBotStatus(id: string): Promise<BotConnectionStatus> {
    return this.request<BotConnectionStatus>(`/api/bots/${id}/status`);
  }

  // Commands
  async getCommands(botId: string): Promise<BotCommand[]> {
    return this.request<BotCommand[]>(`/api/bots/${botId}/commands`);
  }

  async createCommand(botId: string, data: CommandInput): Promise<BotCommand> {
    return this.request<BotCommand>(`/api/bots/${botId}/commands`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCommand(botId: string, cmdId: string, data: Partial<CommandInput>): Promise<BotCommand> {
    return this.request<BotCommand>(`/api/bots/${botId}/commands/${cmdId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCommand(botId: string, cmdId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/bots/${botId}/commands/${cmdId}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(botId: string): Promise<(BotCategory & { commandsCount: number })[]> {
    return this.request<(BotCategory & { commandsCount: number })[]>(`/api/bots/${botId}/categories`);
  }

  async createCategory(botId: string, data: CategoryInput): Promise<BotCategory> {
    return this.request<BotCategory>(`/api/bots/${botId}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(botId: string, catId: string, data: Partial<CategoryInput>): Promise<BotCategory> {
    return this.request<BotCategory>(`/api/bots/${botId}/categories/${catId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(botId: string, catId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/bots/${botId}/categories/${catId}`, {
      method: 'DELETE',
    });
  }

  // Menu Customizer
  async getMenu(botId: string): Promise<{ config: MenuTemplate; preview: string }> {
    return this.request<{ config: MenuTemplate; preview: string }>(`/api/bots/${botId}/menu`);
  }

  async updateMenu(botId: string, data: MenuConfigInput): Promise<{ config: MenuTemplate; preview: string }> {
    return this.request<{ config: MenuTemplate; preview: string }>(`/api/bots/${botId}/menu`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async previewMenu(botId: string, data: MenuConfigInput): Promise<{ preview: string }> {
    return this.request<{ preview: string }>(`/api/bots/${botId}/menu/preview`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetMenu(botId: string): Promise<MenuTemplate> {
    return this.request<MenuTemplate>(`/api/bots/${botId}/menu/reset`, {
      method: 'POST',
    });
  }

  // Plugins
  async getPlugins(botId: string): Promise<PluginDefinition[]> {
    return this.request<PluginDefinition[]>(`/api/bots/${botId}/plugins`);
  }

  async togglePlugin(botId: string, pluginId: string, enabled: boolean): Promise<any> {
    return this.request<any>(`/api/bots/${botId}/plugins/${pluginId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
  }

  async updatePluginConfig(botId: string, pluginId: string, config: Record<string, any>): Promise<any> {
    return this.request<any>(`/api/bots/${botId}/plugins/${pluginId}/config`, {
      method: 'PATCH',
      body: JSON.stringify({ config }),
    });
  }

  // Logs & Stats
  async getLogs(botId: string, params?: { level?: string; search?: string; limit?: number }): Promise<BotLog[]> {
    const q = new URLSearchParams();
    if (params?.level) q.append('level', params.level);
    if (params?.search) q.append('search', params.search);
    if (params?.limit) q.append('limit', String(params.limit));

    return this.request<BotLog[]>(`/api/bots/${botId}/logs?${q.toString()}`);
  }

  async clearLogs(botId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/bots/${botId}/logs`, {
      method: 'DELETE',
    });
  }

  async getStats(botId: string): Promise<BotStats> {
    return this.request<BotStats>(`/api/bots/${botId}/stats`);
  }

  // Simulator
  async simulateCommand(botId: string, payload: { text: string; senderName?: string; isGroup?: boolean }): Promise<{ replyText?: string; executed: boolean }> {
    return this.request<{ replyText?: string; executed: boolean }>(`/api/bots/${botId}/simulate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Upload
  async uploadImage(dataUrl: string): Promise<{ url: string; filename: string }> {
    return this.request<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl }),
    });
  }
}

export const api = new ApiClient();
