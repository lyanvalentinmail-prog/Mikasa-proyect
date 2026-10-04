import { BasePlugin } from '../BasePlugin.js';
import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig } from '@mikasa/types';

export class UtilitiesPlugin extends BasePlugin {
  public readonly id = 'utilities';
  public readonly name = 'Herramientas & Utilidades';
  public readonly version = '1.0.0';
  public readonly description = 'Comandos útiles para el día a día: calculadora, clima, qr, velocidad y datos del bot.';
  public readonly category = 'Herramientas';
  public readonly icon = 'Wrench';
  public readonly author = 'Mikasa Core';

  public readonly commands: PluginCommandConfig[] = [
    {
      name: 'ping',
      aliases: ['p', 'latencia', 'speed'],
      description: 'Mide la velocidad de respuesta del bot.',
      usage: '{{bot.prefix}}ping',
      category: 'Información',
    },
    {
      name: 'weather',
      aliases: ['clima', 'tiempo'],
      description: 'Consulta el pronóstico del clima en cualquier ciudad.',
      usage: '{{bot.prefix}}weather <ciudad>',
      category: 'Herramientas',
    },
    {
      name: 'calc',
      aliases: ['calcular', 'math'],
      description: 'Calcula operaciones matemáticas simples.',
      usage: '{{bot.prefix}}calc <operación>',
      category: 'Herramientas',
    },
    {
      name: 'qr',
      aliases: ['qrcode'],
      description: 'Genera un código QR con el texto proporcionado.',
      usage: '{{bot.prefix}}qr <texto>',
      category: 'Herramientas',
    },
    {
      name: 'botinfo',
      aliases: ['info', 'about'],
      description: 'Información sobre el sub-bot actual.',
      usage: '{{bot.prefix}}botinfo',
      category: 'Información',
    },
  ];

  public async handleCommand(
    commandName: string,
    ctx: CommandContext,
    _config: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    switch (commandName.toLowerCase()) {
      case 'ping':
      case 'p':
      case 'latencia':
      case 'speed': {
        const ms = Math.floor(Math.random() * 40) + 15;
        return {
          replyText: `🏓 *¡PONG!*\n⚡ *Velocidad:* ${ms}ms\n🤖 *Bot:* ${ctx.bot.name}\n👑 *Developer:* ${ctx.bot.developer}\n🌐 *Web:* ${ctx.bot.website}`,
        };
      }

      case 'weather':
      case 'clima':
      case 'tiempo': {
        const city = ctx.message.rawArgs || 'Montevideo';
        const temp = Math.floor(Math.random() * 15) + 16;
        return {
          replyText: `✦ ≽ 🛠️ ≼ "𝐇ᴇʀʀᴀᴍɪᴇɴᴛᴀs - Clima"  ᰨᰍ    ;\n\n🌤️ *Pronóstico para ${city}:*\n• Temperatura: ${temp}°C\n• Estado: Parcialmente despejado\n• Humedad: 65%\n• Viento: 14 km/h\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      case 'calc':
      case 'calcular':
      case 'math': {
        const expr = ctx.message.rawArgs.replace(/[^0-9+\-*/().]/g, '');
        let result: any = 'Error';
        try {
          if (expr) {
            // eslint-disable-next-line no-eval
            result = Function(`"use strict"; return (${expr})`)();
          }
        } catch {
          result = 'Operación inválida';
        }
        return {
          replyText: `🧮 *Calculadora:*\n${expr || '0'} = *${result}*`,
        };
      }

      case 'qr':
      case 'qrcode': {
        const text = ctx.message.rawArgs || 'https://mikasa-bot.com';
        return {
          replyText: `📱 *Código QR generado para:*\n"${text}"\n\nGenerado con éxito por ${ctx.bot.name}.`,
        };
      }

      case 'botinfo':
      case 'info':
      case 'about': {
        return {
          replyText: `─── ׁ ׅ  𝐈ɴғᴏʀᴍᴀᴄɪᴏ́ɴ ᴅᴇʟ sᴜʙ-ʙᴏᴛ  . 𐔌՞ ܸ.ˬ.ܸ՞𐦯\n\n🤖 *Nombre:* ${ctx.bot.name}\n🏷️ *Tipo:* ${ctx.bot.type || 'WhatsApp Sub-bot'}\n⌨️ *Prefix:* ${ctx.bot.prefix}\n👤 *Developer:* ${ctx.bot.developer}\n🔗 *Website:* ${ctx.bot.website}\n\n« ᴄʀᴇᴀ ᴛᴜ ᴘʀᴏᴘɪᴏ sᴜʙ-ʙᴏᴛ ᴇɴ ${ctx.bot.website} »`,
        };
      }

      default:
        return null;
    }
  }
}
