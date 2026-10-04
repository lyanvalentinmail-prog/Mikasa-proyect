import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { CommandRepository } from '@mikasa/database';

export class CommandController {
  public static async list(req: BotRequest, res: Response): Promise<void> {
    try {
      const commands = CommandRepository.findByBotId(req.bot!.id);
      res.status(200).json({ success: true, data: commands });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async create(req: BotRequest, res: Response): Promise<void> {
    try {
      const created = CommandRepository.create(req.bot!.id, req.body);
      res.status(201).json({ success: true, message: 'Comando creado con éxito', data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async update(req: BotRequest, res: Response): Promise<void> {
    try {
      const cmdId = req.params.commandId;
      const updated = CommandRepository.update(cmdId, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Comando no encontrado' });
        return;
      }
      res.status(200).json({ success: true, message: 'Comando actualizado', data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async delete(req: BotRequest, res: Response): Promise<void> {
    try {
      const cmdId = req.params.commandId;
      const deleted = CommandRepository.delete(cmdId);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Comando no encontrado' });
        return;
      }
      res.status(200).json({ success: true, message: 'Comando eliminado' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
