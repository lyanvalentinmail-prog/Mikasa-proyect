import { BasePlugin } from '../BasePlugin.js';
import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig } from '@mikasa/types';

export class AnimePlugin extends BasePlugin {
  public readonly id = 'anime';
  public readonly name = 'Anime & Reacciones';
  public readonly version = '1.0.0';
  public readonly description = 'Reacciones estilizadas con estética de anime, menciones y acciones interactivas.';
  public readonly category = 'Anime';
  public readonly icon = 'Sparkles';
  public readonly author = 'Mikasa Core';

  public readonly commands: PluginCommandConfig[] = [
    {
      name: 'peek',
      aliases: ['espiar', 'mirar'],
      description: 'Espiar a alguien.',
      usage: '{{bot.prefix}}peek + <mention>',
      category: 'Anime',
    },
    {
      name: 'kiss',
      aliases: ['besar', 'beso'],
      description: 'Dar un tierno beso a alguien.',
      usage: '{{bot.prefix}}kiss @usuario',
      category: 'Anime',
    },
    {
      name: 'hug',
      aliases: ['abrazar', 'abrazo'],
      description: 'Dar un abrazo cálido a alguien.',
      usage: '{{bot.prefix}}hug @usuario',
      category: 'Anime',
    },
    {
      name: 'pat',
      aliases: ['acariciar'],
      description: 'Acariciar la cabeza de alguien suavemente.',
      usage: '{{bot.prefix}}pat @usuario',
      category: 'Anime',
    },
    {
      name: 'slap',
      aliases: ['bofetada'],
      description: 'Darle una bofetada cómica a alguien.',
      usage: '{{bot.prefix}}slap @usuario',
      category: 'Anime',
    },
    {
      name: 'waifu',
      aliases: ['animegirl'],
      description: 'Obtener una waifu aleatoria generada.',
      usage: '{{bot.prefix}}waifu',
      category: 'Anime',
    },
  ];

  public async handleCommand(
    commandName: string,
    ctx: CommandContext,
    _config: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    const target =
      ctx.message.mentionedJids?.length && ctx.message.mentionedJids[0]
        ? `@${ctx.message.mentionedJids[0].split('@')[0]}`
        : ctx.message.rawArgs || 'alguien';

    switch (commandName.toLowerCase()) {
      case 'peek':
      case 'espiar':
      case 'mirar':
        return {
          replyText: `❀ ૮₍ ˃̵͈᷄ . ฅ ₎ა   ݁  ${ctx.sender.name} está espiando a ${target} en silencio...\n\n«── ˚. ᵎᵎ  ۠ ᴇsᴘɪᴀʀ ᴀ ᴀʟɢᴜɪᴇɴ.»`,
        };

      case 'kiss':
      case 'besar':
      case 'beso':
        return {
          replyText: `❀  ₍ᐢ.  ̫.ᐢ₎    ݁  💋 ${ctx.sender.name} le ha dado un apasionado beso a ${target}! (*♡∀♡)`,
        };

      case 'hug':
      case 'abrazar':
      case 'abrazo':
        return {
          replyText: `❀ ૮₍ ˃̵͈᷄ . ฅ ₎ა   ݁  🫂 ${ctx.sender.name} envolvió a ${target} en un cálido y reconfortante abrazo (つ✧ω✧)つ`,
        };

      case 'pat':
      case 'acariciar':
        return {
          replyText: `❀  ₍ᐢ.  ̫.ᐢ₎    ݁  ✨ ${ctx.sender.name} le acaricia la cabeza suavemente a ${target} (´｡• ᵕ •｡\`) ♡`,
        };

      case 'slap':
      case 'bofetada':
        return {
          replyText: `❀  ₍ᐢ.  ̫.ᐢ₎    ݁  💢 ¡Plaf! ${ctx.sender.name} le dio una bofetada a ${target}! ୧((#Φ益Φ#))୨`,
        };

      case 'waifu':
        return {
          replyText: `❀ ૮₍ ˃̵͈᷄ . ฅ ₎ა   ݁  *Tu waifu del día es:* Mikasa Ackerman ✨\n\n« ᴄᴏɴ ᴇʟ ᴘᴏᴅᴇʀ ᴅᴇ ${ctx.bot.name} »`,
        };

      default:
        return null;
    }
  }
}
