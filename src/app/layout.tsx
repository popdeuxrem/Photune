import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/shared/components/ui/toaster';
import { ThemeProvider } from '@/shared/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Photune - AI-Powered Image Editor',
  description: 'Professional AI-powered image text editor with magic erase, font matching, and more.',
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
