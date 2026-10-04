'use client';

import React from 'react';
import Link from 'next/link';
import { Bot } from '@mikasa/types';
import { StatusBadge } from './StatusBadge';
import {
  Settings,
  QrCode,
  PowerOff,
  Power,
  Trash2,
  Terminal,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BotCardProps {
  bot: Bot & { commandsCount?: number };
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BotCard({ bot, onConnect, onDisconnect, onDelete }: BotCardProps) {
  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-emerald-950/20 hover:shadow-2xl flex flex-col justify-between">
      <div>
        {/* Card Header: Avatar, Name, Type, Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative h-14 w-14 rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0 group-hover:border-emerald-500/50 transition">
              <img
                src={bot.profilePicture || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'}
                alt={bot.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition flex items-center gap-1.5">
                <span>🤖 {bot.name}</span>
              </h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                <span>{bot.type || 'WhatsApp Sub-bot'}</span>
                <span>•</span>
                <span>Dev: {bot.developer}</span>
              </p>
            </div>
          </div>
          <StatusBadge status={bot.status} />
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
          {bot.description || 'Sub-bot de WhatsApp configurado con comandos automáticos y plugins.'}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg border border-zinc-800">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">Prefix:</span>
            <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
              {bot.prefix}
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg border border-zinc-800">
            <span className="text-emerald-400 font-bold">⚡</span>
            <span className="text-zinc-400">Comandos:</span>
            <span className="font-semibold text-zinc-200">{bot.commandsCount ?? 0}</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg border border-zinc-800 col-span-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>Creado el {formatDate(bot.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <Link
          href={`/dashboard/bots/${bot.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-xs py-2 px-3.5 rounded-xl transition shadow-sm hover:shadow-emerald-900/40"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Administrar</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>

        {bot.isConnected ? (
          <button
            onClick={() => onDisconnect && onDisconnect(bot.id)}
            className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-red-950/50 hover:text-red-400 text-zinc-300 text-xs py-2 px-3 rounded-xl border border-zinc-700 hover:border-red-800/50 transition"
            title="Desconectar WhatsApp"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desconectar</span>
          </button>
        ) : (
          <Link
            href={`/dashboard/bots/${bot.id}/connect`}
            className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-emerald-950/50 hover:text-emerald-300 text-zinc-300 text-xs py-2 px-3 rounded-xl border border-zinc-700 hover:border-emerald-800/50 transition"
            title="Conectar WhatsApp"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Conectar</span>
          </Link>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(bot.id)}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition"
            title="Eliminar bot"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
