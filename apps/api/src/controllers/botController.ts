import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { BotRequest } from '../middleware/botOwner.js';
import { BotRepository, CategoryRepository, CommandRepository, MenuRepository } from '@mikasa/database';
import { botManager } from '@mikasa/bot';

export class BotController {
  public static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const bots = BotRepository.findByUserId(req.user!.id);
      res.status(200).json({ success: true, data: bots });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const bot = await botManager.createBot(req.user!.id, req.body);
      res.status(201).json({ success: true, message: 'Sub-bot creado exitosamente', data: bot });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getById(req: BotRequest, res: Response): Promise<void> {
    try {
      const bot = req.bot!;
      const categories = CategoryRepository.findByBotId(bot.id);
      const commands = CommandRepository.findByBotId(bot.id);
      const menu = MenuRepository.getByBotId(bot.id);
      const status = botManager.getBotStatus(bot.id);

      res.status(200).json({
        success: true,
        data: {
          ...bot,
          status: status.status,
          isConnected: status.isConnected,
          phone: status.phone || bot.phone,
          categoriesCount: categories.length,
          commandsCount: commands.length,
          menu,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async update(req: BotRequest, res: Response): Promise<void> {
    try {
      const updated = BotRepository.update(req.bot!.id, req.body);
      res.status(200).json({ success: true, message: 'Sub-bot actualizado', data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async delete(req: BotRequest, res: Response): Promise<void> {
    try {
      await botManager.deleteBot(req.bot!.id);
      res.status(200).json({ success: true, message: 'Sub-bot eliminado correctamente' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
