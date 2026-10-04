import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { botLogEmitter } from '@mikasa/shared';
import { BotConnectionStatus, BotLog } from '@mikasa/types';
import { botManager } from '@mikasa/bot';

export class SocketService {
  private static io: SocketIOServer | null = null;

  public static init(server: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.io.on('connection', (socket: Socket) => {
      // Subscribe to specific bot updates
      socket.on('bot:subscribe', (botId: string) => {
        if (botId) {
          socket.join(`bot:${botId}`);
          // Send initial status immediately
          const status = botManager.getBotStatus(botId);
          socket.emit('bot:status', status);
        }
      });

      socket.on('bot:unsubscribe', (botId: string) => {
        if (botId) {
          socket.leave(`bot:${botId}`);
        }
      });

      // Interactive Simulator message from browser chat
      socket.on('bot:simulateMessage', async (payload, callback) => {
        try {
          const { botId, text, senderName, senderNumber, isGroup } = payload;
          if (!botId || !text) {
            if (typeof callback === 'function') {
              callback({ success: false, error: 'botId y texto requeridos' });
            }
            return;
          }

          const result = await botManager.simulateMessage(botId, {
            text,
            senderName,
            senderNumber,
            isGroup,
          });

          // Broadcast message event to bot room
          SocketService.emitToBot(botId, 'bot:message', {
            botId,
            from: senderNumber || '59899123456',
            text,
            reply: result.replyText,
            isGroup: Boolean(isGroup),
            timestamp: new Date().toISOString(),
          });

          if (typeof callback === 'function') {
            callback({
              success: true,
              replyText: result.replyText,
            });
          }
        } catch (err: any) {
          if (typeof callback === 'function') {
            callback({ success: false, error: err.message });
          }
        }
      });
    });

    // Listen to shared bot logger
    botLogEmitter.on('log', (log: BotLog) => {
      this.emitToBot(log.botId, 'bot:log', log);
    });

    return this.io;
  }

  public static getIO(): SocketIOServer {
    if (!this.io) {
      throw new Error('SocketService not initialized.');
    }
    return this.io;
  }

  public static emitToBot(botId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`bot:${botId}`).emit(event, data);
      this.io.emit(`${event}:${botId}`, data);
    }
  }

  public static broadcastBotStatus(status: BotConnectionStatus): void {
    this.emitToBot(status.botId, 'bot:status', status);
  }

  public static broadcastQR(botId: string, qrCode: string): void {
    this.emitToBot(botId, 'bot:qr', { botId, qrCode });
  }

  public static broadcastPairingCode(botId: string, pairingCode: string): void {
    this.emitToBot(botId, 'bot:pairingCode', { botId, pairingCode });
  }
}
