import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-hairline mt-auto">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                I
              </div>
              <span className="text-lg font-semibold tracking-tight text-ink">
                InviteCraft
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Crafting premium, animated digital invitation cards featuring cultural templates and heritage design tools.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-medium text-ink mb-4">Support</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/browse" className="text-sm text-body-text hover:text-ink transition-colors hover:underline">
                Templates
              </Link>
              <Link href="/#pricing" className="text-sm text-body-text hover:text-ink transition-colors hover:underline">
                Pricing Plans
              </Link>
            </div>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="text-base font-medium text-ink mb-4">Hosting</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/auth/login" className="text-sm text-body-text hover:text-ink transition-colors hover:underline">
                Account Access
              </Link>
              <Link href="/browse" className="text-sm text-body-text hover:text-ink transition-colors hover:underline">
                Browse Collection
              </Link>
            </div>
          </div>

          {/* InviteCraft */}
          <div>
            <h4 className="text-base font-medium text-ink mb-4">InviteCraft</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-sm text-body-text hover:text-ink transition-colors hover:underline">
                About Us
              </Link>
              <Link href="/" className="text-sm text-body-text hover:text-ink transition-colors hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Legal band */}
      <div className="border-t border-hairline-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-xs text-muted-soft">
            &copy; {new Date().getFullYear()} InviteCraft, Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-xs text-muted-soft">
            <span>English (IN)</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
