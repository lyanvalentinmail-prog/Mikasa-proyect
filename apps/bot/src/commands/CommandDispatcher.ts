import {
  BotRepository,
  CategoryRepository,
  CommandRepository,
  MenuRepository,
  PluginRepository,
  StatRepository,
} from '@mikasa/database';
import { executeCommand, parseMessage } from '@mikasa/commands';
import { createBotLog, generateBotMenu } from '@mikasa/shared';
import { PluginManager } from '../plugins/PluginManager.js';
import { IConnection, MessagePayload } from '../connection/IConnection.js';

export class CommandDispatcher {
  public static async handleIncomingMessage(
    botId: string,
    message: MessagePayload,
    connection?: IConnection
  ): Promise<{ replyText?: string; executed: boolean }> {
    const bot = BotRepository.findById(botId);
    if (!bot) return { executed: false };

    // Record stats
    StatRepository.recordMessage(botId, message.isGroup, message.senderNumber);

    const prefix = bot.prefix || '.';
    const parsed = parseMessage(message.text, prefix);

    if (!parsed.isCommand) {
      return { executed: false };
    }

    createBotLog(botId, 'COMMAND', `${prefix}${parsed.commandName} (de ${message.senderName})`);

    // Special Auto-generated Menu Handling
    if (parsed.commandName === 'menu' || parsed.commandName === 'help' || parsed.commandName === 'panel') {
      const categories = CategoryRepository.findByBotId(botId);
      const allCommands = CommandRepository.findByBotId(botId);
      const menuTemplate = MenuRepository.getByBotId(botId);

      // Attach commands to categories
      const categoriesWithCommands = categories.map((cat) => ({
        ...cat,
        commands: allCommands.filter((c) => c.categoryId === cat.id && c.enabled),
      }));

      // Also gather unassigned commands under a default section if any
      const unassignedCommands = allCommands.filter((c) => !c.categoryId && c.enabled);
      if (unassignedCommands.length > 0) {
        categoriesWithCommands.push({
          id: 'general',
          botId,
          name: 'General',
          icon: 'Sparkles',
          symbol: '✦ ≽ 🌟 ≼',
          description: 'Comandos generales',
          order: 99,
          commandsCount: unassignedCommands.length,
          commands: unassignedCommands,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      const generatedMenu = generateBotMenu({
        bot,
        categories: categoriesWithCommands,
        template: menuTemplate,
        userName: message.senderName,
        userNumber: message.senderNumber,
      });

      StatRepository.recordCommand(botId);
      createBotLog(botId, 'INFO', `Menú generado y enviado a ${message.senderName}`);

      if (connection && connection.isConnected) {
        try {
          await connection.sendMessage(message.from, generatedMenu);
        } catch (sendErr: any) {
          createBotLog(botId, 'ERROR', `Error enviando menú: ${sendErr.message}`);
        }
      }

      return { replyText: generatedMenu, executed: true };
    }

    // Lookup command from database
    const command = CommandRepository.findByNameOrAlias(botId, parsed.commandName);
    const plugins = PluginRepository.getByBotId(botId);
    const enabledPluginsMap = new Map<string, Record<string, any>>();
    plugins.forEach((p) => {
      if (p.enabled) enabledPluginsMap.set(p.pluginId, p.config);
    });

    const ctx = {
      bot: {
        id: bot.id,
        name: bot.name,
        prefix: bot.prefix,
        developer: bot.developer,
        website: bot.website,
        type: bot.type,
      },
      sender: {
        id: message.senderNumber,
        name: message.senderName,
        number: message.senderNumber,
        isAdmin: false, // In real group context Baileys groupMetadata can verify admin status
        isOwner: false,
      },
      chat: {
        id: message.from,
        isGroup: message.isGroup,
        groupName: message.groupName,
        groupMembers: message.groupMembers,
      },
      message: {
        text: message.text,
        args: parsed.args,
        rawArgs: parsed.rawArgs,
        mentionedJids: message.mentionedJids,
      },
      pluginHandler: async (name: string, context: any) => {
        return await PluginManager.executePluginCommand(name, context, enabledPluginsMap);
      },
    };

    let replyText = '';

    if (command) {
      const result = await executeCommand(command, ctx);
      StatRepository.recordCommand(botId);

      if (result.success && result.replyText) {
        replyText = result.replyText;
        createBotLog(botId, 'INFO', `Respuesta enviada para ${prefix}${parsed.commandName}`);
      } else if (result.error) {
        replyText = result.error;
        createBotLog(botId, 'WARN', `Comando ${prefix}${parsed.commandName} bloqueado: ${result.error}`);
      }
    } else {
      // Check direct plugin fallback
      const pluginResult = await PluginManager.executePluginCommand(parsed.commandName, ctx, enabledPluginsMap);
      if (pluginResult && pluginResult.replyText) {
        replyText = pluginResult.replyText;
        StatRepository.recordCommand(botId);
        createBotLog(botId, 'INFO', `Respuesta de plugin enviada para ${prefix}${parsed.commandName}`);
      }
    }

    if (replyText && connection && connection.isConnected) {
      try {
        await connection.sendMessage(message.from, replyText, {
          mentions: message.mentionedJids,
        });
      } catch (sendErr: any) {
        createBotLog(botId, 'ERROR', `Error al enviar mensaje: ${sendErr.message}`);
      }
    }

    return { replyText, executed: Boolean(replyText) };
  }
}
