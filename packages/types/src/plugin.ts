export interface PluginCommandConfig {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  category: string;
  adminOnly?: boolean;
}

export interface PluginDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  icon: string;
  author: string;
  commands: PluginCommandConfig[];
  defaultConfig?: Record<string, any>;
}

export interface BotPluginState {
  id: string;
  botId: string;
  pluginId: string;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
