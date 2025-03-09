import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { SheetProvider } from '@/providers/sheet-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finify',
  description: 'Finify is a personal finance tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <QueryProvider>
            <SheetProvider />
            {children}
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
