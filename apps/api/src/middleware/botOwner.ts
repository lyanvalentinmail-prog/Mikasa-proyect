import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { BotRepository } from '@mikasa/database';
import { Bot } from '@mikasa/types';

export interface BotRequest extends AuthenticatedRequest {
  bot?: Bot;
}

export function botOwnerMiddleware(req: BotRequest, res: Response, next: NextFunction): void {
  const botId = req.params.id || req.params.botId;

  if (!botId) {
    res.status(400).json({ success: false, error: 'ID de sub-bot requerido en la ruta.' });
    return;
  }

  const bot = BotRepository.findById(botId);

  if (!bot) {
    res.status(404).json({ success: false, error: 'Sub-bot no encontrado.' });
    return;
  }

  // Check ownership (Admin role can bypass for support)
  if (req.user?.role !== 'ADMIN' && bot.userId !== req.user?.id) {
    res.status(403).json({
      success: false,
      error: 'Acceso denegado. No tienes permisos para administrar este sub-bot.',
    });
    return;
  }

  req.bot = bot;
  next();
}
