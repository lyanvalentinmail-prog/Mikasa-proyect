'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  subscribeToBot: (botId: string) => void;
  unsubscribeFromBot: (botId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In browser, connect to current host origin
    const socketInstance = io(typeof window !== 'undefined' ? window.location.origin : '', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribeToBot = (botId: string) => {
    if (socket && botId) {
      socket.emit('bot:subscribe', botId);
    }
  };

  const unsubscribeFromBot = (botId: string) => {
    if (socket && botId) {
      socket.emit('bot:unsubscribe', botId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        subscribeToBot,
        unsubscribeFromBot,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe usarse dentro de un SocketProvider');
  }
  return context;
}
