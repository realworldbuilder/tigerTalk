import type { Metadata } from 'next';
import './globals.css';
import ConvexClientProvider from './ConvexClientProvider';
import Footer from '@/components/ui/Footer';
import { Toaster } from 'react-hot-toast';
import PlausibleProvider from 'next-plausible';

let title = 'Tiger Talk - AI-Powered Daily Construction Reports';
let description = 'Generate construction reports and actionable tasks from your voice notes';
let url = 'https://tigertalk.app';
let ogimage = 'https://tigertalk.app/images/og-image.png';
let sitename = 'tigertalk.app';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="tigertalk.app" />
      </head>
      <body>
        <ConvexClientProvider>
          {children}
          <Footer />
          <Toaster position="bottom-left" reverseOrder={false} />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
