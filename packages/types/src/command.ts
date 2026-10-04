export interface CommandPermission {
  allowPrivate: boolean;
  allowGroup: boolean;
  adminOnly: boolean;
  ownerOnly: boolean;
}

export interface BotCommand {
  id: string;
  botId: string;
  categoryId?: string | null;
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  response: string;
  enabled: boolean;
  permissions: CommandPermission;
  isPlugin?: boolean;
  pluginId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommandInput {
  name: string;
  aliases?: string[];
  categoryId?: string | null;
  description: string;
  usage: string;
  response: string;
  enabled?: boolean;
  permissions?: Partial<CommandPermission>;
}

export interface CommandExecutionResult {
  success: boolean;
  commandName: string;
  botId: string;
  replyText?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'sticker' | 'document';
  mentions?: string[];
  error?: string;
  executionTimeMs: number;
}
