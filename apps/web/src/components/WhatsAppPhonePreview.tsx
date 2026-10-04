import React from 'react';
import { Smartphone, CheckCheck } from 'lucide-react';
import Image from 'next/image';

interface WhatsAppPhonePreviewProps {
  botName: string;
  botAvatar: string;
  menuContent: string;
  developer?: string;
  website?: string;
}

export function WhatsAppPhonePreview({
  botName,
  botAvatar,
  menuContent,
}: WhatsAppPhonePreviewProps) {
  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative mx-auto w-full max-w-[340px] rounded-[40px] border-[6px] border-zinc-800 bg-zinc-950 p-2 shadow-2xl shadow-emerald-950/20">
      {/* Phone Notch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-28 bg-zinc-800 rounded-full z-20 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 mr-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
      </div>

      {/* Screen container */}
      <div className="overflow-hidden rounded-[32px] bg-[#0b141a] text-zinc-100 flex flex-col h-[580px] border border-zinc-800/80">
        {/* WhatsApp Top Header */}
        <div className="bg-[#202c33] px-3.5 pt-8 pb-3 flex items-center justify-between border-b border-zinc-700/40 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500/40 bg-zinc-800 flex-shrink-0">
              <img
                src={botAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'}
                alt={botName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate max-w-[150px]">
              <div className="text-xs font-semibold text-zinc-100 truncate">{botName}</div>
              <div className="text-[10px] text-emerald-400 font-medium">en línea</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chat Background & Messages */}
        <div
          className="flex-1 p-3 overflow-y-auto space-y-3 text-[11px] leading-relaxed select-text"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(20, 35, 45, 0.4) 0%, transparent 100%)`,
          }}
        >
          {/* User Command Bubble */}
          <div className="flex justify-end">
            <div className="bg-[#005c4b] text-emerald-50 px-2.5 py-1.5 rounded-l-lg rounded-br-lg max-w-[80%] shadow">
              <div>.menu</div>
              <div className="flex items-center justify-end space-x-1 text-[9px] text-emerald-200/70 mt-0.5">
                <span>{currentTime}</span>
                <CheckCheck className="w-3 h-3 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Bot Reply Message Bubble */}
          <div className="flex justify-start">
            <div className="bg-[#202c33] text-zinc-100 p-2.5 rounded-r-lg rounded-bl-lg max-w-[94%] shadow border border-zinc-700/30">
              <pre className="font-mono text-[10.5px] whitespace-pre-wrap break-words leading-tight text-zinc-200">
                {menuContent}
              </pre>
              <div className="flex items-center justify-end space-x-1 text-[9px] text-zinc-400 mt-1">
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Fake Input bar */}
        <div className="bg-[#202c33] p-2 flex items-center space-x-2 border-t border-zinc-700/40">
          <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-zinc-400">
            Escribe un mensaje...
          </div>
          <div className="w-7 h-7 rounded-full bg-[#00a884] flex items-center justify-center text-zinc-950 font-bold text-xs">
            ➤
          </div>
        </div>
      </div>
    </div>
  );
}
