'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { BotCategory, CategoryInput } from '@mikasa/types';
import { CategoryModal } from '@/components/CategoryModal';
import {
  FolderTree,
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  Layers,
  Terminal,
} from 'lucide-react';

export default function CategoriesPage() {
  const params = useParams();
  const botId = params.id as string;

  const [categories, setCategories] = useState<(BotCategory & { commandsCount: number })[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BotCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories(botId);
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [botId]);

  const handleSaveCategory = async (catData: CategoryInput) => {
    if (editingCategory) {
      await api.updateCategory(botId, editingCategory.id, catData);
    } else {
      await api.createCategory(botId, catData);
    }
    loadCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Deseas eliminar esta categoría? Los comandos asociados pasarán a General.')) return;
    try {
      await api.deleteCategory(botId, id);
      loadCategories();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-cyan-400" />
            <span>Categorías del Sub-bot</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Organiza los comandos en secciones temáticas para la generación automática del menú
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 text-xs font-bold shadow-lg shadow-cyan-950 transition hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>+ NUEVA CATEGORÍA</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-surface/50 border border-zinc-800 animate-pulse" />
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-zinc-400">
            No tienes categorías creadas aún.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-zinc-800 bg-surface/80 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between hover:border-cyan-500/40 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-sm">
                      {cat.symbol ? cat.symbol.slice(0, 4) : '✦'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                      <span className="font-mono text-[10px] text-zinc-500">
                        Símbolo: {cat.symbol || 'Predeterminado'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold border border-zinc-700">
                    {cat.commandsCount || 0} cmds
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
                  {cat.description || 'Sin descripción'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 rounded-lg transition"
                  title="Editar categoría"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                  title="Eliminar categoría"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        initialCategory={editingCategory}
      />
    </div>
  );
}
