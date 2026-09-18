"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
} from "react";
import { useShop } from "@/lib/store";
import { MiniCart } from "./MiniCart";

/* =========================================================
   MAKEUP MENU
   ========================================================= */

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

/* =========================================================
   SKINCARE MENU
   ========================================================= */

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

/* =========================================================
   HEADER
   ========================================================= */

export function SiteHeader() {
  const router = useRouter();

  const {
    cart,
    setCartOpen,
    products,
  } = useShop();

  /* =========================================================
     MOBILE STATES
     ========================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mobileMakeupOpen, setMobileMakeupOpen] =
    useState(false);

  const [mobileSkincareOpen, setMobileSkincareOpen] =
    useState(false);

  const [mobileMakeupSections, setMobileMakeupSections] =
    useState<Record<string, boolean>>({});

  const [
    mobileSkincareSections,
    setMobileSkincareSections,
  ] = useState<Record<string, boolean>>({});

  /* =========================================================
     SEARCH STATES
     ========================================================= */

  const [searchQuery, setSearchQuery] =
    useState("");

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const searchRef =
    useRef<HTMLDivElement>(null);

  /* =========================================================
     CART
     ========================================================= */

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* =========================================================
     SEARCH RESULTS
     ========================================================= */

  const searchResults =
    searchQuery.trim().length > 0
      ? products
          .filter((product) => {
            if (!product.isPublished) {
              return false;
            }

            const query =
              searchQuery
                .trim()
                .toLowerCase();

            return (
              product.name
                .toLowerCase()
                .includes(query) ||
              product.shortDescription
                .toLowerCase()
                .includes(query) ||
              product.category
                .toLowerCase()
                .includes(query) ||
             product.subcategory
  ?.toLowerCase()
  .includes(query)
            );
          })
          .slice(0, 6)
      : [];

  /* =========================================================
     CLOSE SEARCH WHEN CLICKING OUTSIDE
     ========================================================= */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU
     ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =========================================================
     TOGGLE MAKEUP SECTION
     ========================================================= */

  const toggleMakeupSection = (
    section: string
  ) => {
    setMobileMakeupSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /* =========================================================
     TOGGLE SKINCARE SECTION
     ========================================================= */

  const toggleSkincareSection = (
    section: string
  ) => {
    setMobileSkincareSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /* =========================================================
     SEARCH SUBMIT
     ========================================================= */

  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const query =
      searchQuery.trim();

    setShowSearchResults(false);

    if (!query) {
      router.push("/shop");
      return;
    }

    router.push(
      `/shop?search=${encodeURIComponent(
        query
      )}`
    );
  };

  /* =========================================================
     SEARCH CHANGE
     ========================================================= */

  const handleSearchChange = (
    value: string
  ) => {
    setSearchQuery(value);
    setShowSearchResults(
      value.trim().length > 0
    );
  };

  /* =========================================================
     CLICK PRODUCT FROM SEARCH
     ========================================================= */

  const handleProductClick = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* =====================================================
          ANNOUNCEMENT BAR
          ===================================================== */}

      <div className="bg-wine-deep text-cream text-[11px] uppercase tracking-eyebrow h-[32px] flex items-center overflow-hidden border-b border-wine">

        <div className="w-full flex whitespace-nowrap">

          <div className="inline-block animate-marquee pl-[100%] pr-[20px]">
            ⚡ CASH ON DELIVERY AVAILABLE ALL OVER PAKISTAN •
            FREE SHIPPING FOR ORDERS OVER RS. 2,500 •
            ORDER ON WHATSAPP: 03254715421 ⚡
          </div>

          <div className="inline-block animate-marquee pr-[20px]">
            ⚡ CASH ON DELIVERY AVAILABLE ALL OVER PAKISTAN •
            FREE SHIPPING FOR ORDERS OVER RS. 2,500 •
            ORDER ON WHATSAPP: 03254715421 ⚡
          </div>

        </div>

      </div>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-line">

        {/* ===================================================
            MAIN HEADER
            =================================================== */}

        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-[72px] flex items-center justify-between">

          {/* =================================================
              LOGO
              ================================================= */}

          <Link
            href="/"
            className="flex items-center shrink-0"
          >
            <img
              src="/logo.png"
              alt="Glam Glim"
              className="w-[70px] sm:w-[90px] mt-2 h-auto object-contain"
            />
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <nav className="hidden md:flex items-center gap-7 text-[12px] tracking-eyebrow uppercase font-medium text-charcoal-soft">

            {/* Shop All */}

            <Link
              href="/shop"
              className="hover:text-wine transition-colors"
            >
              Shop All
            </Link>

            {/* =================================================
                MAKEUP
                ================================================= */}

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

                  {Object.entries(
                    makeupMenu
                  ).map(
                    ([section, items]) => {

                      const sectionSlug =
                        section.toLowerCase();

                      return (
                        <div
                          key={section}
                        >

                          {/* SECTION */}

                          <Link
                            href={`/shop?category=makeup&section=${sectionSlug}`}
                            className="block text-[11px] tracking-[0.18em] font-bold text-wine mb-4 hover:text-wine-deep transition-colors"
                          >
                            {section}
                          </Link>

                          {/* PRODUCTS */}

                          <div className="flex flex-col gap-2.5 normal-case tracking-normal text-[13px]">

                            {items.map(
                              ([
                                label,
                                slug,
                              ]) => (
                                <Link
                                  key={slug}
                                  href={`/shop?category=makeup&subcategory=${slug}`}
                                  className="text-charcoal-soft hover:text-wine transition-colors"
                                >
                                  {label}
                                </Link>
                              )
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* Bottom */}

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

            {/* =================================================
                SKINCARE
                ================================================= */}

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

                  {Object.entries(
                    skincareMenu
                  ).map(
                    ([section, items]) => {

                      const sectionSlug =
                        section
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          );

                      return (
                        <div
                          key={section}
                        >

                          <Link
                            href={`/shop?category=skincare&section=${sectionSlug}`}
                            className="block text-[11px] tracking-[0.18em] font-bold text-wine mb-4 hover:text-wine-deep transition-colors"
                          >
                            {section}
                          </Link>

                          <div className="flex flex-col gap-2.5 normal-case tracking-normal text-[13px]">

                            {items.map(
                              ([
                                label,
                                slug,
                              ]) => (
                                <Link
                                  key={slug}
                                  href={`/shop?category=skincare&subcategory=${slug}`}
                                  className="text-charcoal-soft hover:text-wine transition-colors"
                                >
                                  {label}
                                </Link>
                              )
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

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

          

          </nav>

          {/* =================================================
              RIGHT ACTIONS
              ================================================= */}

          <div className="flex items-center gap-3">

            {/* =================================================
                DESKTOP SEARCH
                ================================================= */}

            <div
              ref={searchRef}
              className="hidden sm:block relative"
            >

              <form
                onSubmit={handleSearch}
                className="flex items-center relative"
              >

                <Search
                  size={15}
                  className="absolute left-3 text-charcoal-soft/60 pointer-events-none"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onFocus={() => {
                    if (
                      searchQuery.trim()
                    ) {
                      setShowSearchResults(
                        true
                      );
                    }
                  }}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value
                    )
                  }
                  className="w-[150px] lg:w-[190px] bg-cream border border-line text-charcoal text-[12px] pl-9 pr-3 py-2 rounded-[2px] focus:outline-none focus:border-wine/50 transition-colors"
                />

              </form>

              {/* =================================================
                  SEARCH DROPDOWN
                  ================================================= */}

              {showSearchResults &&
                searchQuery.trim() && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] lg:w-[360px] bg-cream border border-line shadow-xl rounded-[2px] overflow-hidden z-[100]">

                    {searchResults.length > 0 ? (

                      <div>

                        {/* Results */}

                        <div className="max-h-[380px] overflow-y-auto">

                          {searchResults.map(
                            (product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                onClick={
                                  handleProductClick
                                }
                                className="flex items-center gap-3 px-4 py-3 hover:bg-lilac-soft/30 transition-colors border-b border-line/60 last:border-b-0"
                              >

                                {/* Product Image */}

                                <div className="w-[48px] h-[58px] shrink-0 bg-lilac-soft/20 overflow-hidden rounded-[2px]">

                                  <img
                                    src={
                                      product.image ||
                                      "/lipstick_matte.png"
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="w-full h-full object-cover"
                                  />

                                </div>

                                {/* Product Info */}

                                <div className="min-w-0 flex-1">

                                  <p className="text-[12px] font-medium text-charcoal truncate">
                                    {
                                      product.name
                                    }
                                  </p>

                                  <p className="text-[10px] text-charcoal-soft mt-1 capitalize">
                                    {
                                      product.category
                                    }
                                  </p>

                                  <p className="text-[12px] font-semibold text-wine mt-1">
                                    Rs.{" "}
                                    {product.price.toLocaleString()}
                                  </p>

                                </div>

                              </Link>
                            )
                          )}

                        </div>

                        {/* View All */}

                        <button
                          type="button"
                          onClick={() => {
                            handleSearch(
                              {
                                preventDefault:
                                  () => {},
                              } as React.FormEvent
                            );
                          }}
                          className="w-full border-t border-line px-4 py-3 text-[10px] uppercase tracking-eyebrow font-semibold text-wine hover:bg-lilac-soft/30 transition-colors text-center"
                        >
                          View all results →
                        </button>

                      </div>

                    ) : (

                      /* No Results */

                      <div className="px-5 py-8 text-center">

                        <Search
                          size={20}
                          className="mx-auto text-charcoal-soft/40 mb-3"
                        />

                        <p className="text-[13px] font-medium text-charcoal">
                          No products found
                        </p>

                        <p className="text-[11px] text-charcoal-soft mt-1">
                          Try a different search term.
                        </p>

                      </div>

                    )}

                  </div>
                )}

            </div>

            {/* =================================================
                CART
                ================================================= */}

            <button
              onClick={() =>
                setCartOpen(true)
              }
              aria-label="Cart"
              className="text-charcoal hover:text-wine transition-colors relative p-1.5"
            >

              <ShoppingBag
                size={20}
                strokeWidth={1.5}
              />

              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-magenta text-cream rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
                  {totalItems}
                </span>
              )}

            </button>

            {/* Mobile Menu */}

            <button
              aria-label="Menu"
              className="md:hidden text-charcoal p-1"
              onClick={() =>
                setMobileMenuOpen(
                  (v) => !v
                )
              }
            >
              {mobileMenuOpen ? (
                <X
                  size={22}
                  strokeWidth={1.5}
                />
              ) : (
                <Menu
                  size={22}
                  strokeWidth={1.5}
                />
              )}
            </button>

          </div>

        </div>

        {/* =====================================================
            MOBILE MENU
            ===================================================== */}

        {mobileMenuOpen && (

          <nav className="md:hidden border-t border-line bg-cream shadow-md max-h-[calc(100vh-104px)] overflow-y-auto">

            <div className="px-5 py-5 flex flex-col text-[12px] tracking-eyebrow uppercase font-medium text-charcoal-soft">

              {/* =================================================
                  MOBILE SEARCH
                  ================================================= */}

              <div className="relative mb-4">

                <form
                  onSubmit={handleSearch}
                  className="relative"
                >

                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft/60 pointer-events-none"
                  />

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) =>
                      handleSearchChange(
                        e.target.value
                      )
                    }
                    className="w-full bg-cream border border-line text-charcoal text-[13px] pl-9 pr-4 py-2.5 rounded-[2px] focus:outline-none focus:border-wine/50"
                  />

                </form>

                {/* MOBILE SEARCH RESULTS */}

                {showSearchResults &&
                  searchQuery.trim() && (
                    <div className="mt-2 bg-cream border border-line shadow-lg rounded-[2px] overflow-hidden">

                      {searchResults.length > 0 ? (

                        <div>

                          <div className="max-h-[300px] overflow-y-auto">

                            {searchResults.map(
                              (product) => (
                                <Link
                                  key={product.id}
                                  href={`/product/${product.id}`}
                                  onClick={() => {
                                    handleProductClick();
                                    closeMobileMenu();
                                  }}
                                  className="flex items-center gap-3 px-3 py-3 hover:bg-lilac-soft/30 border-b border-line/60 last:border-b-0"
                                >

                                  <div className="w-[42px] h-[50px] shrink-0 bg-lilac-soft/20 overflow-hidden rounded-[2px]">

                                    <img
                                      src={
                                        product.image ||
                                        "/lipstick_matte.png"
                                      }
                                      alt={
                                        product.name
                                      }
                                      className="w-full h-full object-cover"
                                    />

                                  </div>

                                  <div className="min-w-0 flex-1">

                                    <p className="text-[12px] font-medium text-charcoal truncate">
                                      {
                                        product.name
                                      }
                                    </p>

                                    <p className="text-[11px] text-wine mt-1">
                                      Rs.{" "}
                                      {product.price.toLocaleString()}
                                    </p>

                                  </div>

                                </Link>
                              )
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              handleSearch(
                                {
                                  preventDefault:
                                    () => {},
                                } as React.FormEvent
                              );
                              closeMobileMenu();
                            }}
                            className="w-full border-t border-line px-4 py-3 text-[10px] uppercase tracking-eyebrow font-semibold text-wine"
                          >
                            View all results →
                          </button>

                        </div>

                      ) : (

                        <div className="px-4 py-6 text-center">

                          <p className="text-[13px] font-medium text-charcoal">
                            No products found
                          </p>

                          <p className="text-[11px] text-charcoal-soft mt-1">
                            Try a different search term.
                          </p>

                        </div>

                      )}

                    </div>
                  )}

              </div>

              {/* =================================================
                  SHOP ALL
                  ================================================= */}

              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="hover:text-wine py-3 border-b border-line/60"
              >
                Shop All
              </Link>

              {/* =================================================
                  MOBILE MAKEUP
                  ================================================= */}

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
                      setMobileMakeupOpen(
                        (v) => !v
                      )
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

                    {Object.entries(
                      makeupMenu
                    ).map(
                      ([section, items]) => {

                        const sectionSlug =
                          section.toLowerCase();

                        return (
                          <div
                            key={section}
                            className="mb-1"
                          >

                            <div className="flex items-center justify-between py-2.5 pr-2">

                              <Link
                                href={`/shop?category=makeup&section=${sectionSlug}`}
                                onClick={
                                  closeMobileMenu
                                }
                                className="text-[11px] font-semibold text-wine hover:text-wine-deep"
                              >
                                {section}
                              </Link>

                              <button
                                onClick={() =>
                                  toggleMakeupSection(
                                    section
                                  )
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
                                  ([
                                    label,
                                    slug,
                                  ]) => (
                                    <Link
                                      key={slug}
                                      href={`/shop?category=makeup&subcategory=${slug}`}
                                      onClick={
                                        closeMobileMenu
                                      }
                                      className="normal-case tracking-normal text-[13px] py-2 text-charcoal-soft hover:text-wine"
                                    >
                                      {label}
                                    </Link>
                                  )
                                )}

                              </div>

                            )}

                          </div>
                        );
                      }
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

              {/* =================================================
                  MOBILE SKINCARE
                  ================================================= */}

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
                      setMobileSkincareOpen(
                        (v) => !v
                      )
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

                    {Object.entries(
                      skincareMenu
                    ).map(
                      ([section, items]) => {

                        const sectionSlug =
                          section
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            );

                        return (
                          <div
                            key={section}
                            className="mb-1"
                          >

                            <div className="flex items-center justify-between py-2.5 pr-2">

                              <Link
                                href={`/shop?category=skincare&section=${sectionSlug}`}
                                onClick={
                                  closeMobileMenu
                                }
                                className="text-[11px] font-semibold text-wine hover:text-wine-deep"
                              >
                                {section}
                              </Link>

                              <button
                                onClick={() =>
                                  toggleSkincareSection(
                                    section
                                  )
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
                                  ([
                                    label,
                                    slug,
                                  ]) => (
                                    <Link
                                      key={slug}
                                      href={`/shop?category=skincare&subcategory=${slug}`}
                                      onClick={
                                        closeMobileMenu
                                      }
                                      className="normal-case tracking-normal text-[13px] py-2 text-charcoal-soft hover:text-wine"
                                    >
                                      {label}
                                    </Link>
                                  )
                                )}

                              </div>

                            )}

                          </div>
                        );
                      }
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

              {/* =================================================
                  PERFUMES
                  ================================================= */}

              <Link
                href="/shop?category=perfumes"
                onClick={closeMobileMenu}
                className="hover:text-wine py-3 border-b border-line/60"
              >
                Perfumes
              </Link>

              {/* =================================================
                  HAIR ACCESSORIES
                  ================================================= */}

              <Link
                href="/shop?category=hair_acc"
                onClick={closeMobileMenu}
                className="hover:text-wine py-3 border-b border-line/60"
              >
                Hair Acc
              </Link>

              {/* =================================================
                  ADMIN
                  ================================================= */}

              

            </div>

          </nav>

        )}

      </header>

      {/* =====================================================
          MINI CART
          ===================================================== */}

      <MiniCart />
    </>
  );
}