import { BotConnectionStatus, BotStatus } from '@mikasa/types';
import { EventEmitter } from 'events';

export interface MessagePayload {
  id: string;
  from: string;
  senderName: string;
  senderNumber: string;
  isGroup: boolean;
  groupName?: string;
  groupMembers?: string[];
  text: string;
  mentionedJids?: string[];
  timestamp: number;
}

export interface IConnection extends EventEmitter {
  botId: string;
  status: BotStatus;
  isConnected: boolean;
  phoneNumber?: string | null;
  qrCode?: string | null;
  pairingCode?: string | null;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  requestPairingCode(phoneNumber: string): Promise<string>;
  getStatus(): BotConnectionStatus;
  sendMessage(jid: string, text: string, options?: any): Promise<any>;
}
