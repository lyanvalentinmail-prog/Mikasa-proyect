import { IConnection, MessagePayload } from '../connection/IConnection.js';
import { CommandDispatcher } from '../commands/CommandDispatcher.js';
import { createBotLog } from '@mikasa/shared';
import { BotRepository, StatRepository } from '@mikasa/database';

export class EventHandler {
  public static attach(connection: IConnection): void {
    const botId = connection.botId;

    connection.on('status', (status) => {
      BotRepository.update(botId, {
        status: status.status,
        phone: status.phone,
        isConnected: status.isConnected,
      });
      StatRepository.updateConnection(botId, status.isConnected);
    });

    connection.on('message', async (message: MessagePayload) => {
      try {
        await CommandDispatcher.handleIncomingMessage(botId, message, connection);
      } catch (err: any) {
        createBotLog(botId, 'ERROR', `Error en EventHandler: ${err.message}`);
        StatRepository.recordError(botId);
      }
    });
  }
}
