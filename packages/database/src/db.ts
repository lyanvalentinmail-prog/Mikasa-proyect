import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dbPath = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), '../../mikasa.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db: Database.Database = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'USER',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bots (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'WhatsApp Sub-bot',
      prefix TEXT DEFAULT '.',
      developer TEXT DEFAULT 'Lyan',
      website TEXT DEFAULT 'https://mikasa-bot.com',
      profilePicture TEXT DEFAULT 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
      banner TEXT DEFAULT 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
      description TEXT DEFAULT 'Sub-bot de WhatsApp creado con Mikasa',
      status TEXT DEFAULT 'DISCONNECTED',
      phone TEXT,
      isConnected INTEGER DEFAULT 0,
      autoReconnect INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      botId TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT DEFAULT 'Sparkles',
      symbol TEXT,
      description TEXT DEFAULT '',
      "order" INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS commands (
      id TEXT PRIMARY KEY,
      botId TEXT NOT NULL,
      categoryId TEXT,
      name TEXT NOT NULL,
      aliases TEXT DEFAULT '[]',
      description TEXT NOT NULL,
      usage TEXT NOT NULL,
      response TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      allowPrivate INTEGER DEFAULT 1,
      allowGroup INTEGER DEFAULT 1,
      adminOnly INTEGER DEFAULT 0,
      ownerOnly INTEGER DEFAULT 0,
      isPlugin INTEGER DEFAULT 0,
      pluginId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS menu_templates (
      id TEXT PRIMARY KEY,
      botId TEXT UNIQUE NOT NULL,
      greeting TEXT DEFAULT '',
      intro TEXT DEFAULT '',
      separator TEXT DEFAULT '──',
      categoryHeader TEXT DEFAULT '',
      commandFormat TEXT DEFAULT '',
      categorySymbol TEXT DEFAULT '',
      commandSymbol TEXT DEFAULT '',
      footer TEXT DEFAULT '',
      developerNote TEXT DEFAULT '',
      websiteNote TEXT DEFAULT '',
      customTemplate TEXT,
      useExactAesthetic INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bot_plugins (
      id TEXT PRIMARY KEY,
      botId TEXT NOT NULL,
      pluginId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      config TEXT DEFAULT '{}',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE,
      UNIQUE(botId, pluginId)
    );

    CREATE TABLE IF NOT EXISTS bot_logs (
      id TEXT PRIMARY KEY,
      botId TEXT NOT NULL,
      level TEXT DEFAULT 'INFO',
      message TEXT NOT NULL,
      metadata TEXT,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bot_stats (
      id TEXT PRIMARY KEY,
      botId TEXT UNIQUE NOT NULL,
      messagesReceived INTEGER DEFAULT 0,
      commandsExecuted INTEGER DEFAULT 0,
      uniqueUsers INTEGER DEFAULT 0,
      uniqueGroups INTEGER DEFAULT 0,
      uptimeSeconds INTEGER DEFAULT 0,
      errorsCount INTEGER DEFAULT 0,
      lastMessageAt TEXT,
      connectedAt TEXT,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bot_sessions (
      id TEXT PRIMARY KEY,
      botId TEXT UNIQUE NOT NULL,
      sessionData TEXT,
      isAlive INTEGER DEFAULT 0,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_bots_user ON bots(userId);
    CREATE INDEX IF NOT EXISTS idx_categories_bot ON categories(botId);
    CREATE INDEX IF NOT EXISTS idx_commands_bot ON commands(botId);
    CREATE INDEX IF NOT EXISTS idx_logs_bot ON bot_logs(botId);
  `);
}

// Automatically initialize schema when module is loaded
initDatabase();
