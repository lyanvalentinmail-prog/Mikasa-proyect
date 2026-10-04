'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Bot, BotStats } from '@mikasa/types';
import { StatusBadge } from '@/components/StatusBadge';
import { WhatsAppSimulator } from '@/components/WhatsAppSimulator';
import {
  QrCode,
  Terminal,
  Settings,
  Sparkles,
  MessageSquare,
  Activity,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { formatNumber, formatUptime } from '@/lib/utils';

export default function BotOverviewPage() {
  const params = useParams();
  const botId = params.id as string;

  const [bot, setBot] = useState<any>(null);
  const [stats, setStats] = useState<BotStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [botData, statsData] = await Promise.all([
          api.getBot(botId),
          api.getStats(botId),
        ]);
        setBot(botData);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading bot overview:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [botId]);

  if (isLoading || !bot) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-surface/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Mensajes</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {formatNumber(stats?.messagesReceived || 0)}
          </div>
          <span className="text-[10px] text-zinc-500">Recibidos y procesados</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Comandos</span>
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {formatNumber(stats?.commandsExecuted || 0)}
          </div>
          <span className="text-[10px] text-zinc-500">Ejecutados</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Usuarios Únicos</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {formatNumber(stats?.uniqueUsers || 0)}
          </div>
          <span className="text-[10px] text-zinc-500">Interactuaron con el bot</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Uptime</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-300 mt-2">
            {formatUptime(stats?.uptimeSeconds || 0)}
          </div>
          <span className="text-[10px] text-zinc-500">Tiempo en línea</span>
        </div>
      </div>

      {/* Main Content Grid: Simulator + Connection Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Command Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Simulador Interactivo de Comandos</span>
            </h3>
            <span className="text-xs text-zinc-500">Prueba inmediata en el navegador</span>
          </div>

          <WhatsAppSimulator
            botId={bot.id}
            botName={bot.name}
            botPrefix={bot.prefix}
          />
        </div>

        {/* Right Column: Connection Status & Quick Settings */}
        <div className="lg:col-span-5 space-y-5">
          {/* Connection Status Box */}
          <div className="rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Estado de WhatsApp</span>
              </h4>
              <StatusBadge status={bot.status} size="sm" />
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Número conectado:</span>
                <span className="font-mono font-semibold text-zinc-200">
                  {bot.phone ? `+${bot.phone}` : 'No vinculado'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Auto-reconexión:</span>
                <span className="text-emerald-400 font-semibold">Activada</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Prefijo activo:</span>
                <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {bot.prefix}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/dashboard/bots/${bot.id}/connect`}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 transition shadow"
              >
                <QrCode className="w-4 h-4" />
                <span>Gestionar Conexión (QR / Pairing Code)</span>
              </Link>

              <Link
                href={`/dashboard/bots/${bot.id}/menu`}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold py-2.5 transition"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Personalizar Plantilla del Menú</span>
              </Link>
            </div>
          </div>

          {/* Quick Info & Developer Details */}
          <div className="rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md space-y-3">
            <h4 className="text-sm font-bold text-white">Detalles del Sub-bot</h4>

            <p className="text-xs text-zinc-400 leading-relaxed">{bot.description}</p>

            <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Desarrollador:</span>
                <span className="text-zinc-300 font-medium">{bot.developer}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Sitio Web:</span>
                <a
                  href={bot.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                >
                  <span>{bot.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Categorías:</span>
                <span className="text-zinc-300 font-medium">{bot.categoriesCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Comandos:</span>
                <span className="text-zinc-300 font-medium">{bot.commandsCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
