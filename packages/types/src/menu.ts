export interface MenuTemplate {
  id: string;
  botId: string;
  greeting: string;
  intro: string;
  separator: string;
  categoryHeader: string;
  commandFormat: string;
  categorySymbol: string;
  commandSymbol: string;
  footer: string;
  developerNote: string;
  websiteNote: string;
  customTemplate?: string | null;
  useExactAesthetic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuConfigInput {
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
}

export interface MenuVariables {
  'bot.name': string;
  'bot.type': string;
  'bot.prefix': string;
  'bot.developer': string;
  'bot.website': string;
  'bot.description': string;
  'bot.id': string;
  'bot.owner': string;
  'user.name': string;
  'user.number': string;
  'date': string;
  'time': string;
  'command.count': number | string;
  'category.count': number | string;
  [key: string]: string | number;
}
