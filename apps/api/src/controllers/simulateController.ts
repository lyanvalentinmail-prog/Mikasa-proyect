import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { botManager } from '@mikasa/bot';

export class SimulateController {
  public static async execute(req: BotRequest, res: Response): Promise<void> {
    try {
      const { text, senderName, senderNumber, isGroup } = req.body;

      if (!text) {
        res.status(400).json({ success: false, error: 'El mensaje de texto es requerido' });
        return;
      }

      const result = await botManager.simulateMessage(req.bot!.id, {
        text,
        senderName: senderName || 'Usuario Web',
        senderNumber: senderNumber || '59899123456',
        isGroup: Boolean(isGroup),
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
