import { db } from '../db.js';
import { BotCommand, CommandInput } from '@mikasa/types';

export class CommandRepository {
  static create(botId: string, input: CommandInput & { isPlugin?: boolean; pluginId?: string | null }): BotCommand {
    const id = `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const aliases = JSON.stringify(input.aliases || []);

    const permissions = {
      allowPrivate: input.permissions?.allowPrivate ?? true,
      allowGroup: input.permissions?.allowGroup ?? true,
      adminOnly: input.permissions?.adminOnly ?? false,
      ownerOnly: input.permissions?.ownerOnly ?? false,
    };

    const stmt = db.prepare(`
      INSERT INTO commands (
        id, botId, categoryId, name, aliases, description, usage, response,
        enabled, allowPrivate, allowGroup, adminOnly, ownerOnly, isPlugin, pluginId,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      botId,
      input.categoryId || null,
      input.name.toLowerCase().trim(),
      aliases,
      input.description.trim(),
      input.usage.trim(),
      input.response.trim(),
      input.enabled !== false ? 1 : 0,
      permissions.allowPrivate ? 1 : 0,
      permissions.allowGroup ? 1 : 0,
      permissions.adminOnly ? 1 : 0,
      permissions.ownerOnly ? 1 : 0,
      input.isPlugin ? 1 : 0,
      input.pluginId || null,
      now,
      now
    );

    return this.findById(id)!;
  }

  static findById(id: string): BotCommand | null {
    const stmt = db.prepare('SELECT * FROM commands WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;

    let aliases: string[] = [];
    try {
      aliases = JSON.parse(row.aliases || '[]');
    } catch {
      aliases = [];
    }

    return {
      id: row.id,
      botId: row.botId,
      categoryId: row.categoryId,
      name: row.name,
      aliases,
      description: row.description,
      usage: row.usage,
      response: row.response,
      enabled: Boolean(row.enabled),
      permissions: {
        allowPrivate: Boolean(row.allowPrivate),
        allowGroup: Boolean(row.allowGroup),
        adminOnly: Boolean(row.adminOnly),
        ownerOnly: Boolean(row.ownerOnly),
      },
      isPlugin: Boolean(row.isPlugin),
      pluginId: row.pluginId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static findByBotId(botId: string): BotCommand[] {
    const stmt = db.prepare('SELECT * FROM commands WHERE botId = ? ORDER BY createdAt ASC');
    const rows = stmt.all(botId) as any[];

    return rows.map((row) => {
      let aliases: string[] = [];
      try {
        aliases = JSON.parse(row.aliases || '[]');
      } catch {
        aliases = [];
      }

      return {
        id: row.id,
        botId: row.botId,
        categoryId: row.categoryId,
        name: row.name,
        aliases,
        description: row.description,
        usage: row.usage,
        response: row.response,
        enabled: Boolean(row.enabled),
        permissions: {
          allowPrivate: Boolean(row.allowPrivate),
          allowGroup: Boolean(row.allowGroup),
          adminOnly: Boolean(row.adminOnly),
          ownerOnly: Boolean(row.ownerOnly),
        },
        isPlugin: Boolean(row.isPlugin),
        pluginId: row.pluginId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });
  }

  static findByNameOrAlias(botId: string, commandName: string): BotCommand | null {
    const cleanName = commandName.toLowerCase().trim();
    const commands = this.findByBotId(botId);

    return (
      commands.find(
        (cmd) =>
          cmd.enabled &&
          (cmd.name.toLowerCase() === cleanName ||
            cmd.aliases.map((a) => a.toLowerCase()).includes(cleanName))
      ) || null
    );
  }

  static update(id: string, input: Partial<CommandInput>): BotCommand | null {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      fields.push('name = ?');
      values.push(input.name.toLowerCase().trim());
    }
    if (input.aliases !== undefined) {
      fields.push('aliases = ?');
      values.push(JSON.stringify(input.aliases));
    }
    if (input.categoryId !== undefined) {
      fields.push('categoryId = ?');
      values.push(input.categoryId);
    }
    if (input.description !== undefined) {
      fields.push('description = ?');
      values.push(input.description.trim());
    }
    if (input.usage !== undefined) {
      fields.push('usage = ?');
      values.push(input.usage.trim());
    }
    if (input.response !== undefined) {
      fields.push('response = ?');
      values.push(input.response.trim());
    }
    if (input.enabled !== undefined) {
      fields.push('enabled = ?');
      values.push(input.enabled ? 1 : 0);
    }
    if (input.permissions?.allowPrivate !== undefined) {
      fields.push('allowPrivate = ?');
      values.push(input.permissions.allowPrivate ? 1 : 0);
    }
    if (input.permissions?.allowGroup !== undefined) {
      fields.push('allowGroup = ?');
      values.push(input.permissions.allowGroup ? 1 : 0);
    }
    if (input.permissions?.adminOnly !== undefined) {
      fields.push('adminOnly = ?');
      values.push(input.permissions.adminOnly ? 1 : 0);
    }
    if (input.permissions?.ownerOnly !== undefined) {
      fields.push('ownerOnly = ?');
      values.push(input.permissions.ownerOnly ? 1 : 0);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE commands SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    return this.findById(id);
  }

  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM commands WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
