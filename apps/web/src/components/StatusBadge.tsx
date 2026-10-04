import React from 'react';
import { BotStatus } from '@mikasa/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: BotStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export function StatusBadge({ status, size = 'md', showPulse = true }: StatusBadgeProps) {
  let label = 'Desconectado';
  let dotColor = 'bg-red-500';
  let badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';

  switch (status) {
    case 'CONNECTED':
      label = 'Conectado';
      dotColor = 'bg-emerald-500';
      badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-950';
      break;
    case 'CONNECTING':
      label = 'Conectando...';
      dotColor = 'bg-yellow-400';
      badgeClass = 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
      break;
    case 'WAITING_QR':
      label = 'Esperando QR';
      dotColor = 'bg-amber-400';
      badgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      break;
    case 'WAITING_PAIRING':
      label = 'Esperando Pairing Code';
      dotColor = 'bg-amber-400';
      badgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      break;
    case 'ERROR':
      label = 'Error';
      dotColor = 'bg-red-500';
      badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';
      break;
    case 'DISCONNECTED':
    default:
      label = 'Desconectado';
      dotColor = 'bg-zinc-500';
      badgeClass = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-medium',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-all duration-300',
        sizeClasses[size],
        badgeClass
      )}
    >
      <span className="relative flex items-center justify-center">
        {showPulse && status === 'CONNECTED' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              dotColor
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full', dotSizes[size], dotColor)} />
      </span>
      <span>{label}</span>
    </span>
  );
}
