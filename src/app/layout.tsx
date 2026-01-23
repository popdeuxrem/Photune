import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/shared/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'phoTextAI - Magic Editor',
  description: 'AI-powered image text editor.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.puter.com/v2/" async></script>
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
