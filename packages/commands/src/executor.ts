import { BotCommand, CommandExecutionResult } from '@mikasa/types';
import { resolveTemplateVariables } from '@mikasa/shared';

export interface CommandContext {
  bot: {
    id: string;
    name: string;
    prefix: string;
    developer: string;
    website: string;
    type?: string;
  };
  sender: {
    id: string;
    name: string;
    number: string;
    isAdmin: boolean;
    isOwner: boolean;
  };
  chat: {
    id: string;
    isGroup: boolean;
    groupName?: string;
    groupMembers?: string[];
  };
  message: {
    text: string;
    args: string[];
    rawArgs: string;
    mentionedJids?: string[];
  };
  pluginHandler?: (
    commandName: string,
    ctx: CommandContext
  ) => Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null>;
}

export async function executeCommand(
  command: BotCommand,
  ctx: CommandContext
): Promise<CommandExecutionResult> {
  const startTime = Date.now();

  // Permission Checks
  if (ctx.chat.isGroup && !command.permissions.allowGroup) {
    return {
      success: false,
      commandName: command.name,
      botId: ctx.bot.id,
      error: 'Este comando solo puede ser utilizado en chats privados.',
      executionTimeMs: Date.now() - startTime,
    };
  }

  if (!ctx.chat.isGroup && !command.permissions.allowPrivate) {
    return {
      success: false,
      commandName: command.name,
      botId: ctx.bot.id,
      error: 'Este comando solo puede ser utilizado en grupos.',
      executionTimeMs: Date.now() - startTime,
    };
  }

  if (command.permissions.adminOnly && !ctx.sender.isAdmin && !ctx.sender.isOwner) {
    return {
      success: false,
      commandName: command.name,
      botId: ctx.bot.id,
      error: '⛔ Este comando es exclusivo para administradores del grupo.',
      executionTimeMs: Date.now() - startTime,
    };
  }

  if (command.permissions.ownerOnly && !ctx.sender.isOwner) {
    return {
      success: false,
      commandName: command.name,
      botId: ctx.bot.id,
      error: '👑 Este comando es exclusivo para el creador del bot.',
      executionTimeMs: Date.now() - startTime,
    };
  }

  // If plugin handler is available and can process this
  if (ctx.pluginHandler) {
    try {
      const pluginResult = await ctx.pluginHandler(command.name, ctx);
      if (pluginResult && (pluginResult.replyText || pluginResult.mediaUrl)) {
        return {
          success: true,
          commandName: command.name,
          botId: ctx.bot.id,
          replyText: pluginResult.replyText,
          mediaUrl: pluginResult.mediaUrl,
          mediaType: pluginResult.mediaType,
          executionTimeMs: Date.now() - startTime,
        };
      }
    } catch (err: any) {
      console.error(`[PluginExecutionError] ${command.name}:`, err);
    }
  }

  // Standard Template Response Evaluation
  const mentionText = ctx.message.mentionedJids?.length
    ? ctx.message.mentionedJids.map((j) => `@${j.split('@')[0]}`).join(' ')
    : ctx.message.rawArgs || '@usuario';

  const groupMentions = (ctx.chat.groupMembers || [])
    .map((m) => `• @${m.split('@')[0]}`)
    .join('\n');

  const variables: Record<string, string | number> = {
    'bot.id': ctx.bot.id,
    'bot.name': ctx.bot.name,
    'bot.prefix': ctx.bot.prefix,
    'bot.developer': ctx.bot.developer,
    'bot.website': ctx.bot.website,
    'bot.type': ctx.bot.type || 'WhatsApp Sub-bot',
    'user.name': ctx.sender.name,
    'user.number': ctx.sender.number,
    args: ctx.message.rawArgs || '',
    mention: mentionText,
    'group.name': ctx.chat.groupName || 'Chat Grupal',
    'group.mentions': groupMentions,
    respuesta: ctx.message.rawArgs ? `Has consultado sobre "${ctx.message.rawArgs}". Procesado con éxito.` : 'Hola, ¿en qué puedo ayudarte hoy?',
    latency: Math.floor(Math.random() * 35) + 12,
    uptime: '4h 32m',
    date: new Date().toLocaleDateString('es-ES'),
    time: new Date().toLocaleTimeString('es-ES'),
  };

  const replyText = resolveTemplateVariables(command.response, variables);

  return {
    success: true,
    commandName: command.name,
    botId: ctx.bot.id,
    replyText,
    mentions: ctx.message.mentionedJids,
    executionTimeMs: Date.now() - startTime,
  };
}
