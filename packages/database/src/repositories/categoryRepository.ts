import { db } from '../db.js';
import { BotCategory, CategoryInput } from '@mikasa/types';

export class CategoryRepository {
  static create(botId: string, input: CategoryInput): BotCategory {
    const id = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO categories (id, botId, name, icon, symbol, description, "order", createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      botId,
      input.name.trim(),
      input.icon || 'Sparkles',
      input.symbol || null,
      input.description || '',
      input.order ?? 0,
      now,
      now
    );

    return this.findById(id)!;
  }

  static findById(id: string): BotCategory | null {
    const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      botId: row.botId,
      name: row.name,
      icon: row.icon,
      symbol: row.symbol,
      description: row.description,
      order: Number(row.order),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static findByBotId(botId: string): (BotCategory & { commandsCount: number })[] {
    const stmt = db.prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM commands cmd WHERE cmd.categoryId = c.id) AS commandsCount
      FROM categories c
      WHERE c.botId = ?
      ORDER BY c."order" ASC, c.createdAt ASC
    `);
    const rows = stmt.all(botId) as any[];

    return rows.map((row) => ({
      id: row.id,
      botId: row.botId,
      name: row.name,
      icon: row.icon,
      symbol: row.symbol,
      description: row.description,
      order: Number(row.order),
      commandsCount: Number(row.commandsCount || 0),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  static update(id: string, input: Partial<CategoryInput>): BotCategory | null {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      fields.push('name = ?');
      values.push(input.name.trim());
    }
    if (input.icon !== undefined) {
      fields.push('icon = ?');
      values.push(input.icon);
    }
    if (input.symbol !== undefined) {
      fields.push('symbol = ?');
      values.push(input.symbol);
    }
    if (input.description !== undefined) {
      fields.push('description = ?');
      values.push(input.description);
    }
    if (input.order !== undefined) {
      fields.push('"order" = ?');
      values.push(input.order);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    return this.findById(id);
  }

  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
