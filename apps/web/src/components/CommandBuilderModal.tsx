'use client';

import React, { useState, useEffect } from 'react';
import { BotCategory, BotCommand, CommandInput } from '@mikasa/types';
import { X, Sparkles, Terminal, Shield, HelpCircle } from 'lucide-react';

interface CommandBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (commandData: CommandInput) => Promise<void>;
  categories: BotCategory[];
  botPrefix: string;
  initialCommand?: BotCommand | null;
}

export function CommandBuilderModal({
  isOpen,
  onClose,
  onSave,
  categories,
  botPrefix,
  initialCommand,
}: CommandBuilderModalProps) {
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [usage, setUsage] = useState('');
  const [response, setResponse] = useState('');
  const [allowPrivate, setAllowPrivate] = useState(true);
  const [allowGroup, setAllowGroup] = useState(true);
  const [adminOnly, setAdminOnly] = useState(false);
  const [ownerOnly, setOwnerOnly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCommand) {
      setName(initialCommand.name);
      setAliases(initialCommand.aliases.join(', '));
      setCategoryId(initialCommand.categoryId || '');
      setDescription(initialCommand.description);
      setUsage(initialCommand.usage);
      setResponse(initialCommand.response);
      setAllowPrivate(initialCommand.permissions?.allowPrivate ?? true);
      setAllowGroup(initialCommand.permissions?.allowGroup ?? true);
      setAdminOnly(initialCommand.permissions?.adminOnly ?? false);
      setOwnerOnly(initialCommand.permissions?.ownerOnly ?? false);
    } else {
      setName('');
      setAliases('');
      setCategoryId(categories[0]?.id || '');
      setDescription('');
      setUsage(`${botPrefix}comando <argumento>`);
      setResponse('Respuesta para {{user.name}}: {{args}}');
      setAllowPrivate(true);
      setAllowGroup(true);
      setAdminOnly(false);
      setOwnerOnly(false);
    }
    setError(null);
  }, [initialCommand, isOpen, categories, botPrefix]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setName(clean);
    if (!initialCommand) {
      setUsage(`${botPrefix}${clean || 'comando'} <argumento>`);
    }
  };

  const insertVariable = (varName: string) => {
    setResponse((prev) => `${prev} {{${varName}}}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del comando es requerido');
      return;
    }
    if (!description.trim()) {
      setError('La descripción es requerida');
      return;
    }
    if (!response.trim()) {
      setError('La plantilla de respuesta es requerida');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const aliasArray = aliases
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .filter((a) => a.length > 0);

      await onSave({
        name: name.trim().toLowerCase(),
        aliases: aliasArray,
        categoryId: categoryId || null,
        description: description.trim(),
        usage: usage.trim(),
        response: response.trim(),
        enabled: true,
        permissions: {
          allowPrivate,
          allowGroup,
          adminOnly,
          ownerOnly,
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar comando');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-surface p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                {initialCommand ? '✦ EDITAR COMANDO ✦' : '✦ NUEVO COMANDO ✦'}
              </h3>
              <p className="text-xs text-zinc-400">Configura la lógica, alias y permisos de ejecución</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Command Name & Aliases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Nombre del comando <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-mono">{botPrefix}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="chatgpt"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-7 pr-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Alias (separados por coma)
              </label>
              <input
                type="text"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="gpt, ia, ai"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="">(Sin categoría / General)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {cat.symbol ? `(${cat.symbol})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Descripción <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Habla con ChatGPT e IA"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Usage */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Uso / Sintaxis <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder={`${botPrefix}chatgpt <texto>`}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Response with Variable Pills */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300">
                Plantilla de Respuesta <span className="text-emerald-400">*</span>
              </label>
              <span className="text-[10px] text-zinc-500">Variables dinámicas:</span>
            </div>

            {/* Quick insert buttons */}
            <div className="flex flex-wrap gap-1 mb-2">
              {['user.name', 'args', 'mention', 'bot.name', 'bot.prefix', 'respuesta', 'date', 'time'].map(
                (v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="text-[10px] bg-zinc-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/50 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded font-mono transition"
                  >
                    +{`{{${v}}}`}
                  </button>
                )
              )}
            </div>

            <textarea
              rows={3}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="🤖 {{bot.name}} dice: {{respuesta}}"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Permissions Checkboxes */}
          <div className="pt-2 border-t border-zinc-800">
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Permisos de ejecución</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPrivate}
                  onChange={(e) => setAllowPrivate(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0"
                />
                <span>☑ Privado</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowGroup}
                  onChange={(e) => setAllowGroup(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0"
                />
                <span>☑ Grupos</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adminOnly}
                  onChange={(e) => setAdminOnly(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0"
                />
                <span>Solo admins</span>
              </label>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'GUARDAR COMANDO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
