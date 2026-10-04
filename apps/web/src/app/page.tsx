import Link from 'next/link';
import {
  Bot,
  Sparkles,
  QrCode,
  ShieldCheck,
  Terminal,
  Zap,
  Layers,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090d16] text-zinc-100">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-600/15 via-cyan-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 border-b border-zinc-800/60 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 font-black shadow-lg shadow-emerald-950">
            <Bot className="h-6 w-6 text-zinc-950" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            MIKASA <span className="text-emerald-400 text-sm font-semibold">SAAS</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-300 hover:text-white transition px-4 py-2 rounded-xl hover:bg-zinc-800/60"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold shadow-lg shadow-emerald-950 transition hover:scale-[1.02]"
          >
            <span>CREAR CUENTA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300 mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Plataforma Modular para Sub-bots de WhatsApp</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Crea, Conecta y Administra tus{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Sub-bots de WhatsApp
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          Un verdadero constructor de bots en la nube. Configura la identidad de tu bot, conéctalo al instante
          vía <strong>Código QR</strong> o <strong>Pairing Code</strong>, y gestiona comandos, menús automáticos y
          plugins desde una interfaz web moderna y oscura.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-950/60 transition hover:scale-105"
          >
            <Zap className="w-4 h-4" />
            <span>Crear mi Sub-bot Gratis</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 rounded-2xl border border-zinc-700 bg-surface/80 hover:bg-surface-hover px-6 py-3.5 text-sm font-semibold text-zinc-200 transition backdrop-blur-md"
          >
            <span>Acceder al Panel Demo</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl border border-zinc-800 bg-surface/60 p-6 backdrop-blur-md">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Conexión Instantánea</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Escanea el código QR dinámico o introduce tu número de WhatsApp para vincular mediante Pairing Code (ej: <code>A7K9-2PQM</code>).
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-surface/60 p-6 backdrop-blur-md">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Menú Automático Estético</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              El comando <code>.menu</code> se construye automáticamente en vivo a partir de tus categorías y comandos activos con tipografía Small Caps y estética prémium.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-surface/60 p-6 backdrop-blur-md">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Plugins Modulares & IA</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Módulos listos para usar: ChatGPT, Gemini, Anime reactions, Generador de Stickers, Moderación y Juegos interactivos.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-zinc-950/60 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 Mikasa Bot Platform • Arquitectura Monorepo Escalable para Sub-bots de WhatsApp</p>
      </footer>
    </div>
  );
}
