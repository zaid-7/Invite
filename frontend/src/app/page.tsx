import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Heart, Clock, Music, Calendar, Milestone, ShieldCheck, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center relative z-10">
          <h1
            className="text-4xl md:text-6xl font-bold text-ink leading-tight max-w-3xl"
            style={{ lineHeight: 1.18, letterSpacing: '-0.02em' }}
          >
            Digital Invitations as Grand as Your Traditions
          </h1>

          <p className="text-base md:text-lg text-muted max-w-xl mx-auto mt-6 leading-relaxed" style={{ fontWeight: 400 }}>
            Design stunning, animated Indian wedding cards &amp; religious ceremony layouts. Launch interactive guest invitations in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
            <Link
              href="/browse"
              className="bg-primary text-on-primary font-medium hover:bg-primary-active transition-colors px-8 py-3.5 text-base"
              style={{ borderRadius: 8 }}
            >
              Browse Templates
            </Link>
            <Link
              href="/#pricing"
              className="bg-white text-ink border border-ink font-medium hover:bg-surface-soft transition-colors px-8 py-3.5 text-base"
              style={{ borderRadius: 8 }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Feature showcase */}
      <section className="bg-white" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3" style={{ lineHeight: 1.25 }}>
              Why Choose Mandap?
            </h2>
            <p className="text-base text-muted max-w-md mx-auto" style={{ fontWeight: 400 }}>
              Combining heritage design aesthetics with modern web technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              className="bg-white border border-hairline p-7 shadow-card-hover transition-shadow duration-200"
              style={{ borderRadius: 14 }}
            >
              <div
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5"
              >
                <Sparkles size={22} />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Heritage Design Schema</h3>
              <p className="text-sm text-muted leading-relaxed" style={{ fontWeight: 400 }}>
                Curated layouts incorporating traditional motifs, custom multi-lingual typography, and colors honoring Indian rituals.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="bg-white border border-hairline p-7 shadow-card-hover transition-shadow duration-200"
              style={{ borderRadius: 14 }}
            >
              <div
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5"
              >
                <Clock size={22} />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Transient Preview System</h3>
              <p className="text-sm text-muted leading-relaxed" style={{ fontWeight: 400 }}>
                Test customized content immediately inside a secure virtual sandbox mockup before upgrading to live sharing cards.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="bg-white border border-hairline p-7 shadow-card-hover transition-shadow duration-200"
              style={{ borderRadius: 14 }}
            >
              <div
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5"
              >
                <Calendar size={22} />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Interactive Guest RSVP</h3>
              <p className="text-sm text-muted leading-relaxed" style={{ fontWeight: 400 }}>
                Guests can search timings, trigger Google Maps locations, and record their attendance status in one cohesive flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans catalog */}
      <section id="pricing" className="bg-surface-soft border-t border-hairline" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3" style={{ lineHeight: 1.25 }}>
              Hosting Subscriptions
            </h2>
            <p className="text-base text-muted max-w-md mx-auto" style={{ fontWeight: 400 }}>
              Choose the tier that matches the scale of your celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Basic card */}
            <div
              className="bg-white border border-hairline p-8 flex flex-col relative"
              style={{ borderRadius: 14 }}
            >
              <span className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Basic Package</span>
              <div className="flex items-baseline gap-1.5 mb-6 text-ink">
                <span className="text-3xl font-bold">₹299</span>
                <span className="text-sm text-muted" style={{ fontWeight: 400 }}>/ single card</span>
              </div>

              <ul className="flex flex-col gap-3 text-sm text-body-text flex-1 mb-8" style={{ fontWeight: 400 }}>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> 6 months active online hosting</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Standard design layout options</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Single dynamic ceremony calendar</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Basic support channels</li>
              </ul>

              <Link
                href="/browse"
                className="w-full text-center bg-white text-ink border border-ink font-medium hover:bg-surface-soft transition-colors py-3 text-sm"
                style={{ borderRadius: 8 }}
              >
                Choose Basic
              </Link>
            </div>

            {/* Premium card */}
            <div
              className="bg-white border-2 border-ink p-8 flex flex-col relative"
              style={{ borderRadius: 14, transform: 'translateY(-4px)' }}
            >
              <span
                className="absolute bg-primary text-on-primary text-xs font-semibold uppercase px-4 py-1.5 tracking-wider"
                style={{ borderRadius: 9999, top: -12, left: '50%', transform: 'translateX(-50%)' }}
              >
                Most Popular
              </span>

              <span className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Premium Royal</span>
              <div className="flex items-baseline gap-1.5 mb-6 text-ink">
                <span className="text-4xl font-bold">₹499</span>
                <span className="text-sm text-muted" style={{ fontWeight: 400 }}>/ single card</span>
              </div>

              <ul className="flex flex-col gap-3 text-sm text-body-text flex-1 mb-8" style={{ fontWeight: 400 }}>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> 1 year active online hosting</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Full customizable royal designs</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Unlimited digital event timeline cards</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Background music tracks enabled</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Interactive guest RSVP portal</li>
              </ul>

              <Link
                href="/browse"
                className="w-full text-center bg-primary text-on-primary font-medium hover:bg-primary-active transition-colors py-3 text-sm"
                style={{ borderRadius: 8 }}
              >
                Choose Premium
              </Link>
            </div>

            {/* Deluxe card */}
            <div
              className="bg-white border border-hairline p-8 flex flex-col relative"
              style={{ borderRadius: 14 }}
            >
              <span className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Deluxe Palace</span>
              <div className="flex items-baseline gap-1.5 mb-6 text-ink">
                <span className="text-3xl font-bold">₹999</span>
                <span className="text-sm text-muted" style={{ fontWeight: 400 }}>/ single card</span>
              </div>

              <ul className="flex flex-col gap-3 text-sm text-body-text flex-1 mb-8" style={{ fontWeight: 400 }}>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> 2 years active online hosting</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Premium design + customization support</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Custom sound file uploading</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> RSVP management analytics exports</li>
                <li className="flex items-center gap-2.5"><Check size={16} className="text-primary shrink-0" /> Priority account representatives</li>
              </ul>

              <Link
                href="/browse"
                className="w-full text-center bg-white text-ink border border-ink font-medium hover:bg-surface-soft transition-colors py-3 text-sm"
                style={{ borderRadius: 8 }}
              >
                Choose Deluxe
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
