'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Bot, BotConnectionStatus } from '@mikasa/types';
import { StatusBadge } from '@/components/StatusBadge';
import { useSocket } from '@/context/SocketContext';
import {
  LayoutDashboard,
  QrCode,
  Settings,
  Terminal,
  FolderTree,
  FileEdit,
  Puzzle,
  ScrollText,
  BarChart3,
  ArrowLeft,
  ExternalLink,
  Power,
  PowerOff,
  RefreshCw,
} from 'lucide-react';

export default function BotDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const botId = params.id as string;
  const { socket, subscribeToBot, unsubscribeFromBot } = useSocket();

  const [bot, setBot] = useState<Bot | null>(null);
  const [status, setStatus] = useState<BotConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadBot = async () => {
    try {
      const data = await api.getBot(botId);
      setBot(data);
      setStatus({
        botId: data.id,
        status: data.status,
        isConnected: data.isConnected,
        phone: data.phone,
      });
    } catch (err: any) {
      console.error('Error loading bot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (botId) {
      loadBot();
      subscribeToBot(botId);

      if (socket) {
        socket.on('bot:status', (updatedStatus: BotConnectionStatus) => {
          if (updatedStatus.botId === botId) {
            setStatus(updatedStatus);
            setBot((prev) =>
              prev
                ? {
                    ...prev,
                    status: updatedStatus.status,
                    isConnected: updatedStatus.isConnected,
                    phone: updatedStatus.phone || prev.phone,
                  }
                : null
            );
          }
        });
      }

      return () => {
        unsubscribeFromBot(botId);
      };
    }
  }, [botId, socket]);

  const handleQuickConnect = async () => {
    setIsActionLoading(true);
    try {
      await api.connectBot(botId);
    } catch (err: any) {
      alert(`Error al conectar: ${err.message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleQuickDisconnect = async () => {
    setIsActionLoading(true);
    try {
      await api.disconnectBot(botId);
    } catch (err: any) {
      alert(`Error al desconectar: ${err.message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading && !bot) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs text-zinc-400">Cargando sub-bot...</span>
        </div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-lg font-bold text-white">Sub-bot no encontrado</h2>
        <Link href="/dashboard" className="mt-4 inline-block text-xs text-emerald-400 hover:underline">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  const navTabs = [
    { label: 'Resumen', href: `/dashboard/bots/${botId}`, icon: LayoutDashboard, exact: true },
    { label: 'Conectar WhatsApp', href: `/dashboard/bots/${botId}/connect`, icon: QrCode },
    { label: 'Comandos', href: `/dashboard/bots/${botId}/commands`, icon: Terminal },
    { label: 'Categorías', href: `/dashboard/bots/${botId}/categories`, icon: FolderTree },
    { label: 'Editor de Menú', href: `/dashboard/bots/${botId}/menu`, icon: FileEdit },
    { label: 'Plugins', href: `/dashboard/bots/${botId}/plugins`, icon: Puzzle },
    { label: 'Configuración', href: `/dashboard/bots/${botId}/settings`, icon: Settings },
    { label: 'Logs en Vivo', href: `/dashboard/bots/${botId}/logs`, icon: ScrollText },
    { label: 'Estadísticas', href: `/dashboard/bots/${botId}/stats`, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-1 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span className="font-mono text-[11px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
          ID: {bot.id}
        </span>
      </div>

      {/* Bot Header Card with Banner & Avatar */}
      <div className="relative rounded-3xl border border-zinc-800 bg-surface/80 overflow-hidden shadow-xl backdrop-blur-md">
        {/* Banner image */}
        <div className="h-32 sm:h-40 w-full relative overflow-hidden bg-zinc-900">
          <img
            src={bot.banner || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop'}
            alt="Bot Banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        </div>

        {/* Bot profile info */}
        <div className="p-5 sm:p-6 pt-0 relative -mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end space-x-4">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-4 border-surface bg-zinc-800 shadow-2xl flex-shrink-0">
              <img
                src={bot.profilePicture || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'}
                alt={bot.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white">{bot.name}</h1>
                <StatusBadge status={status?.status || bot.status} />
              </div>
              <p className="text-xs text-zinc-400 flex flex-wrap items-center gap-2">
                <span>{bot.type}</span>
                <span>•</span>
                <span>Prefix: <strong className="font-mono text-emerald-400">{bot.prefix}</strong></span>
                <span>•</span>
                <span>Dev: {bot.developer}</span>
                {bot.phone && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">+{bot.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2">
            {bot.isConnected ? (
              <button
                onClick={handleQuickDisconnect}
                disabled={isActionLoading}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 text-xs font-semibold transition"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
            ) : (
              <Link
                href={`/dashboard/bots/${botId}/connect`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Conectar WhatsApp</span>
              </Link>
            )}

            <button
              onClick={loadBot}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              title="Actualizar datos"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="px-4 sm:px-6 border-t border-zinc-800 flex overflow-x-auto no-scrollbar space-x-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center space-x-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Child Tab Content */}
      <div>{children}</div>
    </div>
  );
}
