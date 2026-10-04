import { db } from '../db.js';
import { BotLog, LogLevel } from '@mikasa/types';

export class LogRepository {
  static create(botId: string, level: LogLevel, message: string, metadata?: Record<string, any>): BotLog {
    const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO bot_logs (id, botId, level, message, metadata, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, botId, level, message, metadata ? JSON.stringify(metadata) : null, now);

    return {
      id,
      botId,
      level,
      message,
      metadata: metadata || null,
      timestamp: now,
    };
  }

  static findByBotId(botId: string, limit = 50, level?: LogLevel, search?: string): BotLog[] {
    let query = 'SELECT * FROM bot_logs WHERE botId = ?';
    const params: any[] = [botId];

    if (level) {
      query += ' AND level = ?';
      params.push(level);
    }

    if (search) {
      query += ' AND (message LIKE ? OR level LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limit);

    const rows = db.prepare(query).all(...params) as any[];

    return rows.map((row) => ({
      id: row.id,
      botId: row.botId,
      level: row.level as LogLevel,
      message: row.message,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      timestamp: row.timestamp,
    }));
  }

  static clear(botId: string): void {
    db.prepare('DELETE FROM bot_logs WHERE botId = ?').run(botId);
  }
}
