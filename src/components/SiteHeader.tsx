"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, ShieldAlert, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/lib/store";
import { MiniCart } from "./MiniCart";

const makeupMenu = {
  Face: [
    ["Foundation", "foundation"],
    ["Concealer", "concealer"],
    ["Primer", "primer"],
    ["BB & CC Cream", "bb-cc-cream"],
    ["Powder", "powder"],
    ["Blush", "blush"],
    ["Bronzer", "bronzer"],
    ["Contour", "contour"],
    ["Highlighter", "highlighter"],
    ["Setting Spray", "setting-spray"],
  ],

  Eyes: [
    ["Eyeshadow", "eyeshadow"],
    ["Eyeliner", "eyeliner"],
    ["Mascara", "mascara"],
    ["Eyebrow", "eyebrow"],
    ["False Lashes", "false-lashes"],
    ["Eye Pencil", "eye-pencil"],
  ],

  Lips: [
    ["Lipstick", "lipstick"],
    ["Lip Gloss", "lip-gloss"],
    ["Lip Liner", "lip-liner"],
    ["Lip Tint", "lip-tint"],
    ["Lip Balm", "lip-balm"],
    ["Lip Oil", "lip-oil"],
  ],

  Nails: [
    ["Nail Polish", "nail-polish"],
    ["Nail Tools", "nail-tools"],
  ],

  Tools: [
    ["Makeup Brushes", "brushes"],
    ["Beauty Sponges", "sponges"],
    ["Makeup Bags", "makeup-bags"],
  ],
};

