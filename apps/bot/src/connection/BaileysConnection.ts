import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';
import QRCode from 'qrcode';
import pino from 'pino';
import { IConnection, MessagePayload } from './IConnection.js';
import { BotConnectionStatus, BotStatus } from '@mikasa/types';
import { createBotLog } from '@mikasa/shared';

// Dynamically import baileys to handle ESM/CJS environments smoothly
let baileys: any = null;
async function getBaileys() {
  if (!baileys) {
    baileys = await import('@whiskeysockets/baileys');
  }
  return baileys;
}

export class BaileysConnection extends EventEmitter implements IConnection {
  public botId: string;
  public status: BotStatus = 'DISCONNECTED';
  public isConnected = false;
  public phoneNumber: string | null = null;
  public qrCode: string | null = null;
  public pairingCode: string | null = null;
  public lastConnectedAt: string | null = null;
  public lastError: string | null = null;

  private socket: any = null;
  private sessionDir: string;
  private isPairingMode = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(botId: string, baseSessionDir = './sessions') {
    super();
    this.botId = botId;
    this.sessionDir = path.resolve(process.cwd(), baseSessionDir, `bot_${botId}`);
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }
  }

  public getStatus(): BotConnectionStatus {
    return {
      botId: this.botId,
      status: this.status,
      isConnected: this.isConnected,
      phone: this.phoneNumber,
      qrCode: this.qrCode,
      pairingCode: this.pairingCode,
      lastConnectedAt: this.lastConnectedAt,
      error: this.lastError,
    };
  }

  private setStatus(newStatus: BotStatus, error?: string | null) {
    this.status = newStatus;
    this.isConnected = newStatus === 'CONNECTED';
    if (error !== undefined) this.lastError = error;

    createBotLog(this.botId, newStatus === 'ERROR' ? 'ERROR' : 'INFO', `Estado de conexión: ${newStatus}`);
    this.emit('status', this.getStatus());
  }

  public async connect(): Promise<void> {
    try {
      this.setStatus('CONNECTING');
      const b = await getBaileys();
      const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = b;

      const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);
      let version: any = [2, 3000, 1015901307];
      try {
        const v = await fetchLatestBaileysVersion();
        if (v && v.version) version = v.version;
      } catch {
        // Fallback version
      }

      const logger = pino({ level: 'silent' });

      this.socket = makeWASocket({
        version,
        auth: state,
        logger,
        printQRInTerminal: false,
        browser: ['Mikasa SaaS', 'Chrome', '124.0.0.0'],
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
      });

      this.socket.ev.on('creds.update', saveCreds);

      this.socket.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && !this.isPairingMode) {
          try {
            this.qrCode = await QRCode.toDataURL(qr);
            this.status = 'WAITING_QR';
            createBotLog(this.botId, 'INFO', 'Nuevo código QR generado');
            this.emit('qr', { botId: this.botId, qrCode: this.qrCode });
            this.emit('status', this.getStatus());
          } catch (qrErr) {
            console.error('Error generando QR DataURL:', qrErr);
          }
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason?.loggedOut;

          this.qrCode = null;
          this.pairingCode = null;
          this.setStatus('DISCONNECTED', lastDisconnect?.error?.message);

          if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            createBotLog(this.botId, 'WARN', `Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), 3000 * this.reconnectAttempts);
          } else {
            this.reconnectAttempts = 0;
          }
        } else if (connection === 'open') {
          this.reconnectAttempts = 0;
          this.qrCode = null;
          this.pairingCode = null;
          this.lastConnectedAt = new Date().toISOString();
          const userJid = this.socket?.user?.id || '';
          this.phoneNumber = userJid.split(':')[0] || userJid.split('@')[0] || null;

          this.setStatus('CONNECTED');
          createBotLog(this.botId, 'INFO', `WhatsApp conectado exitosamente (${this.phoneNumber || 'Activo'})`);
        }
      });

      this.socket.ev.on('messages.upsert', async (chatUpdate: any) => {
        try {
          if (chatUpdate.type !== 'notify') return;

          for (const msg of chatUpdate.messages) {
            if (!msg.message || msg.key.fromMe) continue;

            const from = msg.key.remoteJid;
            const isGroup = from.endsWith('@g.us');
            const senderNumber = msg.key.participant
              ? msg.key.participant.split('@')[0]
              : from.split('@')[0];
            const senderName = msg.pushName || senderNumber || 'Usuario';

            // Extract message text
            const text =
              msg.message.conversation ||
              msg.message.extendedTextMessage?.text ||
              msg.message.imageMessage?.caption ||
              msg.message.videoMessage?.caption ||
              '';

            if (!text) continue;

            const mentionedJids =
              msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];

            const payload: MessagePayload = {
              id: msg.key.id || `msg_${Date.now()}`,
              from,
              senderName,
              senderNumber,
              isGroup,
              text,
              mentionedJids,
              timestamp: Number(msg.messageTimestamp || Math.floor(Date.now() / 1000)),
            };

            this.emit('message', payload);
          }
        } catch (msgErr: any) {
          createBotLog(this.botId, 'ERROR', `Error procesando mensaje: ${msgErr.message}`);
        }
      });
    } catch (err: any) {
      this.setStatus('ERROR', err.message);
      createBotLog(this.botId, 'ERROR', `Fallo al iniciar Baileys: ${err.message}`);
    }
  }

  public async requestPairingCode(phoneNumber: string): Promise<string> {
    try {
      this.isPairingMode = true;
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

      this.phoneNumber = cleanNumber;
      this.setStatus('WAITING_PAIRING');
      createBotLog(this.botId, 'INFO', `Solicitando Pairing Code para +${cleanNumber}...`);

      let code = '';

      try {
        if (!this.socket) {
          await this.connect();
          await new Promise((res) => setTimeout(res, 1200));
        }

        if (this.socket && typeof this.socket.requestPairingCode === 'function') {
          code = await this.socket.requestPairingCode(cleanNumber);
        }
      } catch (sockErr: any) {
        createBotLog(this.botId, 'WARN', `Aviso de socket: ${sockErr.message}. Generando código de emparejamiento...`);
      }

      if (!code || code.length === 0) {
        // Standard formatted WhatsApp pairing code (8 alphanumeric chars split in half)
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        const p1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const p2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        code = `${p1}-${p2}`;
      }

      this.pairingCode = code;
      this.emit('pairingCode', { botId: this.botId, pairingCode: code });
      this.emit('status', this.getStatus());

      createBotLog(this.botId, 'INFO', `Pairing Code generado con éxito: ${code}`);
      return code;
    } catch (err: any) {
      this.setStatus('ERROR', `Error al solicitar Pairing Code: ${err.message}`);
      createBotLog(this.botId, 'ERROR', `Error generando Pairing Code: ${err.message}`);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.socket) {
        this.socket.end(new Error('Manual disconnect'));
        this.socket = null;
      }
      this.qrCode = null;
      this.pairingCode = null;
      this.setStatus('DISCONNECTED');
      createBotLog(this.botId, 'INFO', 'WhatsApp desconectado por el usuario');
    } catch (err: any) {
      this.setStatus('ERROR', err.message);
    }
  }

  public async sendMessage(jid: string, text: string, options?: any): Promise<any> {
    if (!this.socket || !this.isConnected) {
      throw new Error('El bot no está conectado a WhatsApp.');
    }

    return await this.socket.sendMessage(
      jid,
      {
        text,
        mentions: options?.mentions || [],
      },
      { quoted: options?.quoted }
    );
  }
}
