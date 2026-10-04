import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { CategoryRepository } from '@mikasa/database';

export class CategoryController {
  public static async list(req: BotRequest, res: Response): Promise<void> {
    try {
      const categories = CategoryRepository.findByBotId(req.bot!.id);
      res.status(200).json({ success: true, data: categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async create(req: BotRequest, res: Response): Promise<void> {
    try {
      const created = CategoryRepository.create(req.bot!.id, req.body);
      res.status(201).json({ success: true, message: 'Categoría creada con éxito', data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async update(req: BotRequest, res: Response): Promise<void> {
    try {
      const catId = req.params.categoryId;
      const updated = CategoryRepository.update(catId, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Categoría no encontrada' });
        return;
      }
      res.status(200).json({ success: true, message: 'Categoría actualizada', data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async delete(req: BotRequest, res: Response): Promise<void> {
    try {
      const catId = req.params.categoryId;
      const deleted = CategoryRepository.delete(catId);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Categoría no encontrada' });
        return;
      }
      res.status(200).json({ success: true, message: 'Categoría eliminada' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
