export type BotStatus =
  | 'CONNECTED'
  | 'CONNECTING'
  | 'WAITING_QR'
  | 'WAITING_PAIRING'
  | 'DISCONNECTED'
  | 'ERROR';

export type BotType = 'WhatsApp Sub-bot' | 'WhatsApp Business' | 'WhatsApp Multi-Device';

export interface Bot {
  id: string;
  userId: string;
  name: string;
  type: string;
  prefix: string;
  developer: string;
  website: string;
  profilePicture: string;
  banner: string;
  description: string;
  status: BotStatus;
  phone?: string | null;
  isConnected: boolean;
  autoReconnect: boolean;
  pairingCode?: string | null;
  qrCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BotCreateInput {
  name: string;
  type?: string;
  prefix?: string;
  developer?: string;
  website?: string;
  description?: string;
  profilePicture?: string;
  banner?: string;
}

export interface BotUpdateInput {
  name?: string;
  type?: string;
  prefix?: string;
  developer?: string;
  website?: string;
  description?: string;
  profilePicture?: string;
  banner?: string;
  autoReconnect?: boolean;
}

export interface BotConnectionStatus {
  botId: string;
  status: BotStatus;
  isConnected: boolean;
  phone?: string | null;
  qrCode?: string | null;
  pairingCode?: string | null;
  pairingExpiresAt?: string | null;
  lastConnectedAt?: string | null;
  error?: string | null;
}
