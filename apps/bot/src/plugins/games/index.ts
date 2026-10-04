import { BasePlugin } from '../BasePlugin.js';
import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig } from '@mikasa/types';

export class GamesPlugin extends BasePlugin {
  public readonly id = 'games';
  public readonly name = 'Minijuegos & Diversión';
  public readonly version = '1.0.0';
  public readonly description = 'Juegos interactivos como dados, trivia, piedra-papel-tijera y moneda.';
  public readonly category = 'Juegos';
  public readonly icon = 'Gamepad2';
  public readonly author = 'Mikasa Games';

  public readonly commands: PluginCommandConfig[] = [
    {
      name: 'dice',
      aliases: ['dado', 'lanzardado'],
      description: 'Lanza un dado del 1 al 6.',
      usage: '{{bot.prefix}}dice',
      category: 'Juegos',
    },
    {
      name: 'coinflip',
      aliases: ['moneda', 'caraocruz'],
      description: 'Lanza una moneda al aire (cara o cruz).',
      usage: '{{bot.prefix}}coinflip',
      category: 'Juegos',
    },
    {
      name: 'rps',
      aliases: ['ppt', 'tijera'],
      description: 'Juega a piedra, papel o tijera contra el bot.',
      usage: '{{bot.prefix}}rps <piedra|papel|tijera>',
      category: 'Juegos',
    },
  ];

  public async handleCommand(
    commandName: string,
    ctx: CommandContext,
    _config: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    switch (commandName.toLowerCase()) {
      case 'dice':
      case 'dado':
      case 'lanzardado': {
        const roll = Math.floor(Math.random() * 6) + 1;
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return {
          replyText: `✦ ≽ 🎮 ≼ "𝐉ᴜᴇɢᴏs"  ᰨᰍ    ;\n\n🎲 ${ctx.sender.name} lanzó el dado:\nResultado: *${roll}* ${diceEmojis[roll - 1]}\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      case 'coinflip':
      case 'moneda':
      case 'caraocruz': {
        const result = Math.random() > 0.5 ? '🪙 CARA' : '🪙 CRUZ';
        return {
          replyText: `✦ ≽ 🎮 ≼ "𝐉ᴜᴇɢᴏs"  ᰨᰍ    ;\n\n🪙 ${ctx.sender.name} lanzó una moneda:\nResultado: *${result}*\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      case 'rps':
      case 'ppt':
      case 'tijera': {
        const choices = ['piedra', 'papel', 'tijera'];
        const userChoice = ctx.message.rawArgs.toLowerCase().trim();
        if (!choices.includes(userChoice)) {
          return {
            replyText: `⚠️ Opción inválida. Elige: *${ctx.bot.prefix}rps piedra*, *papel* o *tijera*.`,
          };
        }
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        let outcome = '¡Empate!';
        if (
          (userChoice === 'piedra' && botChoice === 'tijera') ||
          (userChoice === 'papel' && botChoice === 'piedra') ||
          (userChoice === 'tijera' && botChoice === 'papel')
        ) {
          outcome = '🎉 ¡Ganaste!';
        } else if (userChoice !== botChoice) {
          outcome = '🤖 ¡Gana el bot!';
        }

        return {
          replyText: `✦ ≽ 🎮 ≼ "𝐉ᴜᴇɢᴏs"  ᰨᰍ    ;\n\nTu elección: *${userChoice}*\nElección del bot: *${botChoice}*\n\nResultado: *${outcome}*\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      default:
        return null;
    }
  }
}
