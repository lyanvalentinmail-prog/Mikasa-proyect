import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const botCreateSchema = z.object({
  name: z.string().min(1, 'El nombre del bot es requerido').max(50),
  type: z.string().default('WhatsApp Sub-bot'),
  prefix: z.string().min(1, 'El prefix es requerido').max(5).default('.'),
  developer: z.string().min(1).default('Lyan'),
  website: z.string().url('URL inválida').default('https://mikasa-bot.com'),
  description: z.string().max(500).default('Sub-bot de WhatsApp creado con Mikasa'),
  profilePicture: z.string().optional().default('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'),
  banner: z.string().optional().default('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop'),
});

export const botUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  type: z.string().optional(),
  prefix: z.string().min(1).max(5).optional(),
  developer: z.string().optional(),
  website: z.string().url('URL inválida').optional(),
  description: z.string().max(500).optional(),
  profilePicture: z.string().optional(),
  banner: z.string().optional(),
  autoReconnect: z.boolean().optional(),
});

export const commandCreateSchema = z.object({
  name: z.string().min(1, 'El nombre del comando es requerido').regex(/^[a-zA-Z0-9_-]+$/, 'Solo letras, números y guiones'),
  aliases: z.array(z.string()).default([]),
  categoryId: z.string().nullable().optional(),
  description: z.string().min(1, 'La descripción es requerida'),
  usage: z.string().min(1, 'El uso es requerido'),
  response: z.string().min(1, 'La respuesta es requerida'),
  enabled: z.boolean().default(true),
  permissions: z.object({
    allowPrivate: z.boolean().default(true),
    allowGroup: z.boolean().default(true),
    adminOnly: z.boolean().default(false),
    ownerOnly: z.boolean().default(false),
  }).default({
    allowPrivate: true,
    allowGroup: true,
    adminOnly: false,
    ownerOnly: false,
  }),
});

export const commandUpdateSchema = commandCreateSchema.partial();

export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'El nombre de la categoría es requerido'),
  icon: z.string().default('Sparkles'),
  symbol: z.string().optional(),
  description: z.string().default(''),
  order: z.number().int().default(0),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const menuUpdateSchema = z.object({
  greeting: z.string().optional(),
  intro: z.string().optional(),
  separator: z.string().optional(),
  categoryHeader: z.string().optional(),
  commandFormat: z.string().optional(),
  categorySymbol: z.string().optional(),
  commandSymbol: z.string().optional(),
  footer: z.string().optional(),
  developerNote: z.string().optional(),
  websiteNote: z.string().optional(),
  customTemplate: z.string().nullable().optional(),
  useExactAesthetic: z.boolean().optional(),
});

export const pairingCodeRequestSchema = z.object({
  phoneNumber: z.string().min(6, 'Número de teléfono inválido'),
});
