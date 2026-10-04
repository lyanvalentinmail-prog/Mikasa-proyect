import { BasePlugin } from './BasePlugin.js';
import { AnimePlugin } from './anime/index.js';
import { AiPlugin } from './ai/index.js';
import { StickersPlugin } from './stickers/index.js';
import { ModerationPlugin } from './moderation/index.js';
import { GamesPlugin } from './games/index.js';
import { DownloadsPlugin } from './downloads/index.js';
import { UtilitiesPlugin } from './utilities/index.js';
import { PluginDefinition } from '@mikasa/types';
import { CommandContext } from '@mikasa/commands';

export class PluginManager {
  private static plugins: Map<string, BasePlugin> = new Map();

  static {
    this.registerPlugin(new AnimePlugin());
    this.registerPlugin(new AiPlugin());
    this.registerPlugin(new StickersPlugin());
    this.registerPlugin(new ModerationPlugin());
    this.registerPlugin(new GamesPlugin());
    this.registerPlugin(new DownloadsPlugin());
    this.registerPlugin(new UtilitiesPlugin());
  }

  public static registerPlugin(plugin: BasePlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  public static getPlugin(id: string): BasePlugin | undefined {
    return this.plugins.get(id);
  }

  public static getAllPlugins(): PluginDefinition[] {
    return Array.from(this.plugins.values()).map((p) => p.getDefinition());
  }

  public static async executePluginCommand(
    commandName: string,
    ctx: CommandContext,
    enabledPlugins: Map<string, Record<string, any>>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null> {
    for (const [pluginId, plugin] of this.plugins.entries()) {
      if (!enabledPlugins.has(pluginId)) continue;
      const pluginConfig = enabledPlugins.get(pluginId) || {};

      const hasCmd = plugin.commands.some(
        (c) =>
          c.name.toLowerCase() === commandName.toLowerCase() ||
          c.aliases.map((a) => a.toLowerCase()).includes(commandName.toLowerCase())
      );

      if (hasCmd) {
        const result = await plugin.handleCommand(commandName, ctx, pluginConfig);
        if (result) return result;
      }
    }

    return null;
  }
}
