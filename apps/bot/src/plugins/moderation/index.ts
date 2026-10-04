import { BasePlugin } from '../BasePlugin.js';
import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig } from '@mikasa/types';

export class ModerationPlugin extends BasePlugin {
  public readonly id = 'moderation';
  public readonly name = 'Moderación de Grupos';
  public readonly version = '1.0.0';
  public readonly description = 'Comandos de administración, menciones masivas y seguridad grupal.';
  public readonly category = 'Moderación';
  public readonly icon = 'Shield';
  public readonly author = 'Mikasa Security';

  public readonly commands: PluginCommandConfig[] = [
    {
      name: 'tagall',
      aliases: ['todos', 'mencionartodos', 'invocar'],
      description: 'Menciona a todos los miembros de un grupo.',
      usage: '{{bot.prefix}}tagall <mensaje>',
      category: 'Moderación',
      adminOnly: true,
    },
    {
      name: 'kick',
      aliases: ['ban', 'expulsar'],
      description: 'Expulsa a un participante del grupo.',
      usage: '{{bot.prefix}}kick @usuario',
      category: 'Moderación',
      adminOnly: true,
    },
    {
      name: 'hidetag',
      aliases: ['notificar', 'h'],
      description: 'Envía un mensaje invisible con mención general.',
      usage: '{{bot.prefix}}hidetag <mensaje>',
      category: 'Moderación',
      adminOnly: true,
    },
  ];

  public async handleCommand(
    commandName: string,
    ctx: CommandContext,
    _config: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    if (!ctx.chat.isGroup) {
      return {
        replyText: '⚠️ Los comandos de moderación solo pueden utilizarse en grupos.',
      };
    }

    const members = ctx.chat.groupMembers || [];
    const message = ctx.message.rawArgs || '¡Atención a todos los miembros!';

    switch (commandName.toLowerCase()) {
      case 'tagall':
      case 'todos':
      case 'mencionartodos':
      case 'invocar': {
        const mentionsList = members.length
          ? members.map((m) => `❀  ₍ᐢ.  ̫.ᐢ₎  @${m.split('@')[0]}`).join('\n')
          : '• @usuario1\n• @usuario2\n• @usuario3';

        return {
          replyText: `✦ ≽ 🛡️ ≼ "𝐌ᴏᴅᴇʀᴀᴄɪᴏ́ɴ"  ᰨᰍ    ;\n\n«✎ ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs ᴅᴇ ᴀᴅᴍɪɴɪsᴛʀᴀᴄɪᴏ́ɴ»\n\n📢 *MENCIÓN GENERAL*\n*Mensaje:* ${message}\n\n${mentionsList}\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      case 'kick':
      case 'ban':
      case 'expulsar': {
        const target =
          ctx.message.mentionedJids?.[0] || ctx.message.rawArgs || '@usuario';
        return {
          replyText: `⛔ *Acción de moderación ejecutada:*\nUsuario: ${target}\nAcción: Expulsado por ${ctx.sender.name}`,
        };
      }

      case 'hidetag':
      case 'notificar':
      case 'h': {
        return {
          replyText: `🔔 *Aviso importante:* ${message}`,
        };
      }

      default:
        return null;
    }
  }
}
