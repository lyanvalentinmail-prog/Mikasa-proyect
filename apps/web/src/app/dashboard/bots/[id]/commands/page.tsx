'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { BotCategory, BotCommand, CommandInput } from '@mikasa/types';
import { CommandBuilderModal } from '@/components/CommandBuilderModal';
import {
  Terminal,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  Shield,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function CommandsPage() {
  const params = useParams();
  const botId = params.id as string;

  const [commands, setCommands] = useState<BotCommand[]>([]);
  const [categories, setCategories] = useState<BotCategory[]>([]);
  const [botPrefix, setBotPrefix] = useState('.');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState<BotCommand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [cmds, cats, bot] = await Promise.all([
        api.getCommands(botId),
        api.getCategories(botId),
        api.getBot(botId),
      ]);
      setCommands(cmds);
      setCategories(cats);
      setBotPrefix(bot.prefix || '.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [botId]);

  const handleSaveCommand = async (input: CommandInput) => {
    if (editingCommand) {
      await api.updateCommand(botId, editingCommand.id, input);
    } else {
      await api.createCommand(botId, input);
    }
    loadData();
  };

  const handleToggleEnabled = async (cmd: BotCommand) => {
    try {
      await api.updateCommand(botId, cmd.id, { enabled: !cmd.enabled });
      setCommands((prev) =>
        prev.map((c) => (c.id === cmd.id ? { ...c, enabled: !c.enabled } : c))
      );
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteCommand = async (cmdId: string) => {
    if (!confirm('¿Deseas eliminar este comando?')) return;
    try {
      await api.deleteCommand(botId, cmdId);
      loadData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredCommands = commands.filter((cmd) => {
    const matchesSearch =
      cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.aliases.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || cmd.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & New Command Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Administrador de Comandos</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Crea comandos personalizados, gestiona permisos y conecta respuestas automáticas
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCommand(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold shadow-lg shadow-emerald-950 transition hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>+ NUEVO COMANDO</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por comando, alias o descripción..."
            className="w-full bg-surface border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-surface border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Todas las categorías ({commands.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Commands Table / Grid */}
      <div className="rounded-3xl border border-zinc-800 bg-surface/90 overflow-hidden shadow-xl backdrop-blur-xl">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-zinc-400">Cargando comandos...</span>
          </div>
        ) : filteredCommands.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            No se encontraron comandos que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Comando</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Descripción & Uso</th>
                  <th className="py-3 px-4">Permisos</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredCommands.map((cmd) => {
                  const cat = categories.find((c) => c.id === cmd.categoryId);
                  return (
                    <tr
                      key={cmd.id}
                      className="hover:bg-zinc-800/30 transition group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        <div className="flex items-center gap-1.5">
                          <span>{botPrefix}{cmd.name}</span>
                          {cmd.aliases.length > 0 && (
                            <span className="text-[10px] text-zinc-500 font-normal">
                              ({cmd.aliases.join(', ')})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700">
                          {cat ? cat.name : 'General'}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-zinc-200 font-medium truncate">{cmd.description}</div>
                        <div className="font-mono text-[10px] text-zinc-500 truncate">{cmd.usage}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          {cmd.permissions?.allowPrivate && (
                            <span className="px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                              Privado
                            </span>
                          )}
                          {cmd.permissions?.allowGroup && (
                            <span className="px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                              Grupos
                            </span>
                          )}
                          {cmd.permissions?.adminOnly && (
                            <span className="px-1.5 py-0.2 rounded bg-red-950/50 text-red-400 border border-red-800/40">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleEnabled(cmd)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition border ${
                            cmd.enabled
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}
                        >
                          {cmd.enabled ? 'Activo' : 'Desactivado'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              setEditingCommand(cmd);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCommand(cmd.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Command Builder Modal */}
      <CommandBuilderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCommand(null);
        }}
        onSave={handleSaveCommand}
        categories={categories}
        botPrefix={botPrefix}
        initialCommand={editingCommand}
      />
    </div>
  );
}
