import { UserRepository } from './repositories/userRepository.js';
import { BotRepository } from './repositories/botRepository.js';
import { CategoryRepository } from './repositories/categoryRepository.js';
import { CommandRepository } from './repositories/commandRepository.js';
import { MenuRepository } from './repositories/menuRepository.js';
import { PluginRepository } from './repositories/pluginRepository.js';
import { DEFAULT_CATEGORIES, DEFAULT_INITIAL_COMMANDS } from '@mikasa/config';

export function seedDefaultBotData(botId: string) {
  // 1. Create Default Categories
  const categoryMap = new Map<string, string>();
  for (const cat of DEFAULT_CATEGORIES) {
    const created = CategoryRepository.create(botId, {
      name: cat.name,
      icon: cat.icon,
      symbol: cat.symbol,
      description: cat.description,
      order: cat.order,
    });
    categoryMap.set(cat.name, created.id);
  }

  // 2. Create Initial Commands
  for (const cmd of DEFAULT_INITIAL_COMMANDS) {
    const categoryId = categoryMap.get(cmd.categoryName) || null;
    CommandRepository.create(botId, {
      name: cmd.name,
      aliases: cmd.aliases,
      categoryId,
      description: cmd.description,
      usage: cmd.usage,
      response: cmd.response,
      enabled: cmd.enabled,
      permissions: cmd.permissions,
    });
  }

  // 3. Create Default Menu Template
  MenuRepository.getByBotId(botId);

  // 4. Register Standard Plugins
  const standardPlugins = [
    {
      pluginId: 'anime',
      name: 'Anime & Reacciones',
      description: 'Reacciones de anime estilizadas con menciones, gifs y citas.',
      enabled: true,
      config: { autoReaction: true, sfwOnly: true },
    },
    {
      pluginId: 'ai',
      name: 'Inteligencia Artificial',
      description: 'Respuestas inteligentes con ChatGPT, Gemini e Imagine AI.',
      enabled: true,
      config: { provider: 'auto', maxTokens: 500, temperature: 0.7 },
    },
    {
      pluginId: 'stickers',
      name: 'Generador de Stickers',
      description: 'Conversión de imágenes, videos y textos a stickers de WhatsApp.',
      enabled: true,
      config: { packName: 'Mikasa Sub-bot', authorName: 'Mikasa Platform' },
    },
    {
      pluginId: 'moderation',
      name: 'Moderación de Grupos',
      description: 'Control de spam, expulsión de usuarios, advertencias y menciones masivas.',
      enabled: true,
      config: { maxWarns: 3, antiSpam: true },
    },
    {
      pluginId: 'games',
      name: 'Minijuegos & Diversión',
      description: 'Trivia interactiva, dados, piedra-papel-tijeras y apuestas virtuales.',
      enabled: true,
      config: { coinsEnabled: true },
    },
    {
      pluginId: 'downloads',
      name: 'Descargas Multimedia',
      description: 'Descargas de videos y audios desde YouTube, Instagram y TikTok.',
      enabled: true,
      config: { maxFileSizeMb: 50 },
    },
    {
      pluginId: 'utilities',
      name: 'Herramientas & Utilidades',
      description: 'Medición de ping, uptime, generador de códigos QR y calculadora.',
      enabled: true,
      config: { publicPing: true },
    },
  ];

  for (const plugin of standardPlugins) {
    PluginRepository.upsertPlugin(botId, plugin.pluginId, plugin);
  }
}

export function seedDemoData() {
  // Check if demo user already exists
  const existingUser = UserRepository.findByEmail('demo@mikasa.com');
  if (existingUser) {
    console.log('✅ Demo data already present.');
    return;
  }

  console.log('🌱 Seeding demo user and Atlas Bot...');

  // Create demo user
  const user = UserRepository.create({
    email: 'demo@mikasa.com',
    password: 'password123',
    name: 'Lyan Valentin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  });

  // Create initial demo bot
  const bot = BotRepository.create(user.id, {
    name: 'Atlas Bot',
    type: 'WhatsApp Sub-bot',
    prefix: '.',
    developer: 'Lyan',
    website: 'https://mikasa-bot.com',
    description: 'Sub-bot oficial de alta velocidad con IA, Anime y Utilidades.',
    profilePicture: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop',
  });

  seedDefaultBotData(bot.id);
  console.log(`✅ Demo data seeded successfully! User: demo@mikasa.com (bot: ${bot.name})`);
}

if (process.argv[1]?.includes('seed.ts')) {
  seedDemoData();
}
