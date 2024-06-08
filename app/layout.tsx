import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Cairo({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'منصة سخاء',
  description:
    'تطبيق لإدارة التبرعات، يتيح للمسؤولين تتبع حملات التبرعات وتحديث نسبة الإنجاز تلقائيًا، مع دعم إدارة حملات متعددة بفعالية.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ar' dir='rtl'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
