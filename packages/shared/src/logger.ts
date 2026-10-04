import { BotLog, LogLevel } from '@mikasa/types';
import { EventEmitter } from 'events';

class BotLoggerEmitter extends EventEmitter {}

export const botLogEmitter = new BotLoggerEmitter();

// In-memory rolling buffer per bot (last 200 logs per bot)
const botLogBuffer: Map<string, BotLog[]> = new Map();
const MAX_LOGS_PER_BOT = 250;

export function createBotLog(
  botId: string,
  level: LogLevel,
  message: string,
  metadata?: Record<string, any>
): BotLog {
  const log: BotLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    botId,
    level,
    message,
    metadata: metadata || null,
    timestamp: new Date().toISOString(),
  };

  if (!botLogBuffer.has(botId)) {
    botLogBuffer.set(botId, []);
  }

  const list = botLogBuffer.get(botId)!;
  list.unshift(log);
  if (list.length > MAX_LOGS_PER_BOT) {
    list.pop();
  }

  // Console output
  const time = new Date().toLocaleTimeString('es-ES', { hour12: false });
  const color =
    level === 'ERROR'
      ? '\x1b[31m'
      : level === 'WARN'
      ? '\x1b[33m'
      : level === 'COMMAND'
      ? '\x1b[36m'
      : '\x1b[32m';
  const reset = '\x1b[0m';
  console.log(`[${time}] ${color}${level}${reset} [${botId.slice(0, 8)}] ${message}`);

  // Emit event for real-time WebSocket push
  botLogEmitter.emit('log', log);
  botLogEmitter.emit(`log:${botId}`, log);

  return log;
}

export function getBotLogs(botId: string, limit = 50, level?: LogLevel): BotLog[] {
  const list = botLogBuffer.get(botId) || [];
  if (level) {
    return list.filter((l) => l.level === level).slice(0, limit);
  }
  return list.slice(0, limit);
}

export function clearBotLogs(botId: string): void {
  botLogBuffer.set(botId, []);
}
