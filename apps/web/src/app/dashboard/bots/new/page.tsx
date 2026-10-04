'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Bot,
  Image as ImageIcon,
  Tag,
  Terminal,
  User,
  Globe,
  ArrowLeft,
  Sparkles,
  Upload,
  FileText,
} from 'lucide-react';

export default function NewBotPage() {
  const router = useRouter();
  const [name, setName] = useState('Atlas Bot');
  const [type, setType] = useState('WhatsApp Sub-bot');
  const [prefix, setPrefix] = useState('.');
  const [developer, setDeveloper] = useState('Lyan');
  const [website, setWebsite] = useState('https://mikasa-bot.com');
  const [description, setDescription] = useState('Sub-bot oficial de alta velocidad con IA, Anime y Utilidades.');
  const [profilePicture, setProfilePicture] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'
  );
  const [banner, setBanner] = useState(
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!name.trim()) {
      setError('El nombre del bot es obligatorio');
      return;
    }
    if (!prefix.trim()) {
      setError('El prefijo es obligatorio');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createdBot = await api.createBot({
        name: name.trim(),
        type: type.trim(),
        prefix: prefix.trim(),
        developer: developer.trim(),
        website: website.trim(),
        description: description.trim(),
        profilePicture,
        banner,
      });

      // Redirect automatically to the bot dashboard overview
      router.push(`/dashboard/bots/${createdBot.id}`);
    } catch (err: any) {
      setError(err.message || 'Error al crear el sub-bot');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Dashboard</span>
        </Link>
      </div>

      {/* Main Creation Card */}
      <div className="rounded-3xl border border-zinc-800 bg-surface/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center pb-6 border-b border-zinc-800">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-950 mb-3 font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">
            ✦ CREAR SUB-BOT ✦
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configura la identidad y parámetros iniciales de tu nuevo bot de WhatsApp
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Photos: Profile & Banner */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <span>🖼️ Foto del bot & Banner</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0 group">
                <img src={profilePicture} alt="Bot Preview" className="h-full w-full object-cover" />
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
                  <span className="text-[11px] text-zinc-400 block mb-1">URL Foto de perfil:</span>
                  <input
                    type="url"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">URL Banner (página del bot):</span>
                  <input
                    type="url"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bot Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <span>🤖 Nombre del bot</span> <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Atlas Bot"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          {/* Type & Prefix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <span>🏷️ Tipo</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="WhatsApp Sub-bot">WhatsApp Sub-bot</option>
                <option value="WhatsApp Multi-Device">WhatsApp Multi-Device</option>
                <option value="WhatsApp Business Bot">WhatsApp Business Bot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <span>⌨️ Prefix (Prefijo)</span> <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={5}
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Developer & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <span>👤 Developer</span>
              </label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="Lyan"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <span>🔗 Website</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://mikasa-bot.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <span>📝 Descripción</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción para la interfaz y créditos del bot"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black py-3.5 shadow-xl shadow-emerald-950 transition hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'CREANDO SUB-BOT...' : '✦ CREAR BOT ✦'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
