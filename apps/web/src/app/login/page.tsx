'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Bot, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@mikasa.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-surface/90 p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2.5 mb-4 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-950 font-black">
              <Bot className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Iniciar Sesión</h2>
          <p className="text-xs text-zinc-400 mt-1">Accede a tu panel para administrar tus sub-bots</p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="mb-6 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px]">¿Quieres probar rápido? Usa la cuenta demo.</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition whitespace-nowrap shadow"
          >
            Llenar Demo
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 shadow-lg shadow-emerald-950 transition hover:scale-[1.01] disabled:opacity-50"
          >
            <span>{isLoading ? 'Iniciando sesión...' : 'ENTRAR AL DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-400">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-semibold text-emerald-400 hover:underline">
            Regístrate gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
