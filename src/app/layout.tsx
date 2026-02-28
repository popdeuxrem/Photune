import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/shared/components/ui/toaster';
import { ThemeProvider } from '@/shared/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Photune - AI-Powered Image Text Editor',
    template: '%s | Photune',
  },
  description: 'Edit text in any image with AI. Extract text, remove watermarks, rewrite with AI, and export in multiple formats. Free to start.',
  keywords: ['AI image editor', 'text in image', 'OCR', 'magic erase', 'watermark removal', 'image editing', 'AI design'],
  authors: [{ name: 'Photune' }],
  creator: 'Photune',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://photune.app',
    siteName: 'Photune',
    title: 'Photune - AI-Powered Image Text Editor',
    description: 'Edit text in any image with AI. Extract text, remove watermarks, rewrite with AI, and export in multiple formats.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Photune - AI Image Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photune - AI-Powered Image Text Editor',
    description: 'Edit text in any image with AI. Extract text, remove watermarks, rewrite with AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://js.puter.com/v2/" async></script>
      </head>
      <body className={`${inter.className} bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
