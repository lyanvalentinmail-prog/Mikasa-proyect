import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or cwd
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  API_PORT: z.string().default('4000'),
  WEB_PORT: z.string().default('3000'),
  JWT_SECRET: z.string().default('mikasa-super-secret-key-change-in-production-2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  REDIS_URL: z.string().optional(),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_PATH: z.string().default('./uploads'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().default('*'),
});

export type EnvConfig = z.infer<typeof envSchema>;

let parsedEnv: EnvConfig;
try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  console.warn('⚠️ Environment warning: falling back to defaults:', error);
  parsedEnv = envSchema.parse({});
}

export const env = parsedEnv;
