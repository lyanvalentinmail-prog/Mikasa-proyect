'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { BotStats } from '@mikasa/types';
import {
  BarChart3,
  MessageSquare,
  Terminal,
  Users,
  Clock,
  AlertTriangle,
  Calendar,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatDate, formatNumber, formatUptime } from '@/lib/utils';

export default function BotStatsPage() {
  const params = useParams();
  const botId = params.id as string;

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getStats(botId);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [botId]);

  if (isLoading || !stats) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const history = stats.history || [
    { hour: '00:00', messages: 12, commands: 4 },
    { hour: '03:00', messages: 5, commands: 2 },
    { hour: '06:00', messages: 18, commands: 7 },
    { hour: '09:00', messages: 64, commands: 25 },
    { hour: '12:00', messages: 95, commands: 42 },
    { hour: '15:00', messages: 80, commands: 38 },
    { hour: '18:00', messages: 110, commands: 54 },
    { hour: '21:00', messages: 75, commands: 30 },
  ];

  const maxMessages = Math.max(...history.map((h: any) => h.messages), 10);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span>Métricas & Estadísticas del Sub-bot</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Rendimiento en tiempo real, volumen de mensajes procesados y comandos más solicitados
        </p>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Mensajes Totales</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {formatNumber(stats.messagesReceived)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Interacciones procesadas</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Comandos Ejecutados</span>
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 mt-2">
            {formatNumber(stats.commandsExecuted)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Acciones exitosas</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Usuarios Únicos</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {formatNumber(stats.uniqueUsers)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Números distintos</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Tiempo Online (Uptime)</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-teal-300 mt-2">
            {formatUptime(stats.uptimeSeconds)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Sesión activa</span>
        </div>
      </div>

      {/* Activity Chart & Top Commands */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Bar Chart */}
        <div className="lg:col-span-8 rounded-3xl border border-zinc-800 bg-surface/90 p-6 shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Actividad por Hora (Mensajes vs Comandos)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Distribución de tráfico a lo largo del día</p>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex items-end justify-between gap-2 h-52 border-b border-zinc-800 pb-2">
              {history.map((h: any, idx: number) => {
                const msgHeight = (h.messages / maxMessages) * 100;
                const cmdHeight = (h.commands / maxMessages) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {/* Messages bar */}
                      <div
                        style={{ height: `${Math.max(6, msgHeight)}%` }}
                        className="w-1/2 bg-emerald-500/80 hover:bg-emerald-400 rounded-t-md transition relative group-hover:glow-emerald"
                        title={`${h.messages} mensajes`}
                      />
                      {/* Commands bar */}
                      <div
                        style={{ height: `${Math.max(6, cmdHeight)}%` }}
                        className="w-1/2 bg-cyan-500/80 hover:bg-cyan-400 rounded-t-md transition"
                        title={`${h.commands} comandos`}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1">{h.hour}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-zinc-300">Mensajes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-cyan-500" />
                <span className="text-zinc-300">Comandos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Commands List */}
        <div className="lg:col-span-4 rounded-3xl border border-zinc-800 bg-surface/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Comandos Más Populares</span>
          </h3>

          <div className="space-y-3 pt-2">
            {(stats.topCommands || [
              { name: '.menu', count: 48 },
              { name: '.chatgpt', count: 35 },
              { name: '.ping', count: 28 },
              { name: '.peek', count: 21 },
              { name: '.sticker', count: 17 },
            ]).map((cmd: any, i: number) => (
              <div
                key={cmd.name}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-[10px]">
                    #{i + 1}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{cmd.name}</span>
                </div>
                <span className="font-semibold text-zinc-300">{cmd.count} ejecuciones</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
