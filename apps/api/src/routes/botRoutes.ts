import { Router } from 'express';
import { BotController } from '../controllers/botController.js';
import { ConnectionController } from '../controllers/connectionController.js';
import { CommandController } from '../controllers/commandController.js';
import { CategoryController } from '../controllers/categoryController.js';
import { MenuController } from '../controllers/menuController.js';
import { PluginController } from '../controllers/pluginController.js';
import { LogController } from '../controllers/logController.js';
import { StatController } from '../controllers/statController.js';
import { SimulateController } from '../controllers/simulateController.js';
import { authMiddleware } from '../middleware/auth.js';
import { botOwnerMiddleware } from '../middleware/botOwner.js';
import { validateBody } from '../middleware/validate.js';
import {
  botCreateSchema,
  botUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  commandCreateSchema,
  commandUpdateSchema,
  menuUpdateSchema,
  pairingCodeRequestSchema,
} from '@mikasa/shared';

const router = Router();

// Apply auth to all bot routes
router.use(authMiddleware);

// Bot Collection
router.get('/', BotController.list);
router.post('/', validateBody(botCreateSchema), BotController.create);

// Individual Bot Operations (Guarded by botOwnerMiddleware)
router.get('/:id', botOwnerMiddleware, BotController.getById);
router.patch('/:id', botOwnerMiddleware, validateBody(botUpdateSchema), BotController.update);
router.delete('/:id', botOwnerMiddleware, BotController.delete);

// Connection & WhatsApp Lifecycle
router.post('/:id/connect', botOwnerMiddleware, ConnectionController.connect);
router.post('/:id/disconnect', botOwnerMiddleware, ConnectionController.disconnect);
router.post('/:id/restart', botOwnerMiddleware, ConnectionController.restart);
router.post(
  '/:id/pair-code',
  botOwnerMiddleware,
  validateBody(pairingCodeRequestSchema),
  ConnectionController.requestPairingCode
);
router.get('/:id/status', botOwnerMiddleware, ConnectionController.getStatus);

// Commands
router.get('/:id/commands', botOwnerMiddleware, CommandController.list);
router.post('/:id/commands', botOwnerMiddleware, validateBody(commandCreateSchema), CommandController.create);
router.patch(
  '/:id/commands/:commandId',
  botOwnerMiddleware,
  validateBody(commandUpdateSchema),
  CommandController.update
);
router.delete('/:id/commands/:commandId', botOwnerMiddleware, CommandController.delete);

// Categories
router.get('/:id/categories', botOwnerMiddleware, CategoryController.list);
router.post('/:id/categories', botOwnerMiddleware, validateBody(categoryCreateSchema), CategoryController.create);
router.patch(
  '/:id/categories/:categoryId',
  botOwnerMiddleware,
  validateBody(categoryUpdateSchema),
  CategoryController.update
);
router.delete('/:id/categories/:categoryId', botOwnerMiddleware, CategoryController.delete);

// Menu Customizer
router.get('/:id/menu', botOwnerMiddleware, MenuController.get);
router.patch('/:id/menu', botOwnerMiddleware, validateBody(menuUpdateSchema), MenuController.update);
router.post('/:id/menu/preview', botOwnerMiddleware, MenuController.preview);
router.post('/:id/menu/reset', botOwnerMiddleware, MenuController.reset);

// Plugins
router.get('/:id/plugins', botOwnerMiddleware, PluginController.list);
router.patch('/:id/plugins/:pluginId/toggle', botOwnerMiddleware, PluginController.toggle);
router.patch('/:id/plugins/:pluginId/config', botOwnerMiddleware, PluginController.updateConfig);

// Logs & Stats
router.get('/:id/logs', botOwnerMiddleware, LogController.list);
router.delete('/:id/logs', botOwnerMiddleware, LogController.clear);
router.get('/:id/stats', botOwnerMiddleware, StatController.get);

// Simulator / Tester
router.post('/:id/simulate', botOwnerMiddleware, SimulateController.execute);

export default router;
