import { Bot, BotCategory, BotCommand, MenuTemplate } from '@mikasa/types';
import { DEFAULT_AESTHETIC_MENU_HEADER, DEFAULT_CATEGORY_TEMPLATES } from '@mikasa/config';
import { formatAestheticCategoryTitle, toSmallCaps } from './aesthetic.js';
import { buildStandardVariables, resolveTemplateVariables } from './parser.js';

export interface GenerateMenuOptions {
  bot: Bot;
  categories: (BotCategory & { commands?: BotCommand[] })[];
  commands: BotCommand[];
  template?: MenuTemplate | null;
  userName?: string;
  userNumber?: string;
}

export function generateBotMenu(options: {
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
  categories: Array<{
    id: string;
    name: string;
    icon?: string;
    symbol?: string;
    description?: string;
    order?: number;
    commands?: Array<{
      id: string;
      name: string;
      aliases?: string[];
      description?: string;
      usage?: string;
      enabled?: boolean;
    }>;
  }>;
  template?: {
    greeting?: string;
    intro?: string;
    separator?: string;
    categoryHeader?: string;
    commandFormat?: string;
    categorySymbol?: string;
    commandSymbol?: string;
    footer?: string;
    developerNote?: string;
    websiteNote?: string;
    customTemplate?: string | null;
    useExactAesthetic?: boolean;
  } | null;
  userName?: string;
  userNumber?: string;
}): string {
  const { bot, categories, template, userName, userNumber } = options;

  // Flatten active commands
  let totalCommands = 0;
  categories.forEach((cat) => {
    totalCommands += (cat.commands || []).filter((c) => c.enabled !== false).length;
  });

  const variables = buildStandardVariables({
    bot,
    user: {
      name: userName || 'Usuario',
      number: userNumber || '598000000',
    },
    extra: {
      'command.count': totalCommands,
      'category.count': categories.length,
    },
  });

  // If a full custom template is set and not using exact aesthetic
  if (template?.customTemplate && template.customTemplate.trim().length > 0) {
    // Generate categories block for {{categories}} placeholder
    const categoriesText = buildCategoriesBlock(bot, categories);
    const fullVars = { ...variables, categories: categoriesText };
    return resolveTemplateVariables(template.customTemplate, fullVars);
  }

  // Exact Aesthetic Menu Generator (Matches prompt specifications 12 & 13)
  const categoriesText = buildCategoriesBlock(bot, categories);
  const rawHeader = template?.greeting || DEFAULT_AESTHETIC_MENU_HEADER;

  const headerWithCategories = rawHeader.includes('{{categories}}')
    ? rawHeader
    : `${rawHeader}\n\n{{categories}}`;

  const resolved = resolveTemplateVariables(headerWithCategories, {
    ...variables,
    categories: categoriesText,
  });

  return resolved;
}

function buildCategoriesBlock(
  bot: { prefix: string },
  categories: Array<{
    id: string;
    name: string;
    symbol?: string;
    description?: string;
    commands?: Array<{
      id: string;
      name: string;
      description?: string;
      usage?: string;
      enabled?: boolean;
    }>;
  }>
): string {
  const categorySections: string[] = [];

  for (const cat of categories) {
    const activeCommands = (cat.commands || []).filter((c) => c.enabled !== false);
    if (activeCommands.length === 0) continue;

    const preset = DEFAULT_CATEGORY_TEMPLATES[cat.name] || {
      symbol: '❀  ₍ᐢ.  ̫.ᐢ₎    ݁',
      headerSymbol: '✦ ≽ ⚙️ ≼',
      defaultDescription: toSmallCaps(cat.description || cat.name),
    };

    const headerSymbol = cat.symbol || preset.headerSymbol;
    const categoryTitleFormatted = formatAestheticCategoryTitle(cat.name);
    const categoryDesc = toSmallCaps(cat.description || preset.defaultDescription || cat.name);

    let catBlock = `${headerSymbol} ${categoryTitleFormatted}  ᰨᰍ    ;\n\n«✐ ${categoryDesc}»\n`;

    for (const cmd of activeCommands) {
      const cmdSymbol =
        cat.name === 'Anime'
          ? '❀ ૮₍ ˃̵͈᷄ . ฅ ₎ა   ݁'
          : preset.symbol || '❀  ₍ᐢ.  ̫.ᐢ₎    ݁';

      // Usage text
      let usageText = cmd.usage
        ? cmd.usage.replace(/\{\{bot\.prefix\}\}/g, bot.prefix)
        : `${bot.prefix}${cmd.name}`;

      // Description formatted in small caps
      const cmdDescSmallCaps = toSmallCaps(cmd.description || cmd.name);

      catBlock += `\n${cmdSymbol}  ${usageText}\n\n«── ˚. ᵎᵎ  ۠ ${cmdDescSmallCaps}»\n`;
    }

    catBlock += `\nᅟᅟ︶͜︶͜︶ᅟᅟ﹙ ❀﹚ᅟᅟ︶͜︶͜︶\n`;
    categorySections.push(catBlock);
  }

  return categorySections.join('\n');
}
