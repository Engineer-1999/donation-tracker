import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { description, title } from './metadata';
import Providers from './providers';

const cairoFont = Cairo({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: title,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ar' dir='rtl'>
      <body className={cairoFont.className}>
        <Providers>
          {children}
          <Toaster position='bottom-center' />
        </Providers>
      </body>
    </html>
  );
}
