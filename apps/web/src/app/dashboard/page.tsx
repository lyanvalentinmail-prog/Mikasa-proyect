'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Bot } from '@mikasa/types';
import { BotCard } from '@/components/BotCard';
import {
  Plus,
  Bot as BotIcon,
  Activity,
  Layers,
  MessageSquare,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [bots, setBots] = useState<(Bot & { commandsCount: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getBots();
      setBots(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar sub-bots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBots();
  }, []);

  const handleDisconnect = async (id: string) => {
    try {
      await api.disconnectBot(id);
      loadBots();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este sub-bot? Esta acción no se puede deshacer.')) return;
    try {
      await api.deleteBot(id);
      loadBots();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const totalBots = bots.length;
  const activeBots = bots.filter((b) => b.isConnected || b.status === 'CONNECTED').length;
  const totalCommands = bots.reduce((acc, b) => acc + (b.commandsCount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Greeting & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold tracking-wider font-mono">
            <span>DASHBOARD</span>
            <span>•</span>
            <span>PANEL PRINCIPAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Hola, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Administra tus sub-bots de WhatsApp, supervisa su estado y personaliza sus comandos.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadBots}
            className="p-2.5 rounded-xl border border-zinc-800 bg-surface/80 hover:bg-surface-hover text-zinc-400 hover:text-zinc-200 transition"
            title="Recargar bots"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/dashboard/bots/new"
            className="inline-flex items-center space-x-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 text-xs font-bold shadow-xl shadow-emerald-950 transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ CREAR SUB-BOT</span>
          </Link>
        </div>
      </div>

      {/* Overview Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-surface/70 p-5 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400">Total Sub-bots</span>
            <div className="text-2xl font-black text-white mt-1">{totalBots}</div>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">Instancias configuradas</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <BotIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/70 p-5 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400">Sub-bots Conectados</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{activeBots}</div>
            <span className="text-[11px] text-emerald-400/70 mt-0.5 block">
              {activeBots > 0 ? '🟢 En línea y respondiendo' : 'Ningún bot en línea'}
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface/70 p-5 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400">Comandos Habilitados</span>
            <div className="text-2xl font-black text-teal-300 mt-1">{totalCommands}</div>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">En todas tus instancias</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub-bots Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Tus Sub-bots</span>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              {bots.length}
            </span>
          </h2>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl border border-zinc-800 bg-surface/40 animate-pulse" />
            ))}
          </div>
        ) : bots.length === 0 ? (
          /* Empty state */
          <div className="rounded-3xl border border-dashed border-zinc-800 bg-surface/30 p-12 text-center max-w-xl mx-auto">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No tienes ningún sub-bot creado</h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
              Crea tu primer sub-bot de WhatsApp para personalizar sus comandos, conectar tu número y automatizar tus mensajes.
            </p>
            <Link
              href="/dashboard/bots/new"
              className="mt-6 inline-flex items-center space-x-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-xs font-bold shadow-lg shadow-emerald-950 transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ CREAR MI PRIMER SUB-BOT</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                onDisconnect={handleDisconnect}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
