import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { LogRepository } from '@mikasa/database';
import { getBotLogs } from '@mikasa/shared';
import { LogLevel } from '@mikasa/types';

export class LogController {
  public static async list(req: BotRequest, res: Response): Promise<void> {
    try {
      const limit = Number(req.query.limit || 100);
      const level = req.query.level as LogLevel | undefined;
      const search = req.query.search as string | undefined;

      // First check memory buffer for live logs
      const memLogs = getBotLogs(req.bot!.id, limit, level);
      if (memLogs.length > 0 && !search) {
        res.status(200).json({ success: true, data: memLogs });
        return;
      }

      // Fallback to database logs
      const dbLogs = LogRepository.findByBotId(req.bot!.id, limit, level, search);
      res.status(200).json({ success: true, data: dbLogs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async clear(req: BotRequest, res: Response): Promise<void> {
    try {
      LogRepository.clear(req.bot!.id);
      res.status(200).json({ success: true, message: 'Logs limpiados exitosamente' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
