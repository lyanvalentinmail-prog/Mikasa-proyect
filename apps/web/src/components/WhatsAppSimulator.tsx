'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot as BotIcon, User as UserIcon, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

interface MessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface WhatsAppSimulatorProps {
  botId: string;
  botName: string;
  botPrefix: string;
}

export function WhatsAppSimulator({ botId, botName, botPrefix }: WhatsAppSimulatorProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init_1',
      sender: 'bot',
      text: `👋 ¡Hola! Soy el simulador de ${botName}. Puedes probar cualquier comando aquí (ejemplo: ${botPrefix}menu, ${botPrefix}ping, ${botPrefix}chatgpt hola, ${botPrefix}peek).`,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState(`${botPrefix}menu`);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: MessageItem = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.simulateCommand(botId, {
        text: textToSend,
        senderName: 'Usuario Web',
      });

      const botReplyText =
        res.replyText ||
        (res.executed
          ? 'Comando ejecutado con éxito.'
          : `⚠️ No se encontró el comando "${textToSend}". Usa ${botPrefix}menu para ver los disponibles.`);

      const botMsg: MessageItem = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errMsg: MessageItem = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `❌ Error al ejecutar: ${err.message}`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const setQuickCommand = (cmd: string) => {
    setInput(`${botPrefix}${cmd}`);
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-zinc-800 bg-[#0b141a] overflow-hidden shadow-xl">
      {/* Simulator Header */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-zinc-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BotIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              <span>{botName}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                SIMULADOR
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400">Prueba comandos en vivo sin gastar mensajes de WhatsApp</p>
          </div>
        </div>
        <button
          onClick={() =>
            setMessages([
              {
                id: 'init_1',
                sender: 'bot',
                text: `👋 Simulador reiniciado. Prefijo actual: ${botPrefix}`,
                timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-700/50 transition"
          title="Reiniciar chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Command Pills */}
      <div className="bg-[#182229] px-3 py-2 flex items-center gap-1.5 overflow-x-auto border-b border-zinc-800 text-xs">
        <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Pruebas rápidas:
        </span>
        {['menu', 'ping', 'chatgpt ¿Qué hora es?', 'peek @amigo', 'sticker', 'dice', 'weather Madrid'].map(
          (cmd) => (
            <button
              key={cmd}
              onClick={() => setQuickCommand(cmd)}
              className="px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono border border-zinc-700 whitespace-nowrap transition"
            >
              {botPrefix}{cmd}
            </button>
          )
        )}
      </div>

      {/* Messages Log */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 shadow text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#005c4b] text-emerald-50 rounded-br-xs'
                  : 'bg-[#202c33] text-zinc-100 rounded-bl-xs border border-zinc-700/40'
              }`}
            >
              <pre className="font-mono text-[11px] whitespace-pre-wrap break-words">{m.text}</pre>
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.sender === 'user' ? 'text-emerald-200/60' : 'text-zinc-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] text-zinc-400 p-2.5 rounded-2xl text-xs flex items-center gap-2 border border-zinc-700/40">
              <span className="animate-spin text-emerald-400">🌀</span>
              <span>{botName} está escribiendo...</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="bg-[#202c33] p-2.5 flex items-center space-x-2 border-t border-zinc-700/50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Escribe un comando (ej: ${botPrefix}menu)...`}
          className="flex-1 bg-[#2a3942] text-zinc-100 placeholder-zinc-400 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-700/50 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition flex items-center justify-center font-semibold"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
