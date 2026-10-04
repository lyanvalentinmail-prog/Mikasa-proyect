'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Bot, LogOut, User as UserIcon, Plus, Sparkles } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-background/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <Link href="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-zinc-950 font-black shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition">
            <Bot className="h-5 w-5 text-zinc-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-zinc-100 group-hover:text-emerald-400 transition">
              MIKASA <span className="text-emerald-400 font-medium text-xs ml-0.5">PLATFORM</span>
            </span>
            <span className="text-[10px] text-zinc-400 tracking-wider font-mono">SUB-BOT MANAGER</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          href="/dashboard/bots/new"
          className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">CREAR SUB-BOT</span>
        </Link>

        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-zinc-800">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-xs font-bold text-emerald-400">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-200">{user.name}</span>
                <span className="text-[10px] text-zinc-400">{user.email}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
