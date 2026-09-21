"use client";

import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/sample-data";
import { useShop } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();

  const isComingSoon = product.category === "hair_acc" || product.badge === "Coming Soon";
  const isSoldOut = product.inventory === 0 && !isComingSoon;

  const primaryImage = product.image
    ? product.image.split(",")[0].trim()
    : "/lipstick_matte.png";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isComingSoon && !isSoldOut) {
      addToCart(product, 1);
    }
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block animate-fade-in-up">
      {/* Image container with hover overlays */}
      <div className="relative aspect-[3/4] bg-lilac-soft rounded-[2px] overflow-hidden mb-4 border border-line/40">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-eyebrow font-medium bg-cream/90 text-wine px-2.5 py-1 shadow-xs">
            {product.badge}
          </span>
        )}

        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Action Overlays on Hover — desktop/tablet only. On mobile, tapping the
            card just opens the product page (no Quick Add, no Quick View). */}
        <div className="absolute inset-0 bg-charcoal/10 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex flex-col justify-end p-3 gap-2">
          {isComingSoon ? (
            <div className="glass-panel text-center py-2 px-3 text-[11px] uppercase tracking-eyebrow font-medium text-charcoal shadow-xs">
              Coming Soon
            </div>
          ) : isSoldOut ? (
            <div className="glass-panel text-center py-2 px-3 text-[11px] uppercase tracking-eyebrow font-medium text-charcoal shadow-xs bg-gray-200">
              Sold Out
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-wine text-cream hover:bg-wine-deep py-2 px-2 text-[11px] uppercase tracking-eyebrow font-medium flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <ShoppingBag size={12} />
                Quick Add
              </button>
              <div
                className="bg-cream hover:bg-lilac-soft text-charcoal p-2 flex items-center justify-center transition-all duration-300 shadow-sm translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-75"
              >
                <Eye size={14} strokeWidth={1.5} />
              </div>
            </div>
          )}
        </div>

        {/* Mobile-only status badge (Coming Soon / Sold Out), since the hover
            overlay above is hidden on mobile but this info still matters). */}
        {(isComingSoon || isSoldOut) && (
          <div className="absolute bottom-3 left-3 right-3 sm:hidden">
            <div
              className={`text-center py-2 px-3 text-[11px] uppercase tracking-eyebrow font-medium text-charcoal shadow-xs ${
                isComingSoon ? "glass-panel" : "glass-panel bg-gray-200"
              }`}
            >
              {isComingSoon ? "Coming Soon" : "Sold Out"}
            </div>
          </div>
        )}
      </div>

      {/* Product Text info */}
      <p className="text-[11px] uppercase tracking-eyebrow text-charcoal-soft mb-1">
        {product.category === "hair_acc" ? "Hair Accessories" : product.category}
      </p>
      <h3 className="text-[14px] sm:text-[15px] font-medium text-charcoal mb-1.5 group-hover:text-wine transition-colors line-clamp-1">
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2 flex-wrap">
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <>
            <span className="text-[14px] sm:text-[15px] font-semibold text-wine">
              Rs. {product.price.toLocaleString()}
            </span>
            <span className="text-[11px] sm:text-[12px] text-charcoal-soft/60 line-through">
              Rs. {product.compareAtPrice.toLocaleString()}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold bg-magenta/10 text-magenta px-1.5 py-0.5 rounded-sm">
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          </>
        ) : (
          <span className="text-[14px] sm:text-[15px] font-semibold text-wine">
            Rs. {product.price.toLocaleString()}
          </span>
        )}
      </div>
    </Link>
  );
}