import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './AuthProvider';
import { BottomNav } from '@/components/layout/bottom-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Integration',
  description: 'App with Spotify Authentication',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <main className="pb-16">{children}</main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}