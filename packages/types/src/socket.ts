import { BotConnectionStatus, BotStatus } from './bot.js';
import { BotLog } from './logs.js';
import { BotStats } from './stats.js';

export interface ServerToClientEvents {
  'bot:status': (payload: BotConnectionStatus) => void;
  'bot:qr': (payload: { botId: string; qrCode: string }) => void;
  'bot:pairingCode': (payload: { botId: string; pairingCode: string }) => void;
  'bot:log': (payload: BotLog) => void;
  'bot:stats': (payload: BotStats) => void;
  'bot:message': (payload: {
    botId: string;
    from: string;
    text: string;
    reply?: string;
    isGroup: boolean;
    timestamp: string;
  }) => void;
}

export interface ClientToServerEvents {
  'bot:subscribe': (botId: string) => void;
  'bot:unsubscribe': (botId: string) => void;
  'bot:simulateMessage': (
    payload: {
      botId: string;
      text: string;
      senderName?: string;
      senderNumber?: string;
      isGroup?: boolean;
    },
    callback: (response: { success: boolean; replyText?: string; error?: string }) => void
  ) => void;
}
