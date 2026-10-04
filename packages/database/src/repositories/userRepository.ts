import { db } from '../db.js';
import { User, UserRole } from '@mikasa/types';
import bcrypt from 'bcryptjs';

export class UserRepository {
  static create(data: { email: string; password: string; name: string; avatar?: string }): User {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const passwordHash = bcrypt.hashSync(data.password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (id, email, passwordHash, name, avatar, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.email.toLowerCase().trim(), passwordHash, data.name.trim(), data.avatar || null, 'USER', now, now);

    return {
      id,
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      avatar: data.avatar || null,
      role: 'USER',
      createdAt: now,
      updatedAt: now,
    };
  }

  static findByEmail(email: string): (User & { passwordHash: string }) | null {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get(email.toLowerCase().trim()) as any;
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      avatar: row.avatar,
      role: row.role as UserRole,
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static findById(id: string): User | null {
    const stmt = db.prepare('SELECT id, email, name, avatar, role, createdAt, updatedAt FROM users WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      avatar: row.avatar,
      role: row.role as UserRole,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static update(id: string, data: Partial<User>): User | null {
    const now = new Date().toISOString();
    const existing = this.findById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(data.avatar);
    }

    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    return this.findById(id);
  }
}
