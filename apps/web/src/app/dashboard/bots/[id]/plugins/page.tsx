'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { PluginDefinition } from '@mikasa/types';
import {
  Puzzle,
  Sparkles,
  Bot as BotIcon,
  Smile,
  Shield,
  Gamepad2,
  Download,
  Wrench,
  Check,
  Terminal,
} from 'lucide-react';

export default function PluginsPage() {
  const params = useParams();
  const botId = params.id as string;

  const [plugins, setPlugins] = useState<(PluginDefinition & { enabled: boolean; config: any })[]>([]);
  const [botPrefix, setBotPrefix] = useState('.');
  const [isLoading, setIsLoading] = useState(true);

  const loadPlugins = async () => {
    try {
      const [data, bot] = await Promise.all([
        api.getPlugins(botId),
        api.getBot(botId),
      ]);
      setPlugins(data as any);
      setBotPrefix(bot.prefix || '.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlugins();
  }, [botId]);

  const handleToggle = async (pluginId: string, currentStatus: boolean) => {
    try {
      await api.togglePlugin(botId, pluginId, !currentStatus);
      setPlugins((prev) =>
        prev.map((p) => (p.id === pluginId ? { ...p, enabled: !currentStatus } : p))
      );
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const getPluginIcon = (id: string) => {
    switch (id) {
      case 'anime':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'ai':
        return <BotIcon className="w-5 h-5 text-cyan-400" />;
      case 'stickers':
        return <Smile className="w-5 h-5 text-amber-400" />;
      case 'moderation':
        return <Shield className="w-5 h-5 text-red-400" />;
      case 'games':
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'downloads':
        return <Download className="w-5 h-5 text-blue-400" />;
      case 'utilities':
      default:
        return <Wrench className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-purple-400" />
          <span>Módulos & Plugins Disponibles</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Activa o desactiva paquetes de comandos especializados para tu sub-bot
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-surface/50 border border-zinc-800 animate-pulse" />
          ))
        ) : (
          plugins.map((plugin) => (
            <div
              key={plugin.id}
              className={`rounded-2xl border p-5 shadow-lg backdrop-blur-md flex flex-col justify-between transition-all ${
                plugin.enabled
                  ? 'border-zinc-800 bg-surface/90 hover:border-purple-500/40'
                  : 'border-zinc-800/40 bg-zinc-950/40 opacity-70'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
                      {getPluginIcon(plugin.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{plugin.name}</h3>
                      <span className="text-[10px] text-zinc-500 font-mono">v{plugin.version} • {plugin.author}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(plugin.id, plugin.enabled)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition border ${
                      plugin.enabled
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {plugin.enabled ? 'Habilitado' : 'Desactivado'}
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{plugin.description}</p>

                {/* Command Pills */}
                <div className="mt-4 pt-3 border-t border-zinc-800/60">
                  <span className="text-[10px] font-bold text-zinc-400 block mb-1.5 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-purple-400" />
                    <span>Comandos incluidos:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {plugin.commands.map((cmd) => (
                      <span
                        key={cmd.name}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-900/90 text-purple-300 border border-purple-900/40"
                      >
                        {botPrefix}{cmd.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
