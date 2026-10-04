import { BaileysConnection } from '../connection/BaileysConnection.js';
import { IConnection } from '../connection/IConnection.js';
import { EventHandler } from '../events/EventHandler.js';
import { BotConnectionStatus, BotStatus } from '@mikasa/types';
import { CommandDispatcher } from '../commands/CommandDispatcher.js';
import { StatRepository } from '@mikasa/database';
import { createBotLog } from '@mikasa/shared';

export class BotInstance {
  public readonly botId: string;
  public connection: IConnection;
  private uptimeInterval: any = null;

  constructor(botId: string) {
    this.botId = botId;
    this.connection = new BaileysConnection(botId);
    EventHandler.attach(this.connection);

    // Track uptime every 30 seconds when connected
    this.uptimeInterval = setInterval(() => {
      if (this.connection.isConnected) {
        StatRepository.incrementUptime(this.botId, 30);
      }
    }, 30000);
  }

  public async start(): Promise<void> {
    await this.connection.connect();
  }

  public async stop(): Promise<void> {
    await this.connection.disconnect();
  }

  public async restart(): Promise<void> {
    await this.stop();
    await new Promise((res) => setTimeout(res, 1500));
    await this.start();
  }

  public async requestPairingCode(phoneNumber: string): Promise<string> {
    return await this.connection.requestPairingCode(phoneNumber);
  }

  public getStatus(): BotConnectionStatus {
    return this.connection.getStatus();
  }

  public async simulateMessage(payload: {
    text: string;
    senderName?: string;
    senderNumber?: string;
    isGroup?: boolean;
  }): Promise<{ replyText?: string; executed: boolean }> {
    const msg = {
      id: `sim_${Date.now()}`,
      from: payload.isGroup ? '120363024849202@g.us' : '59899123456@s.whatsapp.net',
      senderName: payload.senderName || 'Tester',
      senderNumber: payload.senderNumber || '59899123456',
      isGroup: Boolean(payload.isGroup),
      text: payload.text,
      timestamp: Math.floor(Date.now() / 1000),
    };

    createBotLog(this.botId, 'INFO', `Simulación de mensaje recibida: "${payload.text}"`);
    return await CommandDispatcher.handleIncomingMessage(this.botId, msg, this.connection);
  }

  public destroy(): void {
    if (this.uptimeInterval) {
      clearInterval(this.uptimeInterval);
    }
    this.connection.disconnect().catch(() => {});
  }
}
