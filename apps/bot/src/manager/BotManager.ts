import { BotInstance } from './BotInstance.js';
import { BotConnectionStatus, BotCreateInput, Bot } from '@mikasa/types';
import { BotRepository, seedDefaultBotData } from '@mikasa/database';
import { createBotLog } from '@mikasa/shared';

export class BotManager {
  private static instance: BotManager;
  private instances: Map<string, BotInstance> = new Map();

  private constructor() {}

  public static getInstance(): BotManager {
    if (!BotManager.instance) {
      BotManager.instance = new BotManager();
    }
    return BotManager.instance;
  }

  public getOrCreateInstance(botId: string): BotInstance {
    let inst = this.instances.get(botId);
    if (!inst) {
      inst = new BotInstance(botId);
      this.instances.set(botId, inst);
    }
    return inst;
  }

  public async createBot(userId: string, input: BotCreateInput): Promise<Bot> {
    const bot = BotRepository.create(userId, input);
    seedDefaultBotData(bot.id);
    this.getOrCreateInstance(bot.id);
    createBotLog(bot.id, 'INFO', `Sub-bot "${bot.name}" creado exitosamente.`);
    return bot;
  }

  public async startBot(botId: string): Promise<BotConnectionStatus> {
    const inst = this.getOrCreateInstance(botId);
    await inst.start();
    return inst.getStatus();
  }

  public async stopBot(botId: string): Promise<BotConnectionStatus> {
    const inst = this.instances.get(botId);
    if (inst) {
      await inst.stop();
      return inst.getStatus();
    }
    return {
      botId,
      status: 'DISCONNECTED',
      isConnected: false,
    };
  }

  public async restartBot(botId: string): Promise<BotConnectionStatus> {
    const inst = this.getOrCreateInstance(botId);
    await inst.restart();
    return inst.getStatus();
  }

  public getBotStatus(botId: string): BotConnectionStatus {
    const inst = this.instances.get(botId);
    if (inst) {
      return inst.getStatus();
    }
    const dbBot = BotRepository.findById(botId);
    return {
      botId,
      status: (dbBot?.status as any) || 'DISCONNECTED',
      isConnected: Boolean(dbBot?.isConnected),
      phone: dbBot?.phone,
    };
  }

  public async requestPairingCode(botId: string, phoneNumber: string): Promise<string> {
    const inst = this.getOrCreateInstance(botId);
    return await inst.requestPairingCode(phoneNumber);
  }

  public async disconnectBot(botId: string): Promise<void> {
    const inst = this.instances.get(botId);
    if (inst) {
      await inst.stop();
    }
    BotRepository.update(botId, { status: 'DISCONNECTED', isConnected: false });
  }

  public async deleteBot(botId: string): Promise<boolean> {
    const inst = this.instances.get(botId);
    if (inst) {
      inst.destroy();
      this.instances.delete(botId);
    }
    return BotRepository.delete(botId);
  }

  public async simulateMessage(
    botId: string,
    payload: { text: string; senderName?: string; senderNumber?: string; isGroup?: boolean }
  ): Promise<{ replyText?: string; executed: boolean }> {
    const inst = this.getOrCreateInstance(botId);
    return await inst.simulateMessage(payload);
  }
}

export const botManager = BotManager.getInstance();
