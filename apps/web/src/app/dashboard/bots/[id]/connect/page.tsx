'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useSocket } from '@/context/SocketContext';
import { StatusBadge } from '@/components/StatusBadge';
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  Power,
  PowerOff,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { BotConnectionStatus } from '@mikasa/types';

export default function ConnectWhatsAppPage() {
  const params = useParams();
  const botId = params.id as string;
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState<'qr' | 'pairing'>('qr');
  const [status, setStatus] = useState<BotConnectionStatus | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('+598');
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const s = await api.getBotStatus(botId);
      setStatus(s);
      if (s.qrCode) setQrDataUrl(s.qrCode);
      if (s.pairingCode) setPairingCode(s.pairingCode);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (socket) {
      socket.on('bot:status', (updated: BotConnectionStatus) => {
        if (updated.botId === botId) {
          setStatus(updated);
          if (updated.qrCode) setQrDataUrl(updated.qrCode);
          if (updated.pairingCode) setPairingCode(updated.pairingCode);
        }
      });

      socket.on('bot:qr', (data: { botId: string; qrCode: string }) => {
        if (data.botId === botId) {
          setQrDataUrl(data.qrCode);
        }
      });

      socket.on('bot:pairingCode', (data: { botId: string; pairingCode: string }) => {
        if (data.botId === botId) {
          setPairingCode(data.pairingCode);
        }
      });
    }
  }, [botId, socket]);

  const handleStartConnectQR = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.connectBot(botId);
      setStatus(res);
      if (res.qrCode) setQrDataUrl(res.qrCode);
    } catch (err: any) {
      setError(err.message || 'Error al solicitar conexión QR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPairingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) {
      setError('Por favor ingresa un número de teléfono válido con código de país');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.requestPairingCode(botId, phoneNumber);
      setPairingCode(res.pairingCode);
    } catch (err: any) {
      setError(err.message || 'Error al generar Pairing Code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.disconnectBot(botId);
      setStatus(res);
      setQrDataUrl(null);
      setPairingCode(null);
    } catch (err: any) {
      setError(err.message || 'Error al desconectar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!pairingCode) return;
    const ok = await copyToClipboard(pairingCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Box */}
      <div className="rounded-3xl border border-zinc-800 bg-surface/90 p-6 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center pb-5 border-b border-zinc-800">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            CONECTAR SUB-BOT A WHATSAPP
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Vincula tu sesión de WhatsApp de forma segura mediante código QR o Pairing Code.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-xs text-zinc-400">Estado actual:</span>
            <StatusBadge status={status?.status || 'DISCONNECTED'} size="lg" />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection: QR vs Pairing Code */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              ¿Cómo quieres conectar?
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl text-xs font-bold transition border ${
                activeTab === 'qr'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>[ QR ]</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pairing')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl text-xs font-bold transition border ${
                activeTab === 'pairing'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>[ PAIRING CODE ]</span>
            </button>
          </div>
        </div>

        {/* Tab 1: QR Code Method */}
        {activeTab === 'qr' && (
          <div className="pt-4 space-y-6 text-center animate-in fade-in duration-200">
            {status?.isConnected ? (
              <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-emerald-300">🟢 WhatsApp Conectado</h3>
                <p className="text-xs text-zinc-400">
                  Tu sub-bot se encuentra en línea y listo para recibir comandos en tiempo real.
                </p>
                {status.phone && (
                  <div className="font-mono text-sm font-bold text-zinc-200 bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800 inline-block">
                    +{status.phone}
                  </div>
                )}
                <div>
                  <button
                    onClick={handleDisconnect}
                    disabled={isLoading}
                    className="mt-2 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 text-xs font-bold transition"
                  >
                    <PowerOff className="w-4 h-4" />
                    <span>Desconectar WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-md mx-auto">
                <div className="relative mx-auto w-64 h-64 rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-900/80 p-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="WhatsApp QR Code"
                      className="w-full h-full object-contain rounded-2xl bg-white p-2"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-4">
                      <QrCode className="w-12 h-12 text-zinc-600 mx-auto animate-pulse" />
                      <span className="text-xs text-zinc-400 block font-medium">
                        Presiona el botón para generar el código QR de vinculación
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleStartConnectQR}
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3.5 shadow-xl shadow-emerald-950 transition hover:scale-[1.01] disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'GENERANDO QR...' : qrDataUrl ? 'ACTUALIZAR CÓDIGO QR' : 'GENERAR CÓDIGO QR'}</span>
                  </button>

                  <div className="text-[11px] text-zinc-500 text-left bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                    <span className="font-bold text-zinc-300 block mb-1">Instrucciones:</span>
                    <p>1. Abre WhatsApp en tu teléfono móvil.</p>
                    <p>2. Ve a <strong>Ajustes / Configuración</strong> {'>'} <strong>Dispositivos vinculados</strong>.</p>
                    <p>3. Pulsa en <strong>Vincular un dispositivo</strong> y apunta tu cámara a este código QR.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pairing Code Method */}
        {activeTab === 'pairing' && (
          <div className="pt-4 space-y-6 max-w-md mx-auto animate-in fade-in duration-200">
            {status?.isConnected ? (
              <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-emerald-300">🟢 WhatsApp Conectado</h3>
                <p className="text-xs text-zinc-400">
                  Sub-bot vinculado exitosamente por número de WhatsApp.
                </p>
                <button
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="mt-2 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 text-xs font-bold transition"
                >
                  <PowerOff className="w-4 h-4" />
                  <span>Desconectar WhatsApp</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleRequestPairingCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Número de WhatsApp (con código de país)
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+598 99 123 456"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500 transition"
                      required
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Ejemplos: +59899123456, +5491112345678, +5215512345678
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-3.5 shadow-xl shadow-emerald-950 transition hover:scale-[1.01] disabled:opacity-50"
                  >
                    <span>{isLoading ? 'GENERANDO CÓDIGO...' : '✦ GENERAR CÓDIGO ✦'}</span>
                  </button>
                </form>

                {/* Pairing Code Result Box */}
                {pairingCode && (
                  <div className="rounded-2xl border-2 border-emerald-500/40 bg-zinc-950/90 p-5 text-center space-y-3 animate-in zoom-in-95 duration-200">
                    <span className="text-xs text-emerald-400 font-semibold tracking-wider font-mono">
                      CÓDIGO DE VINCULACIÓN:
                    </span>
                    <div className="text-3xl font-mono font-black tracking-widest text-white bg-zinc-900/90 py-3 px-4 rounded-xl border border-zinc-800 select-all">
                      {pairingCode}
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
                    </button>
                  </div>
                )}

                <div className="text-[11px] text-zinc-500 text-left bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
                  <span className="font-bold text-zinc-300 block mb-1">Instrucciones Pairing Code:</span>
                  <p>1. Abre WhatsApp en tu teléfono.</p>
                  <p>2. Ve a <strong>Dispositivos vinculados</strong> {'>'} <strong>Vincular un dispositivo</strong>.</p>
                  <p>3. Pulsa abajo en <strong>"Vincular con el número de teléfono"</strong>.</p>
                  <p>4. Ingresa el código de 8 caracteres mostrado arriba.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
