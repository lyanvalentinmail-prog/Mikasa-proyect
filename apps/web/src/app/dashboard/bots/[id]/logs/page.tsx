'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useSocket } from '@/context/SocketContext';
import { BotLog, LogLevel } from '@mikasa/types';
import {
  ScrollText,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Terminal,
  Activity,
  ArrowDown,
} from 'lucide-react';

export default function LogsPage() {
  const params = useParams();
  const botId = params.id as string;
  const { socket } = useSocket();

  const [logs, setLogs] = useState<BotLog[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const loadLogs = async () => {
    try {
      const data = await api.getLogs(botId, {
        level: selectedLevel !== 'ALL' ? selectedLevel : undefined,
        search: search.trim() ? search.trim() : undefined,
        limit: 150,
      });
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();

    if (socket) {
      socket.on('bot:log', (newLog: BotLog) => {
        if (newLog.botId === botId) {
          setLogs((prev) => [newLog, ...prev.slice(0, 200)]);
        }
      });
    }
  }, [botId, socket, selectedLevel]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  const handleClear = async () => {
    if (!confirm('¿Deseas limpiar todos los logs de este bot?')) return;
    try {
      await api.clearLogs(botId);
      setLogs([]);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'COMMAND':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40';
      case 'ERROR':
        return 'text-red-400 bg-red-950/60 border-red-800/40';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'INFO':
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesSearch =
      !search.trim() ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.level.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-400" />
            <span>Logs en Tiempo Real</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitoreo en vivo de eventos, comandos ejecutados y conexiones de WhatsApp
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadLogs}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            title="Recargar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-800/40 text-zinc-400 hover:text-red-400 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar Logs</span>
          </button>
        </div>
      </div>

      {/* Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Level filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'INFO', 'COMMAND', 'WARN', 'ERROR'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedLevel === lvl
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por texto de log..."
            className="w-full bg-surface border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Terminal Window View */}
      <div className="rounded-3xl border border-zinc-800 bg-[#070b12] overflow-hidden shadow-2xl">
        {/* Terminal Title Bar */}
        <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono font-semibold text-zinc-400 ml-2">
              mikasa-bot-manager@live-stream
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>
        </div>

        {/* Logs Output */}
        <div
          ref={logContainerRef}
          className="p-4 sm:p-5 h-[500px] overflow-y-auto font-mono text-xs space-y-1.5 select-text"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-zinc-500 py-12 text-center">
              No hay logs registrados para este filtro.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const time = new Date(log.timestamp).toLocaleTimeString('es-ES', {
                hour12: false,
              });
              return (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1 border-b border-zinc-900/60 hover:bg-zinc-900/30 px-1 rounded transition"
                >
                  <span className="text-zinc-500 font-mono text-[11px] flex-shrink-0">
                    [{time}]
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold border flex-shrink-0 ${getLevelBadge(
                      log.level
                    )}`}
                  >
                    {log.level}
                  </span>
                  <span className="text-zinc-200 break-words flex-1 leading-relaxed">
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
