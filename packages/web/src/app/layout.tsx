import { Providers } from './providers';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Eswatini Events',
    template: '%s · Eswatini Events',
  },
  description:
    'Discover and book tickets for concerts, festivals, sports and cultural experiences across Eswatini.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eswatini-events.vercel.app'),
  openGraph: {
    title: 'Eswatini Events',
    description: 'Discover & book the best events in Eswatini.',
    type: 'website',
    locale: 'en_SZ',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-app text-app antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
