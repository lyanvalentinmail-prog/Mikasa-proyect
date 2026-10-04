import { db } from '../db.js';
import { BotStats } from '@mikasa/types';

export class StatRepository {
  static getByBotId(botId: string): BotStats {
    const stmt = db.prepare('SELECT * FROM bot_stats WHERE botId = ?');
    let row = stmt.get(botId) as any;

    if (!row) {
      const now = new Date().toISOString();
      const id = `stat_${botId}`;
      db.prepare(`
        INSERT INTO bot_stats (id, botId, messagesReceived, commandsExecuted, uniqueUsers, uniqueGroups, uptimeSeconds, errorsCount, updatedAt)
        VALUES (?, ?, 0, 0, 0, 0, 0, 0, ?)
      `).run(id, botId, now);

      row = stmt.get(botId);
    }

    return {
      id: row.id,
      botId: row.botId,
      messagesReceived: Number(row.messagesReceived || 0),
      commandsExecuted: Number(row.commandsExecuted || 0),
      uniqueUsers: Number(row.uniqueUsers || 0),
      uniqueGroups: Number(row.uniqueGroups || 0),
      uptimeSeconds: Number(row.uptimeSeconds || 0),
      errorsCount: Number(row.errorsCount || 0),
      lastMessageAt: row.lastMessageAt,
      connectedAt: row.connectedAt,
      updatedAt: row.updatedAt,
    };
  }

  static recordMessage(botId: string, isGroup = false, userId?: string): void {
    const now = new Date().toISOString();
    const groupInc = isGroup ? 1 : 0;
    const userInc = 1;

    db.prepare(`
      UPDATE bot_stats
      SET messagesReceived = messagesReceived + 1,
          uniqueUsers = uniqueUsers + 1,
          uniqueGroups = uniqueGroups + ${groupInc},
          lastMessageAt = ?,
          updatedAt = ?
      WHERE botId = ?
    `).run(now, now, botId);
  }

  static recordCommand(botId: string): void {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE bot_stats
      SET commandsExecuted = commandsExecuted + 1,
          updatedAt = ?
      WHERE botId = ?
    `).run(now, botId);
  }

  static recordError(botId: string): void {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE bot_stats
      SET errorsCount = errorsCount + 1,
          updatedAt = ?
      WHERE botId = ?
    `).run(now, botId);
  }

  static updateConnection(botId: string, isConnected: boolean): void {
    const now = new Date().toISOString();
    if (isConnected) {
      db.prepare('UPDATE bot_stats SET connectedAt = ?, updatedAt = ? WHERE botId = ?').run(now, now, botId);
    } else {
      db.prepare('UPDATE bot_stats SET updatedAt = ? WHERE botId = ?').run(now, botId);
    }
  }

  static incrementUptime(botId: string, seconds: number): void {
    const now = new Date().toISOString();
    db.prepare('UPDATE bot_stats SET uptimeSeconds = uptimeSeconds + ?, updatedAt = ? WHERE botId = ?').run(
      seconds,
      now,
      botId
    );
  }
}
