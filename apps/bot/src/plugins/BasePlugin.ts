import { CommandContext } from '@mikasa/commands';
import { PluginCommandConfig, PluginDefinition } from '@mikasa/types';

export abstract class BasePlugin {
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly version: string;
  public abstract readonly description: string;
  public abstract readonly category: string;
  public abstract readonly icon: string;
  public abstract readonly author: string;
  public abstract readonly commands: PluginCommandConfig[];
  public defaultConfig: Record<string, any> = {};

  public getDefinition(): PluginDefinition {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      description: this.description,
      category: this.category,
      icon: this.icon,
      author: this.author,
      commands: this.commands,
      defaultConfig: this.defaultConfig,
    };
  }

  public abstract handleCommand(
    commandName: string,
    ctx: CommandContext,
    pluginConfig: Record<string, any>
  ): Promise<{ replyText?: string; mediaUrl?: string; mediaType?: any } | null>;
}
