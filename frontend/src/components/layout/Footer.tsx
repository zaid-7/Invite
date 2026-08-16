import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-maroon-deep text-ivory/80 border-t border-gold-warm/15 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="text-serif text-2xl font-bold tracking-widest text-gold-warm mb-2">
            MANDAP
          </Link>
          <p className="text-xs max-w-xs text-ivory/60 leading-relaxed font-sans">
            Crafting premium, animated digital invitation cards featuring cultural templates and heritage design tools.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold tracking-widest uppercase">
          <Link href="/browse" className="hover:text-gold-warm transition-colors">
            Templates
          </Link>
          <Link href="/#pricing" className="hover:text-gold-warm transition-colors">
            Pricing Plans
          </Link>
          <Link href="/auth/login" className="hover:text-gold-warm transition-colors">
            Account Access
          </Link>
        </div>

        <div className="text-center md:text-right text-[10px] text-ivory/40 font-sans">
          <span>&copy; {new Date().getFullYear()} Mandap Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
