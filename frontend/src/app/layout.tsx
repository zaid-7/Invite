import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: '../assets/fonts/inter.ttf',
  variable: '--font-inter',
  weight: '400 700',
  display: 'swap',
});

const playfairDisplay = localFont({
  src: '../assets/fonts/playfair-display.ttf',
  variable: '--font-playfair',
  weight: '400 700',
  display: 'swap',
});

const devanagari = localFont({
  src: '../assets/fonts/noto-sans-devanagari.ttf',
  variable: '--font-devanagari',
  weight: '400 700',
  display: 'swap',
});

const nastaliq = localFont({
  src: '../assets/fonts/noto-nastaliq-urdu.ttf',
  variable: '--font-nastaliq',
  weight: '400 700',
  display: 'swap',
});

const greatVibes = localFont({
  src: '../assets/fonts/great-vibes.ttf',
  variable: '--font-great-vibes',
  weight: '400',
  display: 'swap',
});

const alexBrush = localFont({
  src: '../assets/fonts/alex-brush.ttf',
  variable: '--font-alex-brush',
  weight: '400',
  display: 'swap',
});

const cormorantGaramond = localFont({
  src: '../assets/fonts/cormorant-garamond.ttf',
  variable: '--font-cormorant',
  weight: '300 700',
  display: 'swap',
});

const jost = localFont({
  src: '../assets/fonts/jost.ttf',
  variable: '--font-jost',
  weight: '300 600',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InviteCraft — Premium Digital Invitations',
  description: 'Create and share stunning, animated digital invitations for weddings, birthdays, and festivals with authentic Indian heritage templates.',
  metadataBase: new URL('https://invitescraft.live'),
  openGraph: {
    title: 'InviteCraft — Premium Digital Invitations',
    description: 'Create and share stunning, animated digital invitations for weddings, birthdays, and festivals.',
    siteName: 'InviteCraft',
    url: 'https://invitescraft.live',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} ${devanagari.variable} ${nastaliq.variable} ${greatVibes.variable} ${alexBrush.variable} ${cormorantGaramond.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" style={{ fontWeight: 400 }}>
        {children}
      </body>
    </html>
  );
}
