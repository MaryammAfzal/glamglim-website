import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Cosmetics & Perfumes | Glam Glim Planet",
  description:
    "Explore the Glam Glim range of velvet matte lipsticks, dewy finish foundation bottles, and luxury perfumes. Fast Cash on Delivery across Pakistan.",
  keywords: "shop cosmetics, makeup products, perfumes online, beauty shop pakistan, matte lipstick, liquid foundation, rose fragrance",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-charcoal-soft uppercase tracking-eyebrow text-[12px] animate-pulse">
            Loading Catalog...
          </div>
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
