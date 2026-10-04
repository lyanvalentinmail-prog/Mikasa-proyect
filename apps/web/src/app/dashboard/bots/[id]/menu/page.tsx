'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { WhatsAppPhonePreview } from '@/components/WhatsAppPhonePreview';
import { MenuConfigInput, MenuTemplate } from '@mikasa/types';
import {
  FileEdit,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Code,
  Smartphone,
} from 'lucide-react';

export default function MenuEditorPage() {
  const params = useParams();
  const botId = params.id as string;

  const [bot, setBot] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [intro, setIntro] = useState('');
  const [separator, setSeparator] = useState('──');
  const [developerNote, setDeveloperNote] = useState('');
  const [websiteNote, setWebsiteNote] = useState('');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [useExactAesthetic, setUseExactAesthetic] = useState(true);

  const [previewText, setPreviewText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadMenu = async () => {
    try {
      const [botData, menuData] = await Promise.all([
        api.getBot(botId),
        api.getMenu(botId),
      ]);
      setBot(botData);
      setGreeting(menuData.config.greeting);
      setIntro(menuData.config.intro);
      setSeparator(menuData.config.separator);
      setDeveloperNote(menuData.config.developerNote);
      setWebsiteNote(menuData.config.websiteNote);
      setCustomTemplate(menuData.config.customTemplate || '');
      setUseExactAesthetic(menuData.config.useExactAesthetic);
      setPreviewText(menuData.preview);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [botId]);

  // Real-time live preview update debounce
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(async () => {
      try {
        const res = await api.previewMenu(botId, {
          greeting,
          intro,
          separator,
          developerNote,
          websiteNote,
          customTemplate: customTemplate.trim() ? customTemplate : null,
          useExactAesthetic,
        });
        setPreviewText(res.preview);
      } catch (err) {
        console.error('Preview error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [greeting, intro, separator, developerNote, websiteNote, customTemplate, useExactAesthetic, botId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await api.updateMenu(botId, {
        greeting,
        intro,
        separator,
        developerNote,
        websiteNote,
        customTemplate: customTemplate.trim() ? customTemplate : null,
        useExactAesthetic,
      });
      setPreviewText(res.preview);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = async () => {
    if (!confirm('¿Restaurar la plantilla estética original?')) return;
    try {
      await api.resetMenu(botId);
      loadMenu();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const insertVariable = (varName: string) => {
    setGreeting((prev) => `${prev} {{${varName}}}`);
  };

  if (isLoading || !bot) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-emerald-400" />
            <span>Editor del Menú Automático (.menu)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personaliza el encabezado, fuentes estilizadas, símbolos y variables con vista previa en vivo
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetDefault}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Predeterminado</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Live Editor on Left, Live WhatsApp Phone Mockup on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Template Fields */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl border border-zinc-800 bg-surface/90 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Configuración Visual del Menú</h3>
              </div>
              {saved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Guardado
                </span>
              )}
            </div>

            {/* Variable Pills */}
            <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-300 block">
                Variables dinámicas disponibles (clic para insertar):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'bot.name',
                  'bot.type',
                  'bot.prefix',
                  'bot.developer',
                  'bot.website',
                  'bot.description',
                  'user.name',
                  'user.number',
                  'date',
                  'time',
                  'command.count',
                  'category.count',
                ].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="text-[10px] bg-zinc-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/50 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md font-mono transition"
                  >
                    +{`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              {/* Greeting & Header Template */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Encabezado / Saludo Estético
                </label>
                <textarea
                  rows={10}
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Advanced Custom Raw Template Toggle */}
              <div className="pt-3 border-t border-zinc-800">
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Plantilla Completa Personalizada (Opcional)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    Sobrescribe la estética si se define
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={customTemplate}
                  onChange={(e) => setCustomTemplate(e.target.value)}
                  placeholder="Deja vacío para usar el diseño estético automático con {{categories}}"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xl shadow-emerald-950 transition hover:scale-[1.01] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'GUARDAR CAMBIOS EN EL MENÚ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Phone Mockup Preview */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>VISTA PREVIA EN TIEMPO REAL</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">Actualización en vivo</span>
          </div>

          <WhatsAppPhonePreview
            botName={bot.name}
            botAvatar={bot.profilePicture}
            menuContent={previewText}
            developer={bot.developer}
            website={bot.website}
          />
        </div>
      </div>
    </div>
  );
}
