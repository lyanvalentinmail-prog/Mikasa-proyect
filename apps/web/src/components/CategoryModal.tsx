'use client';

import React, { useState, useEffect } from 'react';
import { BotCategory, CategoryInput } from '@mikasa/types';
import { X, FolderPlus } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (catData: CategoryInput) => Promise<void>;
  initialCategory?: BotCategory | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialCategory,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [symbol, setSymbol] = useState('✦ ≽ 🌟 ≼');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setIcon(initialCategory.icon);
      setSymbol(initialCategory.symbol || '✦ ≽ 🌟 ≼');
      setDescription(initialCategory.description);
      setOrder(initialCategory.order);
    } else {
      setName('');
      setIcon('Sparkles');
      setSymbol('✦ ≽ 🌟 ≼');
      setDescription('');
      setOrder(0);
    }
    setError(null);
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        name: name.trim(),
        icon,
        symbol: symbol.trim(),
        description: description.trim(),
        order: Number(order),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                {initialCategory ? '✦ EDITAR CATEGORÍA ✦' : '✦ NUEVA CATEGORÍA ✦'}
              </h3>
              <p className="text-xs text-zinc-400">Organiza tus comandos para el menú automático</p>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Nombre de la categoría <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anime, IA, Herramientas..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Símbolo visual para el menú
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="- ≽ ^⎚ ˕ ⎚^ ≼"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comandos de reacciones y anime"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Orden de aparición</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'GUARDAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
