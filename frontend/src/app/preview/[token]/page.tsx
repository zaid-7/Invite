'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Preview } from '@/types/template';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { Eye, ShieldAlert, Link as LinkIcon } from 'lucide-react';

export default function PreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const { token } = use(params);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorPayload, setErrorPayload] = useState<{ message: string; code?: string } | null>(null);

  // Status variables
  const [timeLeft, setTimeLeft] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [maxViews, setMaxViews] = useState(1);

  const [unlockLoading, setUnlockLoading] = useState(false);

  useEffect(() => {
    async function loadPreview() {
      try {
        const res = await api.getPreview(token);
        if (res.status === 'success') {
          setPreview(res.preview);
          setViewCount(res.preview.viewCount);
          setMaxViews(res.preview.maxViews);
          
          // Calculate initial remaining seconds
          const msLeft = new Date(res.preview.expiresAt).getTime() - Date.now();
          setTimeLeft(Math.max(0, Math.floor(msLeft / 1000)));
        } else {
          setErrorPayload({
            message: res.message || 'Verification failed.',
            code: res.code || 'UNKNOWN',
          });
        }
      } catch (err) {
        setErrorPayload({ message: 'Error retrieving preview session.' });
      } finally {
        setLoading(false);
      }
    }
    loadPreview();
  }, [token]);

  // Countdown timer clock
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorPayload({ message: 'Preview session has expired.', code: 'PREVIEW_EXPIRED' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUnlock = async () => {
    if (!preview || unlockLoading) return;
    setUnlockLoading(true);

    try {
      const res = await api.unlockPreview(token);
      if (res.status === 'success' && typeof res.slug === 'string' && res.slug) {
        router.push(`/i/${res.slug}`);
      } else {
        alert(res.message || 'Unable to unlock your invitation.');
      }
    } catch {
      alert('Network error unlocking your invitation. Please try again.');
    } finally {
      setUnlockLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-center items-center">
        <div className="w-10 h-10 border-4 border-gold-warm border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider text-maroon-deep uppercase animate-pulse">Rendering Live Preview...</p>
      </div>
    );
  }

  // Bluer background expired status overlays
  if (errorPayload || !preview) {
    return (
      <div className="min-h-screen flex flex-col bg-maroon-deep text-ivory items-center justify-center p-6 relative">
        {/* Blurred background preview mockup */}
        <div className="absolute inset-0 opacity-15 overflow-hidden filter blur-md select-none pointer-events-none flex items-center justify-center">
          <div className="w-[300px] h-[300px] border border-gold-warm rounded-full animate-spin-slow" />
        </div>

        <div className="z-10 bg-maroon-deep/90 border border-gold-warm/40 p-8 rounded-xl max-w-md text-center shadow-2xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-gold-warm/30 flex items-center justify-center text-gold-warm mb-4 bg-maroon-deep">
            <ShieldAlert size={22} />
          </div>
          <h2 className="text-serif text-2xl font-bold text-gold-warm mb-3">Preview Expired</h2>
          <p className="text-xs text-ivory/80 leading-relaxed max-w-xs mb-6">
            {errorPayload?.message || 'The transient link is no longer active.'}
          </p>

          <div className="flex flex-col gap-2 w-full">
            <Link
              href="/browse"
              className="bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-105 active:scale-95 transition-transform py-2.5 rounded text-xs select-none uppercase tracking-wider"
            >
              Configure New Invitation
            </Link>
            <Link
              href="/"
              className="text-gold-warm/75 hover:text-gold-warm text-[10px] uppercase font-bold py-1.5 transition-colors"
            >
              Back to Home page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col pb-28">
      {/* Dynamic Template rendering container */}
      <TemplateRenderer
        rendererRef={preview.template.rendererRef}
        data={preview.formData}
        mode="preview"
      />

      {/* Sticky Bottom Unlock Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-maroon-deep text-ivory border-t-2 border-gold-warm/30 shadow-2xl py-4 px-6 select-none font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping shrink-0" />
              <span>Expires In: <strong className="text-gold-warm font-mono tracking-wider">{formatTimer(timeLeft)}</strong></span>
            </div>
            <div className="w-[1px] h-5 bg-gold-warm/25" />
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="text-gold-warm" />
              <span>Views: <strong className="text-gold-warm">{viewCount}</strong> / <strong>{maxViews} Max</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-right hidden md:block select-none">
              <span className="text-[10px] uppercase block tracking-wider text-ivory/60">Selected: {preview.template.name}</span>
              <strong className="text-gold-warm text-sm">Publish your shareable invitation</strong>
            </div>

            <button
              onClick={handleUnlock}
              disabled={unlockLoading}
              className="flex-1 md:flex-initial bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-103 active:scale-97 transition-transform py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              {unlockLoading ? 'Creating Your Link...' : 'Unlock Permanently'}
              <LinkIcon size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
