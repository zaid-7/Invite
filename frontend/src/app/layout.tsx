import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Sans_Devanagari, Noto_Nastaliq_Urdu, Great_Vibes, Alex_Brush, Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const devanagari = Noto_Sans_Devanagari({
  variable: '--font-devanagari',
  subsets: ['devanagari'],
  weight: ['400', '700'],
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: '--font-nastaliq',
  subsets: ['arabic'],
  weight: ['400', '700'],
});

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ['latin'],
  weight: ['400'],
});

const alexBrush = Alex_Brush({
  variable: '--font-alex-brush',
  subsets: ['latin'],
  weight: ['400'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Mandap — Premium Digital Invitations',
  description: 'Create and share stunning, animated digital invitations for weddings, birthdays, and festivals with authentic Indian heritage templates.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Mandap — Premium Digital Invitations',
    description: 'Create and share stunning, animated digital invitations for weddings, birthdays, and festivals.',
    siteName: 'Mandap',
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
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
