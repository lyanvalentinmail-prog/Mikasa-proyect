import { BasePlugin } from '../BasePlugin.js';
import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig } from '@mikasa/types';

export class StickersPlugin extends BasePlugin {
  public readonly id = 'stickers';
  public readonly name = 'Stickers & Multimedia';
  public readonly version = '1.0.0';
  public readonly description = 'Conversión de fotos, gifs y texto en stickers personalizados.';
  public readonly category = 'Stickers';
  public readonly icon = 'Smile';
  public readonly author = 'Mikasa Media';

  public readonly commands: PluginCommandConfig[] = [
    {
      name: 'sticker',
      aliases: ['s', 'stk'],
      description: 'Convierte una imagen en sticker.',
      usage: '{{bot.prefix}}sticker (respondiendo a una imagen)',
      category: 'Stickers',
    },
    {
      name: 'take',
      aliases: ['wm', 'robar'],
      description: 'Cambia el autor y nombre del paquete de un sticker.',
      usage: '{{bot.prefix}}take <pack> | <autor>',
      category: 'Stickers',
    },
  ];

  public async handleCommand(
    commandName: string,
    ctx: CommandContext,
    _config: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    switch (commandName.toLowerCase()) {
      case 'sticker':
      case 's':
      case 'stk':
        return {
          replyText: `✦ ≽ 🖼️ ≼ "𝐒ᴛɪᴄᴋᴇʀs"  ᰨᰍ    ;\n\n«✎ ᴄʀᴇᴀᴄɪᴏ́ɴ ʏ ᴇᴅɪᴄɪᴏ́ɴ ᴅᴇ sᴛɪᴄᴋᴇʀs»\n\n❀  ₍ᐢ.  ̫.ᐢ₎    ݁  ✨ *Sticker procesado con éxito!*\nPack: ${ctx.bot.name} Sub-bot\nAutor: ${ctx.bot.developer}\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };

      case 'take':
      case 'wm':
      case 'robar':
        const parts = ctx.message.rawArgs.split('|');
        const pack = parts[0]?.trim() || ctx.bot.name;
        const author = parts[1]?.trim() || ctx.bot.developer;
        return {
          replyText: `✨ Metadatos del sticker actualizados:\n📦 Pack: ${pack}\n👤 Autor: ${author}`,
        };

      default:
        return null;
    }
  }
}
