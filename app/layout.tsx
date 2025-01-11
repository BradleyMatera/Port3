import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './AuthProvider';
import { BottomNav } from '@/components/layout/bottom-nav'; // Adjust the path as needed

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Integration',
  description: 'App with Spotify Authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <main className="pb-16">{children}</main> {/* Ensure proper spacing for BottomNav */}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}