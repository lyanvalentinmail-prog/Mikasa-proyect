export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'COMMAND';

export interface BotLog {
  id: string;
  botId: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any> | null;
  timestamp: string;
}

export interface LogFilter {
  level?: LogLevel;
  search?: string;
  limit?: number;
  offset?: number;
}
