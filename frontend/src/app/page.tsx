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
      <section className="relative bg-maroon-deep text-ivory overflow-hidden py-24 md:py-32 px-6 border-b border-gold-warm/25">
        {/* Animated background motifs */}
        <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] border border-gold-warm/15 rounded-full flex items-center justify-center animate-spin-slow opacity-15 pointer-events-none">
          <div className="w-[300px] h-[300px] border border-dashed border-gold-warm/20 rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-gold-warm mb-4 border border-gold-warm/30 px-3.5 py-1.5 rounded-full">
            Elegance meets Tradition
          </span>
          
          <h1 className="text-serif text-5xl md:text-7xl font-extrabold text-gold-warm leading-tight max-w-4xl tracking-wide drop-shadow-md">
            Digital Invitations as Grand as Your Traditions
          </h1>
          
          <p className="text-sm md:text-base text-ivory/80 max-w-xl mx-auto mt-6 leading-relaxed font-light">
            Design stunning, animated Indian wedding cards &amp; religious ceremony layouts. Launch interactive guest invitations in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
            <Link
              href="/browse"
              className="bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-105 active:scale-95 transition-transform px-8 py-3.5 rounded-lg text-sm select-none shadow-lg tracking-widest uppercase"
            >
              Browse Templates
            </Link>
            <Link
              href="/#pricing"
              className="bg-white/10 border border-gold-warm/30 text-ivory hover:bg-white/15 transition-colors px-8 py-3.5 rounded-lg text-sm font-semibold tracking-widest uppercase"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Feature showcase */}
      <section className="py-20 px-6 max-w-7xl w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-serif text-3xl md:text-4xl font-bold text-maroon-deep mb-3">
            Why Choose Mandap?
          </h2>
          <p className="text-xs md:text-sm text-foreground/75 max-w-md mx-auto">
            Combining heritage design aesthetics with modern web technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-maroon-deep text-ivory border border-gold-warm/25 rounded-xl p-6 shadow-xl relative">
            <div className="absolute top-2 right-2 text-gold-warm text-lg opacity-25">𑁍</div>
            <div className="w-10 h-10 rounded-full border border-gold-warm/30 flex items-center justify-center text-gold-warm mb-4 bg-maroon-deep">
              <Sparkles size={18} />
            </div>
            <h3 className="text-serif text-lg font-bold text-gold-warm mb-2">Heritage Design Schema</h3>
            <p className="text-xs text-ivory/70 leading-relaxed font-sans">
              Curated layouts incorporating traditional motifs, custom multi-lingual typography, and colors honoring Indian rituals.
            </p>
          </div>

          <div className="bg-maroon-deep text-ivory border border-gold-warm/25 rounded-xl p-6 shadow-xl relative">
            <div className="absolute top-2 right-2 text-gold-warm text-lg opacity-25">𑁍</div>
            <div className="w-10 h-10 rounded-full border border-gold-warm/30 flex items-center justify-center text-gold-warm mb-4 bg-maroon-deep">
              <Clock size={18} />
            </div>
            <h3 className="text-serif text-lg font-bold text-gold-warm mb-2">Transient Preview System</h3>
            <p className="text-xs text-ivory/70 leading-relaxed font-sans">
              Test customized content immediately inside a secure virtual sandbox mockup before upgrading to live sharing cards.
            </p>
          </div>

          <div className="bg-maroon-deep text-ivory border border-gold-warm/25 rounded-xl p-6 shadow-xl relative">
            <div className="absolute top-2 right-2 text-gold-warm text-lg opacity-25">𑁍</div>
            <div className="w-10 h-10 rounded-full border border-gold-warm/30 flex items-center justify-center text-gold-warm mb-4 bg-maroon-deep">
              <Calendar size={18} />
            </div>
            <h3 className="text-serif text-lg font-bold text-gold-warm mb-2">Interactive Guest RSVP</h3>
            <p className="text-xs text-ivory/70 leading-relaxed font-sans">
              Guests can search timings, trigger Google Maps locations, and record their attendance status in one cohesive flow.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans catalog */}
      <section id="pricing" className="bg-maroon-deep/5 py-20 px-6 border-t border-b border-gold-warm/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-serif text-3xl md:text-4xl font-bold text-maroon-deep mb-3">
              Hosting Subscriptions
            </h2>
            <p className="text-xs md:text-sm text-foreground/75 max-w-md mx-auto">
              Choose the tier that matches the scale of your celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Basic card */}
            <div className="bg-white border border-gold-warm/20 rounded-xl p-8 flex flex-col shadow-lg relative">
              <span className="text-[10px] text-maroon-deep/60 tracking-wider font-extrabold uppercase mb-2">Basic Package</span>
              <div className="flex items-baseline gap-1.5 mb-6 text-maroon-deep">
                <span className="text-3xl font-extrabold">₹299</span>
                <span className="text-xs text-gray-500 font-semibold">/ single card</span>
              </div>

              <ul className="flex flex-col gap-3 font-sans text-xs text-foreground/85 flex-1 mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> 6 months active online hosting</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> Standard design layout options</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> Single dynamic ceremony calendar</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> Basic support channels</li>
              </ul>

              <Link
                href="/browse"
                className="w-full bg-maroon-deep/10 text-maroon-deep hover:bg-maroon-deep/15 transition-colors font-bold py-2.5 rounded text-xs uppercase tracking-wider text-center"
              >
                Choose Basic
              </Link>
            </div>

            {/* Premium card */}
            <div className="bg-maroon-deep text-ivory border-2 border-gold-warm rounded-xl p-8 flex flex-col shadow-2xl relative translate-y-[-4px]">
              <span className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-gold-warm text-maroon-deep text-[9px] font-extrabold uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
                Most Popular
              </span>

              <span className="text-[10px] text-gold-warm/80 tracking-wider font-extrabold uppercase mb-2">Premium Royal</span>
              <div className="flex items-baseline gap-1.5 mb-6 text-gold-warm">
                <span className="text-4xl font-extrabold">₹499</span>
                <span className="text-xs text-gold-warm/65 font-semibold">/ single card</span>
              </div>

              <ul className="flex flex-col gap-3 font-sans text-xs text-ivory/80 flex-1 mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-gold-warm" /> 1 year active online hosting</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold-warm" /> Full customizable royal designs</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold-warm" /> Unlimited digital event timeline cards</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold-warm" /> Background music tracks enabled</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold-warm" /> Interactive guest RSVP portal</li>
              </ul>

              <Link
                href="/browse"
                className="w-full bg-gold-warm text-maroon-deep hover:bg-gold-warm/95 transition-colors font-bold py-2.5 rounded text-xs uppercase tracking-wider text-center shadow-lg"
              >
                Choose Premium
              </Link>
            </div>

            {/* Deluxe card */}
            <div className="bg-white border border-gold-warm/20 rounded-xl p-8 flex flex-col shadow-lg relative">
              <span className="text-[10px] text-maroon-deep/60 tracking-wider font-extrabold uppercase mb-2">Deluxe Palace</span>
              <div className="flex items-baseline gap-1.5 mb-6 text-maroon-deep">
                <span className="text-3xl font-extrabold">₹999</span>
                <span className="text-xs text-gray-500 font-semibold">/ single card</span>
              </div>

              <ul className="flex flex-col gap-3 font-sans text-xs text-foreground/85 flex-1 mb-8">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> 2 years active online hosting</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> Premium design + customization support</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> Custom sound file uploading</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> RSVP management analytics exports</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-muted" /> Priority account representatives</li>
              </ul>

              <Link
                href="/browse"
                className="w-full bg-maroon-deep/10 text-maroon-deep hover:bg-maroon-deep/15 transition-colors font-bold py-2.5 rounded text-xs uppercase tracking-wider text-center"
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
