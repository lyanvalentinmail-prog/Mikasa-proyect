export * from './user.js';
export * from './bot.js';
export * from './command.js';
export * from './category.js';
export * from './menu.js';
export * from './plugin.js';
export * from './logs.js';
export * from './stats.js';
export * from './socket.js';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
