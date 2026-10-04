'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Bot } from '@mikasa/types';
import { Save, Upload, Sparkles, Check, Trash2, ArrowLeft } from 'lucide-react';

export default function BotSettingsPage() {
  const params = useParams();
  const botId = params.id as string;
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState('WhatsApp Sub-bot');
  const [prefix, setPrefix] = useState('.');
  const [developer, setDeveloper] = useState('Lyan');
  const [website, setWebsite] = useState('https://mikasa-bot.com');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [banner, setBanner] = useState('');
  const [autoReconnect, setAutoReconnect] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const bot = await api.getBot(botId);
        setName(bot.name);
        setType(bot.type);
        setPrefix(bot.prefix);
        setDeveloper(bot.developer);
        setWebsite(bot.website);
        setDescription(bot.description);
        setProfilePicture(bot.profilePicture);
        setBanner(bot.banner);
        setAutoReconnect(bot.autoReconnect);
      } catch (err: any) {
        setError(err.message || 'Error al cargar configuración');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [botId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'avatar') {
          setProfilePicture(reader.result);
        } else {
          setBanner(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      await api.updateBot(botId, {
        name: name.trim(),
        type: type.trim(),
        prefix: prefix.trim(),
        developer: developer.trim(),
        website: website.trim(),
        description: description.trim(),
        profilePicture,
        banner,
        autoReconnect,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!confirm('¿Estás seguro de eliminar este sub-bot definitivamente? Se perderán comandos y sesiones asociadas.')) return;
    try {
      await api.deleteBot(botId);
      router.push('/dashboard');
    } catch (err: any) {
      alert(`Error al eliminar bot: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="rounded-3xl border border-zinc-800 bg-surface/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-white">Configuración del Sub-bot</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Modifica la identidad, imágenes, prefijo y enlaces del bot
            </p>
          </div>
          {saved && (
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              <Check className="w-4 h-4" />
              <span>Guardado exitoso</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Avatar and Banner */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-300">Foto de perfil & Banner</label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0 group">
                <img src={profilePicture} alt="Avatar" className="h-full w-full object-cover" />
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-[10px] text-white">
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span>Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 w-full space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">URL Avatar:</span>
                  <input
                    type="url"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">URL Banner:</span>
                  <input
                    type="url"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Nombre del bot</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Tipo de bot</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="WhatsApp Sub-bot">WhatsApp Sub-bot</option>
                <option value="WhatsApp Multi-Device">WhatsApp Multi-Device</option>
                <option value="WhatsApp Business Bot">WhatsApp Business Bot</option>
              </select>
            </div>
          </div>

          {/* Prefix & Developer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Prefix (Prefijo de comandos)</label>
              <input
                type="text"
                maxLength={5}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Developer / Creador</label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Website oficial</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Descripción</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Auto Reconnect Switch */}
          <div className="pt-2">
            <label className="flex items-center space-x-3 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReconnect}
                onChange={(e) => setAutoReconnect(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 h-4 w-4"
              />
              <span>Reconectar automáticamente en caso de pérdida de conexión</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDeleteBot}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-800/40 text-red-400 text-xs font-semibold transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Sub-bot</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'GUARDAR CAMBIOS'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
