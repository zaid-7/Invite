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
    <nav className="w-full bg-white border-b border-hairline z-40 relative" style={{ height: 80 }}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 lg:px-10">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm transition-colors group-hover:bg-primary-active"
          >
            M
          </div>
          <span className="text-xl font-semibold tracking-tight text-ink">
            Mandap
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-base font-semibold">
          <Link href="/browse" className="text-ink hover:text-primary transition-colors">
            Browse
          </Link>
          <Link href="/#pricing" className="text-ink hover:text-primary transition-colors">
            Pricing
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4 border-l border-hairline pl-5">
              <span className="text-muted text-sm max-w-[140px] truncate">
                {userPhone}
              </span>
              <button
                onClick={handleLogout}
                className="text-ink hover:text-primary text-sm font-medium transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-primary text-on-primary font-medium hover:bg-primary-active transition-colors px-5 py-2.5 text-sm"
              style={{ borderRadius: 8 }}
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
