import { db } from '../db.js';
import { Bot, BotCreateInput, BotStatus, BotUpdateInput } from '@mikasa/types';

export class BotRepository {
  static create(userId: string, input: BotCreateInput): Bot {
    const id = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO bots (
        id, userId, name, type, prefix, developer, website,
        profilePicture, banner, description, status, phone, isConnected, autoReconnect,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      userId,
      input.name.trim(),
      input.type || 'WhatsApp Sub-bot',
      input.prefix || '.',
      input.developer || 'Lyan',
      input.website || 'https://mikasa-bot.com',
      input.profilePicture || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
      input.banner || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
      input.description || 'Sub-bot de WhatsApp creado con Mikasa',
      'DISCONNECTED',
      null,
      0,
      1,
      now,
      now
    );

    // Initialize bot_stats record
    db.prepare(`
      INSERT INTO bot_stats (id, botId, messagesReceived, commandsExecuted, uniqueUsers, uniqueGroups, uptimeSeconds, errorsCount, updatedAt)
      VALUES (?, ?, 0, 0, 0, 0, 0, 0, ?)
    `).run(`stat_${id}`, id, now);

    return this.findById(id)!;
  }

  static findById(id: string): Bot | null {
    const stmt = db.prepare('SELECT * FROM bots WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      type: row.type,
      prefix: row.prefix,
      developer: row.developer,
      website: row.website,
      profilePicture: row.profilePicture,
      banner: row.banner,
      description: row.description,
      status: row.status as BotStatus,
      phone: row.phone,
      isConnected: Boolean(row.isConnected),
      autoReconnect: Boolean(row.autoReconnect),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static findByUserId(userId: string): (Bot & { commandsCount: number })[] {
    const stmt = db.prepare(`
      SELECT b.*,
        (SELECT COUNT(*) FROM commands c WHERE c.botId = b.id AND c.enabled = 1) AS commandsCount
      FROM bots b
      WHERE b.userId = ?
      ORDER BY b.createdAt DESC
    `);
    const rows = stmt.all(userId) as any[];

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      type: row.type,
      prefix: row.prefix,
      developer: row.developer,
      website: row.website,
      profilePicture: row.profilePicture,
      banner: row.banner,
      description: row.description,
      status: row.status as BotStatus,
      phone: row.phone,
      isConnected: Boolean(row.isConnected),
      autoReconnect: Boolean(row.autoReconnect),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      commandsCount: Number(row.commandsCount || 0),
    }));
  }

  static update(id: string, input: BotUpdateInput & { status?: BotStatus; phone?: string | null; isConnected?: boolean }): Bot | null {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      fields.push('name = ?');
      values.push(input.name.trim());
    }
    if (input.type !== undefined) {
      fields.push('type = ?');
      values.push(input.type);
    }
    if (input.prefix !== undefined) {
      fields.push('prefix = ?');
      values.push(input.prefix);
    }
    if (input.developer !== undefined) {
      fields.push('developer = ?');
      values.push(input.developer);
    }
    if (input.website !== undefined) {
      fields.push('website = ?');
      values.push(input.website);
    }
    if (input.description !== undefined) {
      fields.push('description = ?');
      values.push(input.description);
    }
    if (input.profilePicture !== undefined) {
      fields.push('profilePicture = ?');
      values.push(input.profilePicture);
    }
    if (input.banner !== undefined) {
      fields.push('banner = ?');
      values.push(input.banner);
    }
    if (input.autoReconnect !== undefined) {
      fields.push('autoReconnect = ?');
      values.push(input.autoReconnect ? 1 : 0);
    }
    if (input.status !== undefined) {
      fields.push('status = ?');
      values.push(input.status);
    }
    if (input.phone !== undefined) {
      fields.push('phone = ?');
      values.push(input.phone);
    }
    if (input.isConnected !== undefined) {
      fields.push('isConnected = ?');
      values.push(input.isConnected ? 1 : 0);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE bots SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    return this.findById(id);
  }

  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM bots WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
