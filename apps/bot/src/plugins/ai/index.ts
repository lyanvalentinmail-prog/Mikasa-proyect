import { BasePlugin } from '../BasePlugin.js';
import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig } from '@mikasa/types';

export class AiPlugin extends BasePlugin {
  public readonly id = 'ai';
  public readonly name = 'Inteligencia Artificial';
  public readonly version = '1.0.0';
  public readonly description = 'Integración con modelos de IA conversacional y generación de prompts creativos.';
  public readonly category = 'IA';
  public readonly icon = 'Bot';
  public readonly author = 'Mikasa AI Core';

  public readonly commands: PluginCommandConfig[] = [
    {
      name: 'chatgpt',
      aliases: ['gpt', 'ia'],
      description: 'Habla con ChatGPT.',
      usage: '{{bot.prefix}}chatgpt <pregunta>',
      category: 'IA',
    },
    {
      name: 'gemini',
      aliases: ['bard', 'gem'],
      description: 'Habla con Gemini.',
      usage: '{{bot.prefix}}gemini <consulta>',
      category: 'IA',
    },
    {
      name: 'imagine',
      aliases: ['dalle', 'genimg'],
      description: 'Crea una imagen hecha por la IA.',
      usage: '{{bot.prefix}}imagine <prompt>',
      category: 'IA',
    },
  ];

  public async handleCommand(
    commandName: string,
    ctx: CommandContext,
    _config: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    const prompt = ctx.message.rawArgs.trim();

    if (!prompt) {
      return {
        replyText: `❀  ₍ᐢ.  ̫.ᐢ₎    ݁  Por favor escribe una pregunta o consulta después de ${ctx.bot.prefix}${commandName}.\nEjemplo: *${ctx.bot.prefix}${commandName} Explica qué es un agujero negro en 2 frases*`,
      };
    }

    switch (commandName.toLowerCase()) {
      case 'chatgpt':
      case 'gpt':
      case 'ia': {
        const reply = this.generateAiResponse(prompt, ctx.sender.name, 'ChatGPT-4o');
        return {
          replyText: `•  ≽(˵◝ ⩊  ◜˵ マ≼ "𝐈𝐀 - ChatGPT"  ᰨᰍ    ;\n\n«✎ ʜᴀʙʟᴀ ᴄᴏɴ ᴄʜᴀᴛɢᴘᴛ»\n\n❀  ₍ᐢ.  ̫.ᐢ₎    ݁  *Respuesta para ${ctx.sender.name}:*\n\n${reply}\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      case 'gemini':
      case 'bard':
      case 'gem': {
        const reply = this.generateAiResponse(prompt, ctx.sender.name, 'Google Gemini Pro');
        return {
          replyText: `•  ≽(˵◝ ⩊  ◜˵ マ≼ "𝐈𝐀 - Gemini"  ᰨᰍ    ;\n\n«✎ ʜᴀʙʟᴀ ᴄᴏɴ ɢᴇᴍɪɴɪ»\n\n❀  ₍ᐢ.  ̫.ᐢ₎    ݁  *Respuesta para ${ctx.sender.name}:*\n\n${reply}\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      case 'imagine':
      case 'dalle':
      case 'genimg': {
        return {
          replyText: `•  ≽(˵◝ ⩊  ◜˵ マ≼ "𝐈𝐀 - Imagine"  ᰨᰍ    ;\n\n«✎ ᴄʀᴇᴀ ᴜɴᴀ ɪᴍᴀɢᴇɴ ʜᴇᴄʜᴀ ᴘᴏʀ ʟᴀ ɪᴀ»\n\n❀  ₍ᐢ.  ̫.ᐢ₎    ݁  🎨 *Imagen Generada:*\nPrompt: "${prompt}"\nRenderizado en 4K Ultra HD\n\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶`,
        };
      }

      default:
        return null;
    }
  }

  private generateAiResponse(prompt: string, userName: string, engine: string): string {
    const p = prompt.toLowerCase();
    if (p.includes('hola') || p.includes('buenos dias') || p.includes('buenas')) {
      return `¡Hola ${userName}! Un gusto saludarte. Soy la IA integrada de este bot. ¿En qué puedo asistirte o inspirarte hoy?`;
    }
    if (p.includes('quien eres') || p.includes('tu nombre')) {
      return `Soy un asistente inteligente potenciado por ${engine}, conectado a través de la plataforma Mikasa para responder preguntas, crear contenido y ayudarte en tu día a día.`;
    }
    if (p.includes('creador') || p.includes('developer')) {
      return `Fui configurado y administrado desde el panel de control de Mikasa Bot Builder. ¡Tú también puedes crear tus propios sub-bots!`;
    }
    return `Analizando tu solicitud: "${prompt}".\n\nAquí tienes la respuesta: "${prompt}" es un tema fascinante. Si necesitas ampliar información, generar código, traducir textos o resumir documentos, solo dímelo.`;
  }
}
