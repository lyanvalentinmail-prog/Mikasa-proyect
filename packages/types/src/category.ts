export interface BotCategory {
  id: string;
  botId: string;
  name: string;
  icon: string;
  symbol?: string;
  description: string;
  order: number;
  commandsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
  icon?: string;
  symbol?: string;
  description?: string;
  order?: number;
}
