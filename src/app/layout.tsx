import './globals.css';
import { Toaster } from '@/shared/components/ui/toaster';

export const metadata = {
  title: 'phoTextAI - Magic Editor',
  description: 'AI-powered image text editor.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.puter.com/v2/" async></script>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Playfair+Display&family=Merriweather&family=Montserrat&family=Open+Sans&family=Lobster&family=Courier+Prime&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
