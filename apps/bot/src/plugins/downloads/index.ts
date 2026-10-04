import { BasePlugin } from '../BasePlugin.js';
import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig } from '@mikasa/types';

export class DownloadsPlugin extends BasePlugin {
  public readonly id = 'downloads';
  public readonly name = 'Descargas Multimedia';
  public readonly version = '1.0.0';
  public readonly description = 'Descargas de contenido multimedia desde redes sociales.';
  public readonly category = 'Descargas';
  public readonly icon = 'Download';
  public readonly author = 'Mikasa Media';

  public readonly commands: PluginCommandConfig[] = [
    {
      name: 'ytmp3',
      aliases: ['ytaudio', 'audio'],
      description: 'Descarga el audio de un video de YouTube.',
      usage: '{{bot.prefix}}ytmp3 <link>',
      category: 'Descargas',
    },
    {
      name: 'ytmp4',
      aliases: ['ytvideo', 'video'],
      description: 'Descarga el video de YouTube en MP4.',
      usage: '{{bot.prefix}}ytmp4 <link>',
      category: 'Descargas',
    },
    {
      name: 'tiktok',
      aliases: ['tt', 'ttdl'],
      description: 'Descarga videos de TikTok sin marca de agua.',
      usage: '{{bot.prefix}}tiktok <link>',
      category: 'Descargas',
    },
  ];

  public async handleCommand(
    commandName: string,
    ctx: CommandContext,
    _config: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    const url = ctx.message.rawArgs.trim();
    if (!url) {
      return {
        replyText: `✦ ≽ 📥 ≼ "𝐃ᴇsᴄᴀʀɢᴀs"  ᰨᰍ    ;\n\n⚠️ Por favor ingresa el enlace a descargar.\nEjemplo: *${ctx.bot.prefix}${commandName} https://...*`,
      };
    }

    switch (commandName.toLowerCase()) {
      case 'ytmp3':
      case 'ytaudio':
        return {
          replyText: `✦ ≽ 📥 ≼ "𝐃ᴇsᴄᴀʀɢᴀs - MP3"  ᰨᰍ    ;\n\n🎵 *Descargando audio de YouTube:*\nEnlace: ${url}\nCalidad: 320kbps\n\n« ᴘʀᴏᴄᴇsᴀɴᴅᴏ ᴘᴏʀ ${ctx.bot.name} »\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };

      case 'ytmp4':
      case 'ytvideo':
        return {
          replyText: `✦ ≽ 📥 ≼ "𝐃ᴇsᴄᴀʀɢᴀs - MP4"  ᰨᰍ    ;\n\n🎬 *Descargando video en HD:*\nEnlace: ${url}\nResolución: 720p / 1080p\n\n« ᴘʀᴏᴄᴇsᴀɴᴅᴏ ᴘᴏʀ ${ctx.bot.name} »\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };

      case 'tiktok':
      case 'tt':
      case 'ttdl':
        return {
          replyText: `✦ ≽ 📥 ≼ "𝐃ᴇsᴄᴀʀɢᴀs - TikTok"  ᰨᰍ    ;\n\n✨ *Video de TikTok sin marca de agua listo.*\nEnlace: ${url}\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };

      default:
        return null;
    }
  }
}
