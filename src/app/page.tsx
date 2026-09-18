"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Sparkles, Send, CheckCircle2, X, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArchMotif, SparkleStar } from "@/components/ArchMotif";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/store";

/* ---------------------------------------------------------
   HERO CAROUSEL DATA
   Swap the `image` paths for your real banner assets.
--------------------------------------------------------- */
const carouselSlides = [
  {
    id: "catalog",
    label: "All Products",
    eyebrow: "Shop All",
    discount: "70%",
    title: "The Full Catalog",
    subtitle: "Makeup, skincare, and perfumes — all in one place.",
    image: "/fourthbanner.jpg",
    href: "/shop",
    badgeFrom: "from-wine",
    badgeTo: "to-wine-deep",
  },
  {
    id: "makeup",
    label: "Makeup",
    eyebrow: "Flash Sale",
    discount: "60%",
    title: "Makeup Blowout",
    subtitle: "Matte lipsticks, velvet glows, and dewy foundations.",
    image: "/thirdbanner.webp",
    href: "/shop?category=makeup",
    badgeFrom: "from-magenta",
    badgeTo: "to-wine",
  },
  {
    id: "perfumes",
    label: "Perfumes",
    eyebrow: "Biggest Sale",
    discount: "70%",
    title: "Fine Perfumes, Slashed",
    subtitle: "Damask rose, woody ambers, and clean floral extracts.",
    image: "/perfume1.jpg",
    href: "/shop?category=perfumes",
    badgeFrom: "from-wine-deep",
    badgeTo: "to-magenta",
  },
  {
    id: "skincare",
    label: "Skincare",
    eyebrow: "Today Only",
    discount: "50%",
    title: "Skincare Steal Deals",
    subtitle: "Serums and moisturizers formulated for everyday glow.",
    image: "/skincare.webp",
    href: "/shop?category=skincare",
    badgeFrom: "from-wine",
    badgeTo: "to-magenta",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + carouselSlides.length) % carouselSlides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[360px] sm:h-[460px] lg:h-[520px] overflow-hidden bg-charcoal">
      {carouselSlides.map((slide, index) => (
        <Link
          key={slide.id}
          href={slide.href}
          aria-label={`Shop ${slide.label}`}
          className={`group absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.label}
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/15" />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.badgeFrom} ${slide.badgeTo} opacity-20 mix-blend-overlay`} />

          {/* Big discount burst badge */}
          <div
            className={`absolute top-6 left-6 sm:top-8 sm:left-8 z-20 w-[84px] h-[84px] sm:w-[104px] sm:h-[104px] rounded-full bg-gradient-to-br ${slide.badgeFrom} ${slide.badgeTo} border-4 border-cream/90 shadow-xl flex flex-col items-center justify-center text-cream -rotate-6`}
          >
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wide font-semibold leading-none">Up to</span>
            <span className="font-display text-[26px] sm:text-[32px] leading-none mt-0.5">{slide.discount}</span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wide font-semibold leading-none mt-0.5">Off</span>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-eyebrow font-bold text-cream bg-magenta/90 px-3.5 py-1.5 rounded-full mb-4 shadow-md animate-pulse">
              <Sparkles size={11} />
              {slide.eyebrow}
            </span>
            <h2 className="font-display text-[34px] sm:text-[48px] lg:text-[58px] text-cream leading-tight max-w-2xl drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-[13px] sm:text-[15px] text-cream/90 mt-3 max-w-md">
              {slide.subtitle}
            </p>
            <span className="inline-flex items-center gap-2 mt-7 bg-cream text-wine-deep px-7 py-3.5 text-[13px] uppercase tracking-eyebrow font-bold hover:bg-lilac-soft transition-colors shadow-lg">
              Shop Now
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        </Link>
      ))}

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          prev();
        }}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-cream/80 hover:bg-cream text-charcoal flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          next();
        }}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-cream/80 hover:bg-cream text-charcoal flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators — centered */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {carouselSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              goTo(index);
            }}
            aria-label={`Go to ${slide.label} slide`}
            className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream ${
              index === current ? "w-7 bg-cream" : "w-2.5 bg-cream/50 hover:bg-cream/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { products } = useShop();
  const [teaserEmail, setTeaserEmail] = useState("");
  const [teaserSubscribed, setTeaserSubscribed] = useState(false);
  const [showTeaserModal, setShowTeaserModal] = useState(false);

  // Get active products (exclude Hair Accessories for main storefront or show them as preview)
  const activeProducts = products.filter((p) => p.isPublished).slice(0, 4);

  const handleTeaserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teaserEmail.trim()) {
      setTeaserSubscribed(true);
      setTimeout(() => {
        setTeaserEmail("");
      }, 2000);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 overflow-x-hidden">
        {/* HERO CAROUSEL — Catalog / Makeup / Perfumes / Skincare */}
        <HeroCarousel />

        {/* TRENDING PRODUCTS GRID — front and center, right after the carousel */}
        <section className="bg-lilac-soft/40 py-12 sm:py-14 border-y border-line">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            {/* <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-7 gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-eyebrow text-magenta font-semibold mb-1.5">
                  Best of Glam Glim
                </p>
                <h2 className="font-display text-[28px] sm:text-[34px] text-charcoal leading-tight">
                  Everyone's talking about these
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-eyebrow font-semibold text-wine hover:text-wine-deep border-b border-wine pb-0.5 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
              >
                View full range
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div> */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-7 gap-3">
  <div>
    <p className="text-[12px] uppercase tracking-eyebrow text-magenta font-semibold mb-1.5">
      Best of Glam Glim
    </p>
    <h2 className="font-display text-[28px] sm:text-[34px] text-charcoal leading-tight">
      Everyone's talking about these
    </h2>
  </div>
  {/* Only show here on sm+ screens */}
  <Link
    href="/shop"
    className="hidden sm:inline-flex items-center gap-1.5 text-[13px] uppercase tracking-eyebrow font-semibold text-wine hover:text-wine-deep border-b border-wine pb-0.5 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
  >
    View full range
    <ArrowRight size={12} strokeWidth={2} />
  </Link>
</div>

{activeProducts.length === 0 ? (
  <p className="text-charcoal-soft/60 py-10 text-center text-[14px]">No active products currently. Please configure them in the Admin portal.</p>
) : (
  <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
      {activeProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    {/* Mobile-only, shown after the grid */}
    <div className="flex sm:hidden justify-center mt-7">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-[13px] uppercase tracking-eyebrow font-semibold text-wine hover:text-wine-deep border-b border-wine pb-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
      >
        View full range
        <ArrowRight size={12} strokeWidth={2} />
      </Link>
    </div>
  </>
)}

            {/* {activeProducts.length === 0 ? (
              <p className="text-charcoal-soft/60 py-10 text-center text-[14px]">No active products currently. Please configure them in the Admin portal.</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                {activeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )} */}
          </div>
        </section>

       

        {/* CATEGORY EXPLORER */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-18 text-center">
          <p className="text-[12px] uppercase tracking-eyebrow text-magenta mb-2 font-semibold">
            Tailored beauty
          </p>
          <h2 className="font-display text-[28px] sm:text-[36px] text-charcoal mb-8 max-w-lg mx-auto">
            Discover our curated, high-end ranges
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Category 1: Makeup */}
            <div className="group relative overflow-hidden bg-lilac-soft rounded-[2px] aspect-[4/5] border border-line/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-end p-6 text-left">
              <img
                src="/lipstick_matte.png"
                alt="Makeup range"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[10px] uppercase tracking-eyebrow bg-cream/90 text-wine px-2 py-0.5 font-semibold">Active Collection</span>
                <h3 className="font-display text-[24px] text-cream">Makeup Range</h3>
                <p className="text-[13px] text-cream/80 max-w-xs">Matte lipsticks, velvet glows, and dewy foundations.</p>
                <Link
                  href="/shop?category=makeup"
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-eyebrow font-semibold text-cream group-hover:text-magenta pt-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                >
                  Explore Makeup <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Category 2: Perfumes */}
            <div className="group relative overflow-hidden bg-lilac-soft rounded-[2px] aspect-[4/5] border border-line/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-end p-6 text-left">
              <img
                src="/perfume_rose.png"
                alt="Perfumes range"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[10px] uppercase tracking-eyebrow bg-cream/90 text-wine px-2 py-0.5 font-semibold">Luxury Scents</span>
                <h3 className="font-display text-[24px] text-cream">Fine Perfumes</h3>
                <p className="text-[13px] text-cream/80 max-w-xs">Damask rose, woody ambers, and clean floral extracts.</p>
                <Link
                  href="/shop?category=perfumes"
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-eyebrow font-semibold text-cream group-hover:text-magenta pt-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                >
                  Discover Scents <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Category 3: Hair Accessories (TEASER) */}
            <div className="group relative overflow-hidden bg-cream rounded-[2px] aspect-[4/5] border border-line/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-end p-6 text-left">
              <img
                src="/hair_claw_teaser.png"
                alt="Hair accessories range teaser"
                className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/95 via-wine-deep/60 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[10px] uppercase tracking-eyebrow bg-magenta text-cream px-2 py-0.5 font-semibold">Arriving Soon</span>
                <h3 className="font-display text-[24px] text-cream">Hair Accessories</h3>
                <p className="text-[13px] text-cream/80 max-w-xs">Premium claw clips, silk scrunchies, and elegant hair pins.</p>
                <button
                  onClick={() => setShowTeaserModal(true)}
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-eyebrow font-semibold text-magenta group-hover:text-cream pt-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                >
                  Join Waitlist <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* EDITORIAL STORY BLOCK */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-18 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative aspect-[4/3] w-full bg-lilac-soft rounded-[2px] overflow-hidden border border-line/60 shadow-lg">
              <img
                src="/perfume_rose.png"
                alt="Formulating process and product elegance"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-wine/5 mix-blend-overlay" />
            </div>
            {/* Offset border accent */}
            <div className="absolute -bottom-3 -left-3 w-full h-full border border-wine/25 -z-10 rounded-[2px]" />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <p className="text-[12px] uppercase tracking-eyebrow text-magenta font-semibold">
              The Radical Cost Shift
            </p>
            <h2 className="font-display text-[28px] sm:text-[34px] text-charcoal leading-tight">
              We decided to bypass the inflated pricing structures.
            </h2>
            <p className="text-[14px] sm:text-[15px] text-charcoal-soft leading-relaxed">
              Typically, a high-end lipstick costing Rs. 200 to formulate is sold in shops for Rs. 4,000+. The markup pays for designer packaging molds, distributor fees, and celebrity endorsements.
            </p>
            <p className="text-[14px] sm:text-[15px] text-charcoal-soft leading-relaxed">
              By keeping packaging minimalist, sourcing raw botanical extracts directly from certified manufacturers, and selling online only, we cut retail markups and deliver the exact same cosmetic luxury at an honest price.
            </p>
            <div className="pt-1">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[13px] uppercase tracking-eyebrow font-semibold text-wine border-b border-wine pb-0.5 hover:text-wine-deep hover:border-wine-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
              >
                Read about our packaging ethics
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="bg-wine text-cream py-14 sm:py-16 relative overflow-hidden">
          <ArchMotif
            className="absolute -bottom-20 left-[-40px] w-[220px] h-[300px] opacity-[0.06] pointer-events-none"
            strokeColor="#FAF7F8"
            strokeWidth={1}
          />
          <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center relative z-10">
            <Quote size={28} className="text-magenta mx-auto mb-5" strokeWidth={1.5} />
            <p className="font-display text-[24px] sm:text-[30px] leading-relaxed text-cream/95 italic max-w-2xl mx-auto">
              I was honestly surprised by the quality! Everything arrived beautifully packaged, and the products exceeded my expectations. I'll definitely be shopping here again.
            </p>
            <div className="mt-6 space-y-0.5">
              <p className="text-[13px] uppercase tracking-eyebrow font-semibold text-magenta">Maham Jamil</p>
              <p className="text-[11px] text-cream/60">Verified Buyer • Islamabad</p>
            </div>
          </div>
        </section>

        {/* HAIR ACCESSORY TEASER MODAL */}
        {showTeaserModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-charcoal/65 backdrop-blur-xs" onClick={() => setShowTeaserModal(false)} />
            <div className="relative bg-cream border border-line p-7 max-w-md w-full rounded-[2px] shadow-2xl z-10 text-center animate-fade-in-up space-y-5">
              <button
                onClick={() => setShowTeaserModal(false)}
                className="absolute top-4 right-4 text-charcoal hover:text-wine transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 bg-lilac-soft rounded-full flex items-center justify-center text-wine mx-auto">
                <Sparkles size={20} />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-[22px] text-charcoal">Hair Accessories Teaser</h3>
                <p className="text-[13px] text-charcoal-soft leading-relaxed">
                  Our hand-polished acetate claw clips and 100% mulberry silk scrunchies are launching soon! Enter your email to receive early access and an exclusive launch discount code.
                </p>
              </div>

              {teaserSubscribed ? (
                <div className="flex flex-col items-center justify-center py-2 text-wine gap-1.5">
                  <CheckCircle2 size={24} />
                  <p className="text-[13px] font-semibold">You're on the list! Thank you.</p>
                </div>
              ) : (
                <form onSubmit={handleTeaserSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={teaserEmail}
                    onChange={(e) => setTeaserEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-lilac-soft/40 border border-line px-4 py-2 text-[13px] text-charcoal focus:outline-hidden focus:border-wine/50 rounded-[2px]"
                  />
                  <button
                    type="submit"
                    className="bg-wine hover:bg-wine-deep text-cream px-4 py-2 text-[12px] uppercase tracking-eyebrow font-medium transition-colors rounded-[2px] flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
                  >
                    <Send size={12} />
                    Notify
                  </button>
                </form>
              )}

              <p className="text-[10px] text-charcoal-soft/50">Zero spam. Unsubscribe anytime.</p>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}