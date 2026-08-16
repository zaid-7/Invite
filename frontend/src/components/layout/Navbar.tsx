'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('mandap_token');
    const userRaw = localStorage.getItem('mandap_user');
    if (token && userRaw) {
      setIsLoggedIn(true);
      const user = JSON.parse(userRaw);
      setUserPhone(user.phone || user.email || 'User');
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="w-full px-6 py-4 bg-maroon-deep text-ivory border-b border-gold-warm/20 z-40 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full border border-gold-warm/40 flex items-center justify-center text-gold-warm font-bold text-sm bg-maroon-deep group-hover:border-gold-warm transition-colors">
            M
          </div>
          <span className="text-serif text-2xl font-bold tracking-widest text-gold-warm group-hover:text-gold-warm/95 transition-colors">
            MANDAP
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-semibold tracking-wider uppercase">
          <Link href="/browse" className="hover:text-gold-warm transition-colors text-ivory">
            Browse
          </Link>
          <Link href="/#pricing" className="hover:text-gold-warm transition-colors text-ivory">
            Pricing
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 border-l border-gold-warm/25 pl-4">
              <span className="text-gold-warm/75 text-xs lowercase max-w-[120px] truncate">
                {userPhone}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gold-warm/10 text-gold-warm hover:bg-gold-warm/20 px-3 py-1.5 rounded text-xs border border-gold-warm/30 transition-all font-semibold uppercase tracking-wider"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-105 active:scale-95 transition-transform px-4 py-2 rounded text-xs"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
