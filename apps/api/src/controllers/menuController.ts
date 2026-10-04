import { Response } from 'express';
import { BotRequest } from '../middleware/botOwner.js';
import { CategoryRepository, CommandRepository, MenuRepository } from '@mikasa/database';
import { generateBotMenu } from '@mikasa/shared';
import { DEFAULT_AESTHETIC_MENU_HEADER } from '@mikasa/config';

export class MenuController {
  public static async get(req: BotRequest, res: Response): Promise<void> {
    try {
      const bot = req.bot!;
      const menu = MenuRepository.getByBotId(bot.id);
      const categories = CategoryRepository.findByBotId(bot.id);
      const allCommands = CommandRepository.findByBotId(bot.id);

      const categoriesWithCommands = categories.map((cat) => ({
        ...cat,
        commands: allCommands.filter((c) => c.categoryId === cat.id && c.enabled),
      }));

      const formattedPreview = generateBotMenu({
        bot,
        categories: categoriesWithCommands,
        template: menu,
      });

      res.status(200).json({
        success: true,
        data: {
          config: menu,
          preview: formattedPreview,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async update(req: BotRequest, res: Response): Promise<void> {
    try {
      const updated = MenuRepository.update(req.bot!.id, req.body);
      const categories = CategoryRepository.findByBotId(req.bot!.id);
      const allCommands = CommandRepository.findByBotId(req.bot!.id);

      const categoriesWithCommands = categories.map((cat) => ({
        ...cat,
        commands: allCommands.filter((c) => c.categoryId === cat.id && c.enabled),
      }));

      const preview = generateBotMenu({
        bot: req.bot!,
        categories: categoriesWithCommands,
        template: updated,
      });

      res.status(200).json({
        success: true,
        message: 'Plantilla de menú actualizada',
        data: { config: updated, preview },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async preview(req: BotRequest, res: Response): Promise<void> {
    try {
      const draftTemplate = req.body;
      const categories = CategoryRepository.findByBotId(req.bot!.id);
      const allCommands = CommandRepository.findByBotId(req.bot!.id);

      const categoriesWithCommands = categories.map((cat) => ({
        ...cat,
        commands: allCommands.filter((c) => c.categoryId === cat.id && c.enabled),
      }));

      const preview = generateBotMenu({
        bot: req.bot!,
        categories: categoriesWithCommands,
        template: draftTemplate,
      });

      res.status(200).json({ success: true, data: { preview } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async reset(req: BotRequest, res: Response): Promise<void> {
    try {
      const resetConfig = MenuRepository.update(req.bot!.id, {
        greeting: DEFAULT_AESTHETIC_MENU_HEADER,
        intro: '✎ ᴀᴏ̨ᴜɪ ᴛɪᴇɴᴇs ʟᴀ ʟɪsᴛᴀ ᴅᴇ ʟᴏs ᴄᴏᴍᴀɴᴅᴏs',
        separator: '──',
        customTemplate: null,
        useExactAesthetic: true,
      });

      res.status(200).json({
        success: true,
        message: 'Menú restaurado al diseño estético predeterminado',
        data: resetConfig,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
