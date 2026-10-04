import { db } from '../db.js';
import { BotPluginState } from '@mikasa/types';

export class PluginRepository {
  static getByBotId(botId: string): BotPluginState[] {
    const stmt = db.prepare('SELECT * FROM bot_plugins WHERE botId = ?');
    const rows = stmt.all(botId) as any[];

    return rows.map((row) => ({
      id: row.id,
      botId: row.botId,
      pluginId: row.pluginId,
      name: row.name,
      description: row.description,
      enabled: Boolean(row.enabled),
      config: JSON.parse(row.config || '{}'),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  static getPlugin(botId: string, pluginId: string): BotPluginState | null {
    const stmt = db.prepare('SELECT * FROM bot_plugins WHERE botId = ? AND pluginId = ?');
    const row = stmt.get(botId, pluginId) as any;
    if (!row) return null;

    return {
      id: row.id,
      botId: row.botId,
      pluginId: row.pluginId,
      name: row.name,
      description: row.description,
      enabled: Boolean(row.enabled),
      config: JSON.parse(row.config || '{}'),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static upsertPlugin(
    botId: string,
    pluginId: string,
    data: { name: string; description: string; enabled?: boolean; config?: Record<string, any> }
  ): BotPluginState {
    const existing = this.getPlugin(botId, pluginId);
    const now = new Date().toISOString();

    if (existing) {
      const stmt = db.prepare(`
        UPDATE bot_plugins
        SET name = ?, description = ?, enabled = ?, config = ?, updatedAt = ?
        WHERE botId = ? AND pluginId = ?
      `);
      stmt.run(
        data.name,
        data.description,
        data.enabled !== undefined ? (data.enabled ? 1 : 0) : existing.enabled ? 1 : 0,
        JSON.stringify(data.config || existing.config || {}),
        now,
        botId,
        pluginId
      );
    } else {
      const id = `plg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const stmt = db.prepare(`
        INSERT INTO bot_plugins (id, botId, pluginId, name, description, enabled, config, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id,
        botId,
        pluginId,
        data.name,
        data.description,
        data.enabled !== undefined ? (data.enabled ? 1 : 0) : 1,
        JSON.stringify(data.config || {}),
        now,
        now
      );
    }

    return this.getPlugin(botId, pluginId)!;
  }

  static togglePlugin(botId: string, pluginId: string, enabled: boolean): BotPluginState | null {
    const existing = this.getPlugin(botId, pluginId);
    if (!existing) return null;

    const now = new Date().toISOString();
    db.prepare('UPDATE bot_plugins SET enabled = ?, updatedAt = ? WHERE botId = ? AND pluginId = ?').run(
      enabled ? 1 : 0,
      now,
      botId,
      pluginId
    );

    return this.getPlugin(botId, pluginId);
  }
}