const skincareMenu = {
  Cleansing: [
    ["Face Wash", "face-wash"],
    ["Cleanser", "cleanser"],
    ["Makeup Remover", "makeup-remover"],
    ["Toner", "toner"],
  ],

  Moisturizing: [
    ["Moisturizers", "moisturizer"],
    ["Face Cream", "face-cream"],
    ["Day Cream", "day-cream"],
    ["Night Cream", "night-cream"],
  ],

  Treatments: [
    ["Serums", "serum"],
    ["Face Oils", "face-oil"],
    ["Eye Care", "eye-care"],
  ],

  Exfoliation: [
    ["Face Scrubs", "face-scrub"],
    ["Lip Scrubs", "lip-scrub"],
    ["Exfoliators", "exfoliator"],
  ],

  Masks: [
    ["Face Masks", "face-mask"],
    ["Sheet Masks", "sheet-mask"],
    ["Eye Masks", "eye-mask"],
  ],

  "Sun Care": [
    ["Sunscreen", "sunscreen"],
    ["SPF Moisturizer", "spf-moisturizer"],
  ],
};

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMakeupOpen, setMobileMakeupOpen] = useState(false);
  const [mobileSkincareOpen, setMobileSkincareOpen] = useState(false);
  const [mobileMakeupSections, setMobileMakeupSections] = useState<
    Record<string, boolean>
  >({});
  const [mobileSkincareSections, setMobileSkincareSections] = useState<
    Record<string, boolean>
  >({});

  const { cart, setCartOpen } = useShop();

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMakeupSection = (section: string) => {
    setMobileMakeupSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSkincareSection = (section: string) => {
    setMobileSkincareSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-wine-deep text-cream text-[11px] uppercase tracking-eyebrow h-[32px] flex items-center overflow-hidden border-b border-wine">
        <div className="w-full flex whitespace-nowrap">
          <div className="inline-block animate-marquee pl-[100%] pr-[20px]">
            ⚡ CASH ON DELIVERY AVAILABLE ALL OVER PAKISTAN • FREE SHIPPING FOR
            ORDERS OVER RS. 2,500 • ORDER ON WHATSAPP: 0300-1234567 ⚡
          </div>

          <div className="inline-block animate-marquee pr-[20px]">
            ⚡ CASH ON DELIVERY AVAILABLE ALL OVER PAKISTAN • FREE SHIPPING FOR
            ORDERS OVER RS. 2,500 • ORDER ON WHATSAPP: 0300-1234567 ⚡
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-line">
        {/* Main Header */}
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="Glam Glim"
              className="w-[70px] sm:w-[90px] mt-2 h-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-[12px] tracking-eyebrow uppercase font-medium text-charcoal-soft">

            {/* Shop All */}
            <Link
              href="/shop"
              className="hover:text-wine transition-colors"
            >
              Shop All
            </Link>

            {/* ================= MAKEUP ================= */}
            <div className="group relative h-[72px] flex items-center">
              <Link
                href="/shop?category=makeup"
                className="flex items-center gap-1 hover:text-wine transition-colors"
              >
                Makeup
                <ChevronDown
                  size={12}
                  className="transition-transform group-hover:rotate-180"
                />
              </Link>

              {/* Makeup Mega Menu */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 w-[780px] bg-cream border border-line shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                <div className="p-7 grid grid-cols-5 gap-7">

                  {Object.entries(makeupMenu).map(
                    ([section, items]) => (
                      <div key={section}>
                        <h3 className="text-[11px] tracking-[0.18em] font-bold text-wine mb-4">
                          {section}
                        </h3>

                        <div className="flex flex-col gap-2.5 normal-case tracking-normal text-[13px]">
                          {items.map(([label, slug]) => (
                            <Link
                              key={slug}
                              href={`/shop?category=makeup&subcategory=${slug}`}
                              className="text-charcoal-soft hover:text-wine transition-colors"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                </div>

                {/* Bottom Link */}
                <div className="border-t border-line px-7 py-4">
                  <Link
                    href="/shop?category=makeup"
                    className="text-[11px] tracking-eyebrow uppercase font-semibold text-wine hover:text-wine-deep"
                  >
                    Shop All Makeup →
                  </Link>
                </div>
              </div>
            </div>

            {/* ================= SKINCARE ================= */}
            <div className="group relative h-[72px] flex items-center">
              <Link
                href="/shop?category=skincare"
                className="flex items-center gap-1 hover:text-wine transition-colors"
              >
                Skincare
                <ChevronDown
                  size={12}
                  className="transition-transform group-hover:rotate-180"
                />
              </Link>

              {/* Skincare Mega Menu */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 w-[780px] bg-cream border border-line shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                <div className="p-7 grid grid-cols-3 gap-x-10 gap-y-8">

                  {Object.entries(skincareMenu).map(
                    ([section, items]) => (
                      <div key={section}>
                        <h3 className="text-[11px] tracking-[0.18em] font-bold text-wine mb-4">
                          {section}
                        </h3>

                        <div className="flex flex-col gap-2.5 normal-case tracking-normal text-[13px]">
                          {items.map(([label, slug]) => (
                            <Link
                              key={slug}
                              href={`/shop?category=skincare&subcategory=${slug}`}
                              className="text-charcoal-soft hover:text-wine transition-colors"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                </div>

                {/* Bottom Link */}
                <div className="border-t border-line px-7 py-4">
                  <Link
                    href="/shop?category=skincare"
                    className="text-[11px] tracking-eyebrow uppercase font-semibold text-wine hover:text-wine-deep"
                  >
                    Shop All Skincare →
                  </Link>
                </div>
              </div>
            </div>

            {/* Perfumes */}
            <Link
              href="/shop?category=perfumes"
              className="hover:text-wine transition-colors"
            >
              Perfumes
            </Link>

            {/* Hair Accessories */}
            <Link
              href="/shop?category=hair_acc"
              className="hover:text-wine transition-colors"
            >
              Hair Acc
            </Link>

            {/* Admin */}
            <Link
              href="/admin"
              className="text-magenta hover:text-wine-deep transition-colors flex items-center gap-1 font-semibold border border-magenta/20 px-2 py-0.5 rounded-sm bg-magenta/5"
            >
              <ShieldAlert size={12} />
              Admin Portal
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="text-charcoal hover:text-wine transition-colors relative p-1.5"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />

              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-magenta text-cream rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              aria-label="Menu"
              className="md:hidden text-charcoal p-1"
              onClick={() =>
                setMobileMenuOpen((v) => !v)
              }
            >
              {mobileMenuOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-line bg-cream shadow-md max-h-[calc(100vh-104px)] overflow-y-auto">

            <div className="px-5 py-5 flex flex-col text-[12px] tracking-eyebrow uppercase font-medium text-charcoal-soft">

              {/* Shop All */}
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="hover:text-wine py-3 border-b border-line/60"
              >
                Shop All
              </Link>

              {/* ================= MOBILE MAKEUP ================= */}
              <div className="border-b border-line/60">

                <div className="flex items-center justify-between py-3">

                  <Link
                    href="/shop?category=makeup"
                    onClick={closeMobileMenu}
                    className="hover:text-wine"
                  >
                    Makeup
                  </Link>

                  <button
                    onClick={() =>
                      setMobileMakeupOpen((v) => !v)
                    }
                    className="p-1"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        mobileMakeupOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                {mobileMakeupOpen && (
                  <div className="pb-3 pl-3">

                    {Object.entries(makeupMenu).map(
                      ([section, items]) => (
                        <div key={section} className="mb-1">

                          <div className="flex items-center justify-between py-2.5 pr-2">

                            <span className="text-[11px] font-semibold text-wine">
                              {section}
                            </span>

                            <button
                              onClick={() =>
                                toggleMakeupSection(section)
                              }
                              className="p-1"
                            >
                              <ChevronDown
                                size={14}
                                className={`transition-transform ${
                                  mobileMakeupSections[
                                    section
                                  ]
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>

                          {mobileMakeupSections[
                            section
                          ] && (
                            <div className="pl-3 pb-2 flex flex-col">

                              {items.map(
                                ([label, slug]) => (
                                  <Link
                                    key={slug}
                                    href={`/shop?category=makeup&subcategory=${slug}`}
                                    onClick={closeMobileMenu}
                                    className="normal-case tracking-normal text-[13px] py-2 text-charcoal-soft hover:text-wine"
                                  >
                                    {label}
                                  </Link>
                                )
                              )}

                            </div>
                          )}
                        </div>
                      )
                    )}

                    <Link
                      href="/shop?category=makeup"
                      onClick={closeMobileMenu}
                      className="block text-[10px] tracking-eyebrow font-semibold text-wine py-3"
                    >
                      SHOP ALL MAKEUP →
                    </Link>
                  </div>
                )}
              </div>

              {/* ================= MOBILE SKINCARE ================= */}
              <div className="border-b border-line/60">

                <div className="flex items-center justify-between py-3">

                  <Link
                    href="/shop?category=skincare"
                    onClick={closeMobileMenu}
                    className="hover:text-wine"
                  >
                    Skincare
                  </Link>

                  <button
                    onClick={() =>
                      setMobileSkincareOpen((v) => !v)
                    }
                    className="p-1"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        mobileSkincareOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                {mobileSkincareOpen && (
                  <div className="pb-3 pl-3">

                    {Object.entries(skincareMenu).map(
                      ([section, items]) => (
                        <div key={section} className="mb-1">

                          <div className="flex items-center justify-between py-2.5 pr-2">

                            <span className="text-[11px] font-semibold text-wine">
                              {section}
                            </span>

                            <button
                              onClick={() =>
                                toggleSkincareSection(section)
                              }
                              className="p-1"
                            >
                              <ChevronDown
                                size={14}
                                className={`transition-transform ${
                                  mobileSkincareSections[
                                    section
                                  ]
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>

                          {mobileSkincareSections[
                            section
                          ] && (
                            <div className="pl-3 pb-2 flex flex-col">

                              {items.map(
                                ([label, slug]) => (
                                  <Link
                                    key={slug}
                                    href={`/shop?category=skincare&subcategory=${slug}`}
                                    onClick={closeMobileMenu}
                                    className="normal-case tracking-normal text-[13px] py-2 text-charcoal-soft hover:text-wine"
                                  >
                                    {label}
                                  </Link>
                                )
                              )}

                            </div>
                          )}
                        </div>
                      )
                    )}

                    <Link
                      href="/shop?category=skincare"
                      onClick={closeMobileMenu}
                      className="block text-[10px] tracking-eyebrow font-semibold text-wine py-3"
                    >
                      SHOP ALL SKINCARE →
                    </Link>
                  </div>
                )}
              </div>

              {/* Perfumes */}
              <Link
                href="/shop?category=perfumes"
                onClick={closeMobileMenu}
                className="hover:text-wine py-3 border-b border-line/60"
              >
                Perfumes
              </Link>

              {/* Hair Accessories */}
              <Link
                href="/shop?category=hair_acc"
                onClick={closeMobileMenu}
                className="hover:text-wine py-3 border-b border-line/60"
              >
                Hair Acc
              </Link>

              {/* Admin */}
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="text-magenta font-semibold flex items-center gap-1.5 py-4"
              >
                <ShieldAlert size={14} />
                Admin Portal
              </Link>

            </div>
          </nav>
        )}
      </header>

      {/* Mini Cart */}
      <MiniCart />
    </>
  );
}