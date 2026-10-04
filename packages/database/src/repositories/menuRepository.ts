import { db } from '../db.js';
import { MenuConfigInput, MenuTemplate } from '@mikasa/types';
import { DEFAULT_AESTHETIC_MENU_HEADER } from '@mikasa/config';

export class MenuRepository {
  static getByBotId(botId: string): MenuTemplate {
    const stmt = db.prepare('SELECT * FROM menu_templates WHERE botId = ?');
    let row = stmt.get(botId) as any;

    if (!row) {
      // Create default
      const id = `menu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO menu_templates (
          id, botId, greeting, intro, separator, categoryHeader, commandFormat,
          categorySymbol, commandSymbol, footer, developerNote, websiteNote,
          customTemplate, useExactAesthetic, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        botId,
        DEFAULT_AESTHETIC_MENU_HEADER,
        '✎ ᴀᴏ̨ᴜɪ ᴛɪᴇɴᴇs ʟᴀ ʟɪsᴛᴀ ᴅᴇ ʟᴏs ᴄᴏᴍᴀɴᴅᴏs',
        '──',
        '',
        '',
        '',
        '',
        '«ᴄᴏɴᴇᴄᴛᴀᴛᴇ ᴄᴏᴍᴏ sᴜʙ-ʙᴏᴛ ᴇɴ ɴᴜᴇsᴛʀᴀ ᴡᴇʙ ᴏғɪᴄɪᴀʟ ✎ {{bot.website}}»',
        '{{bot.developer}}',
        '{{bot.website}}',
        null,
        1,
        now,
        now
      );

      row = stmt.get(botId);
    }

    return {
      id: row.id,
      botId: row.botId,
      greeting: row.greeting || DEFAULT_AESTHETIC_MENU_HEADER,
      intro: row.intro || '',
      separator: row.separator || '──',
      categoryHeader: row.categoryHeader || '',
      commandFormat: row.commandFormat || '',
      categorySymbol: row.categorySymbol || '',
      commandSymbol: row.commandSymbol || '',
      footer: row.footer || '',
      developerNote: row.developerNote || '',
      websiteNote: row.websiteNote || '',
      customTemplate: row.customTemplate,
      useExactAesthetic: Boolean(row.useExactAesthetic),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static update(botId: string, input: MenuConfigInput): MenuTemplate {
    // Ensure exists
    this.getByBotId(botId);
    const now = new Date().toISOString();

    const fields: string[] = [];
    const values: any[] = [];

    if (input.greeting !== undefined) {
      fields.push('greeting = ?');
      values.push(input.greeting);
    }
    if (input.intro !== undefined) {
      fields.push('intro = ?');
      values.push(input.intro);
    }
    if (input.separator !== undefined) {
      fields.push('separator = ?');
      values.push(input.separator);
    }
    if (input.categoryHeader !== undefined) {
      fields.push('categoryHeader = ?');
      values.push(input.categoryHeader);
    }
    if (input.commandFormat !== undefined) {
      fields.push('commandFormat = ?');
      values.push(input.commandFormat);
    }
    if (input.categorySymbol !== undefined) {
      fields.push('categorySymbol = ?');
      values.push(input.categorySymbol);
    }
    if (input.commandSymbol !== undefined) {
      fields.push('commandSymbol = ?');
      values.push(input.commandSymbol);
    }
    if (input.footer !== undefined) {
      fields.push('footer = ?');
      values.push(input.footer);
    }
    if (input.developerNote !== undefined) {
      fields.push('developerNote = ?');
      values.push(input.developerNote);
    }
    if (input.websiteNote !== undefined) {
      fields.push('websiteNote = ?');
      values.push(input.websiteNote);
    }
    if (input.customTemplate !== undefined) {
      fields.push('customTemplate = ?');
      values.push(input.customTemplate);
    }
    if (input.useExactAesthetic !== undefined) {
      fields.push('useExactAesthetic = ?');
      values.push(input.useExactAesthetic ? 1 : 0);
    }

    if (fields.length > 0) {
      fields.push('updatedAt = ?');
      values.push(now);
      values.push(botId);

      db.prepare(`UPDATE menu_templates SET ${fields.join(', ')} WHERE botId = ?`).run(...values);
    }

    return this.getByBotId(botId);
  }
}
