import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { PluginRepository } from '@mikasa/database';
import { PluginManager } from '@mikasa/bot';

export class PluginController {
  public static async list(req: BotRequest, res: Response): Promise<void> {
    try {
      const allDefinitions = PluginManager.getAllPlugins();
      const botPlugins = PluginRepository.getByBotId(req.bot!.id);

      const merged = allDefinitions.map((def) => {
        const found = botPlugins.find((bp) => bp.pluginId === def.id);
        return {
          ...def,
          enabled: found ? found.enabled : true,
          config: found ? found.config : def.defaultConfig || {},
        };
      });

      res.status(200).json({ success: true, data: merged });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async toggle(req: BotRequest, res: Response): Promise<void> {
    try {
      const pluginId = req.params.pluginId;
      const { enabled } = req.body;

      const def = PluginManager.getPlugin(pluginId);
      if (!def) {
        res.status(404).json({ success: false, error: 'Plugin no encontrado en el sistema.' });
        return;
      }

      const updated = PluginRepository.upsertPlugin(req.bot!.id, pluginId, {
        name: def.name,
        description: def.description,
        enabled: Boolean(enabled),
      });

      res.status(200).json({
        success: true,
        message: `Plugin ${enabled ? 'activado' : 'desactivado'} exitosamente`,
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async updateConfig(req: BotRequest, res: Response): Promise<void> {
    try {
      const pluginId = req.params.pluginId;
      const { config } = req.body;

      const def = PluginManager.getPlugin(pluginId);
      if (!def) {
        res.status(404).json({ success: false, error: 'Plugin no encontrado.' });
        return;
      }

      const updated = PluginRepository.upsertPlugin(req.bot!.id, pluginId, {
        name: def.name,
        description: def.description,
        config,
      });

      res.status(200).json({
        success: true,
        message: 'Configuración de plugin guardada',
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
