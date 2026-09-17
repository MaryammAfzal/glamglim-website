"use client";


import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/store";


export default function ShopClient() {
  const { products } = useShop();
  const searchParams = useSearchParams();

  // State
const [selectedCategory, setSelectedCategory] = useState<string>("all");
const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Sync category filter with URL query param
 // Sync category and subcategory filters with URL query params
useEffect(() => {
  const cat = searchParams.get("category");
  const subcat = searchParams.get("subcategory");

  if (cat) {
    setSelectedCategory(cat);
  } else {
    setSelectedCategory("all");
  }

  setSelectedSubcategory(subcat || "");
}, [searchParams]);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setTimeout(() => {
        setEmailInput("");
      }, 2500);
    }
  };

  // Filter & Sort products
  const filteredProducts = products.filter((product) => {
  // Category filter
  const matchesCategory =
    selectedCategory === "all" ||
    product.category === selectedCategory;

  // Subcategory filter
  const matchesSubcategory =
    !selectedSubcategory ||
    product.subcategory === selectedSubcategory;

  // Search query filter
  const matchesSearch =
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

  // Only show published items, unless category is hair_acc
  const isActive = product.isPublished;

  return (
    matchesCategory &&
    matchesSubcategory &&
    matchesSearch &&
    (isActive || product.category === "hair_acc")
  );
});

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    // "featured" default (just by ID or badge)
    return parseInt(a.id) - parseInt(b.id);
  });

  const handleResetFilters = () => {
    setSelectedCategory("all");
      setSelectedSubcategory("");

    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream min-h-screen py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <h1 className="font-display text-[36px] sm:text-[46px] text-charcoal">
              Browse The Ranges
            </h1>
            <p className="text-[14px] text-charcoal-soft leading-relaxed">
              Premium, skin-first ingredients and custom scents, carefully designed and priced honestly.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="bg-lilac-soft/30 border border-line p-5 rounded-[2px] mb-12 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-cream border border-line text-charcoal text-[13px] pl-9 pr-4 py-2.5 w-full focus:outline-hidden focus:border-wine/50 rounded-[2px] transition-colors"
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-soft/60" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-charcoal-soft shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream border border-line text-charcoal text-[13px] px-3 py-2.5 focus:outline-hidden focus:border-wine/50 rounded-[2px] transition-colors w-full sm:w-[200px] cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8 text-[13px] text-charcoal-soft">
            <p>
              Showing {sortedProducts.filter(p => selectedCategory === "hair_acc" ? true : p.isPublished).length} products
            </p>
{(
  searchQuery ||
  selectedCategory !== "all" ||
  selectedSubcategory ||
  sortBy !== "featured"
) && (              <button
                onClick={handleResetFilters}
                className="text-wine flex items-center gap-1 hover:underline transition-all"
              >
                <RefreshCw size={12} />
                Reset filters
              </button>
            )}
          </div>

          {/* Catalog Layout */}
          {selectedCategory === "hair_acc" ? (
            /* HAIR ACCESSORIES TEASER VIEW */
            <div className="border border-line bg-lilac-soft/20 rounded-[2px] p-8 md:p-14 text-center max-w-3xl mx-auto space-y-8 animate-fade-in-up">
              <div className="max-w-md mx-auto space-y-4">
                <span className="text-[10px] uppercase tracking-eyebrow bg-magenta text-cream px-3 py-1 font-semibold">
                  Launching July 2026
                </span>
                <h2 className="font-display text-[28px] sm:text-[38px] text-charcoal">
                  Hair Accessories Arriving Soon
                </h2>
                <p className="text-[14px] text-charcoal-soft leading-relaxed">
                  We are finalising our collection of custom hand-polished cellulose hair claws and premium mulberry silk scrunchies. No synthetic pulls, just beautiful hair styling.
                </p>
              </div>

              {/* Teaser Images Row */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="aspect-[3/4] bg-cream rounded-[2px] overflow-hidden border border-line relative group">
                  <img
                    src="/hair_claw_teaser.png"
                    alt="Premium hair claws teaser"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 inset-x-3 text-center bg-cream/90 backdrop-blur-xs py-1 text-[11px] font-medium text-wine border border-line">
                    Acetate Claw Clips
                  </div>
                </div>
                <div className="aspect-[3/4] bg-cream rounded-[2px] overflow-hidden border border-line relative group flex items-center justify-center text-charcoal-soft/30 text-[12px]">
                  <div className="p-3 text-center">
                    <p className="font-semibold text-wine text-[13px] mb-1">Silk Scrunchies</p>
                    <p className="text-[10px]">100% Mulberry Silk</p>
                  </div>
                </div>
              </div>

              {/* Waitlist Signup Form */}
              <div className="max-w-md mx-auto border-t border-line/60 pt-8 space-y-4">
                <p className="text-[13px] font-medium text-charcoal">
                  Join the waitlist to receive 15% off launch day:
                </p>

                {emailSubscribed ? (
                  <div className="flex flex-col items-center justify-center text-wine py-2 gap-1.5">
                    <CheckCircle2 size={24} />
                    <p className="text-[14px] font-semibold">Thank you! You're on the early access list.</p>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 bg-cream border border-line px-4 py-2.5 text-[13px] text-charcoal focus:outline-hidden focus:border-wine/50 rounded-[2px]"
                    />
                    <button
                      type="submit"
                      className="bg-wine hover:bg-wine-deep text-cream px-5 py-2.5 text-[12px] uppercase tracking-eyebrow font-medium transition-colors rounded-[2px] flex items-center gap-1.5 shadow-sm"
                    >
                      <Send size={12} />
                      Notify Me
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : sortedProducts.filter(p => p.isPublished).length === 0 ? (
            /* EMPTY STATE */
            <div className="text-center py-20 border border-line rounded-[2px] bg-cream">
              <p className="text-[16px] text-charcoal font-display">No matching items found</p>
              <p className="text-[13px] text-charcoal-soft mt-1 mb-6">
                Try adjusting your search terms or category selections.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-wine text-cream px-6 py-2.5 text-[12px] uppercase tracking-eyebrow hover:bg-wine-deep transition-colors"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            /* PRODUCTS GRID */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {sortedProducts
                .filter((p) => p.isPublished)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}