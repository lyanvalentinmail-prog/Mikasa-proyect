import { MenuVariables } from '@mikasa/types';

/**
 * Safely resolves {{variable}} expressions in any text template
 */
export function resolveTemplateVariables(
  template: string,
  variables: Record<string, string | number | undefined | null>
): string {
  if (!template) return '';

  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      const val = variables[key];
      return val !== undefined && val !== null ? String(val) : '';
    }
    return match; // Keep unresolved variables intact if not found
  });
}

/**
 * Build standard variables object for a given bot and user context
 */
export function buildStandardVariables(options: {
  bot: {
    id: string;
    name: string;
    type?: string;
    prefix: string;
    developer?: string;
    website?: string;
    description?: string;
    ownerName?: string;
  };
  user?: {
    name?: string;
    number?: string;
    mention?: string;
  };
  extra?: Record<string, string | number>;
}): MenuVariables {
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return {
    'bot.id': options.bot.id,
    'bot.name': options.bot.name || 'Mikasa Bot',
    'bot.type': options.bot.type || 'WhatsApp Sub-bot',
    'bot.prefix': options.bot.prefix || '.',
    'bot.developer': options.bot.developer || 'Lyan',
    'bot.website': options.bot.website || 'https://mikasa-bot.com',
    'bot.description': options.bot.description || 'WhatsApp sub-bot platform',
    'bot.owner': options.bot.ownerName || options.bot.developer || 'Owner',
    'user.name': options.user?.name || 'Usuario',
    'user.number': options.user?.number || '598000000',
    date: dateStr,
    time: timeStr,
    'command.count': options.extra?.['command.count'] ?? 0,
    'category.count': options.extra?.['category.count'] ?? 0,
    ...options.extra,
  };
}
