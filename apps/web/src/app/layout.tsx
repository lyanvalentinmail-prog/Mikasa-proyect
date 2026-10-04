import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';

export const metadata: Metadata = {
  title: 'Mikasa | Plataforma de Sub-bots de WhatsApp',
  description: 'Crea, configura y administra sub-bots de WhatsApp desde un panel web profesional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background text-zinc-100 antialiased selection:bg-emerald-500 selection:text-zinc-950">
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
