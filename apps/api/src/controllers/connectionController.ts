import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { botManager } from '@mikasa/bot';
import { SocketService } from '../services/socketService.js';

export class ConnectionController {
  public static async connect(req: BotRequest, res: Response): Promise<void> {
    try {
      const botId = req.bot!.id;
      const status = await botManager.startBot(botId);
      SocketService.broadcastBotStatus(status);

      res.status(200).json({
        success: true,
        message: 'Iniciando conexión con WhatsApp...',
        data: status,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async disconnect(req: BotRequest, res: Response): Promise<void> {
    try {
      const botId = req.bot!.id;
      const status = await botManager.stopBot(botId);
      SocketService.broadcastBotStatus(status);

      res.status(200).json({
        success: true,
        message: 'Sub-bot desconectado de WhatsApp',
        data: status,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async restart(req: BotRequest, res: Response): Promise<void> {
    try {
      const botId = req.bot!.id;
      const status = await botManager.restartBot(botId);
      SocketService.broadcastBotStatus(status);

      res.status(200).json({
        success: true,
        message: 'Sub-bot reiniciado',
        data: status,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async requestPairingCode(req: BotRequest, res: Response): Promise<void> {
    try {
      const botId = req.bot!.id;
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        res.status(400).json({ success: false, error: 'Número de WhatsApp requerido' });
        return;
      }

      const code = await botManager.requestPairingCode(botId, phoneNumber);
      SocketService.broadcastPairingCode(botId, code);

      res.status(200).json({
        success: true,
        message: 'Pairing Code generado exitosamente',
        data: { pairingCode: code },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getStatus(req: BotRequest, res: Response): Promise<void> {
    try {
      const status = botManager.getBotStatus(req.bot!.id);
      res.status(200).json({ success: true, data: status });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
