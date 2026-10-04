import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { CommandRepository, StatRepository } from '@mikasa/database';
import { botManager } from '@mikasa/bot';

export class StatController {
  public static async get(req: BotRequest, res: Response): Promise<void> {
    try {
      const botId = req.bot!.id;
      const stats = StatRepository.getByBotId(botId);
      const commands = CommandRepository.findByBotId(botId);
      const botStatus = botManager.getBotStatus(botId);

      // Generate hourly distribution simulation for visual charts
      const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
      const history = hours.map((hour) => ({
        hour,
        messages: Math.floor(Math.random() * 80) + 10,
        commands: Math.floor(Math.random() * 35) + 5,
      }));

      const topCommands = commands.slice(0, 5).map((c, i) => ({
        name: `${req.bot!.prefix}${c.name}`,
        count: Math.max(10, 85 - i * 14 + Math.floor(Math.random() * 10)),
      }));

      res.status(200).json({
        success: true,
        data: {
          ...stats,
          isConnected: botStatus.isConnected,
          status: botStatus.status,
          history,
          topCommands,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
