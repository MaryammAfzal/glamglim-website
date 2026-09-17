"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  MessageSquare,
  Star,
  Heart,
  Check,
  ShieldAlert,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/store";

export default function ProductDetailClient({
  productId,
}: {
  productId: string;
}) {
  const { products, addToCart } = useShop();

  const [quantity, setQuantity] = useState(1);

  const [isFavorite, setIsFavorite] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  // Selected variant options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Which image in the gallery is currently shown
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // ---------------------------------------------------------
  // FIND PRODUCT
  // ---------------------------------------------------------

  const product = products.find((p) => p.id === productId);

  // IMPORTANT:
  // All hooks must run before the conditional "Product Not Found"
  // return below.
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // BUILD DYNAMIC VARIANT GROUPS
  // ---------------------------------------------------------

  const variantGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};

    if (!product?.variants || product.variants.length === 0) {
      return groups;
    }

    product.variants.forEach((variant) => {
      Object.entries(variant.options || {}).forEach(
        ([groupName, optionValue]) => {
          if (!groups[groupName]) {
            groups[groupName] = [];
          }

          if (!groups[groupName].includes(optionValue)) {
            groups[groupName].push(optionValue);
          }
        }
      );
    });

    return groups;
  }, [product]);

  // ---------------------------------------------------------
  // SELECT FIRST REAL VARIANT
  // ---------------------------------------------------------

  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedOptions({});
      setQuantity(1);
      return;
    }

    const firstVariant = product.variants[0];

    setSelectedOptions(firstVariant.options || {});
    setQuantity(1);
  }, [product]);

  // ---------------------------------------------------------
  // FIND SELECTED VARIANT
  // ---------------------------------------------------------

  const selectedVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) {
      return undefined;
    }

    return product.variants.find((variant) => {
      const variantOptions = variant.options || {};
      const selectedKeys = Object.keys(selectedOptions);

      return selectedKeys.every(
        (key) => variantOptions[key] === selectedOptions[key]
      );
    });
  }, [product, selectedOptions]);

  // ---------------------------------------------------------
  // BUILD IMAGE GALLERY (product can have multiple comma-separated images)
  // ---------------------------------------------------------
const galleryImages = useMemo(() => {
  // Product-level images
  const productImages = product?.image
    ? product.image
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Get ALL variant images
  const variantImages =
    product?.variants
      ?.map((variant) => variant.image?.trim())
      .filter(Boolean) || [];

  // Combine product images + ALL variant images
  const allImages = [
    ...productImages,
    ...variantImages,
  ].filter(
    (img, index, arr) => arr.indexOf(img) === index
  );

  // If a variant is selected, put its image FIRST
  // but KEEP all other images in the gallery.
  if (selectedVariant?.image) {
    const selectedImage = selectedVariant.image.trim();

    return [
      selectedImage,
      ...allImages.filter((img) => img !== selectedImage),
    ];
  }

  return allImages.length > 0
    ? allImages
    : ["/lipstick_matte.png"];
}, [product, selectedVariant]);
  // Reset to the first image whenever the product or variant changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product, selectedVariant]);

  // ---------------------------------------------------------
  // EFFECTIVE PRODUCT VALUES
  // ---------------------------------------------------------

  const effectivePrice = product?.price ?? 0;

  const effectiveCompareAtPrice = product?.compareAtPrice ?? 0;

  const effectiveImage =
    galleryImages[activeImageIndex] ||
    galleryImages[0] ||
    "/lipstick_matte.png";

  const effectiveInventory =
    selectedVariant?.inventory ?? product?.inventory ?? 0;

  // ---------------------------------------------------------
  // DISCOUNT
  // ---------------------------------------------------------

  const hasDiscount =
    effectiveCompareAtPrice > effectivePrice && effectiveCompareAtPrice > 0;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((effectiveCompareAtPrice - effectivePrice) /
          effectiveCompareAtPrice) *
          100
      )
    : 0;

  // ---------------------------------------------------------
  // KEEP QUANTITY WITHIN INVENTORY
  // ---------------------------------------------------------

  useEffect(() => {
    if (effectiveInventory <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(currentQuantity, effectiveInventory)
    );
  }, [effectiveInventory]);

  // ---------------------------------------------------------
  // PRODUCT NOT FOUND
  // ---------------------------------------------------------

  if (!product) {
    return (
      <>
        <SiteHeader />

        <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-5 py-20">
          <ShieldAlert size={40} className="text-wine mb-4" />

          <h1 className="font-display text-[32px] text-charcoal">
            Product Not Found
          </h1>

          <p className="text-[14px] text-charcoal-soft mt-2 mb-6">
            The beauty item you are looking for does not exist or has been
            removed.
          </p>

          <Link
            href="/shop"
            className="bg-wine text-cream px-7 py-3 text-[13px] uppercase tracking-eyebrow hover:bg-wine-deep transition-colors"
          >
            Back to Shop
          </Link>
        </div>

        <SiteFooter />
      </>
    );
  }

  // ---------------------------------------------------------
  // CHECK OPTION AVAILABILITY
  // ---------------------------------------------------------

  const isOptionAvailable = (groupName: string, optionValue: string) => {
    if (!product.variants || product.variants.length === 0) {
      return false;
    }

    return product.variants.some((variant) => {
      const variantOptions = variant.options || {};

      // This option must match
      if (variantOptions[groupName] !== optionValue) {
        return false;
      }

      // Other selected options must also match
      return Object.entries(selectedOptions).every(
        ([selectedGroup, selectedValue]) => {
          if (selectedGroup === groupName) {
            return true;
          }

          return variantOptions[selectedGroup] === selectedValue;
        }
      );
    });
  };

  // ---------------------------------------------------------
  // CHANGE VARIANT OPTION
  // ---------------------------------------------------------

  const handleOptionChange = (groupName: string, optionValue: string) => {
    setSelectedOptions((current) => ({
      ...current,
      [groupName]: optionValue,
    }));

    setQuantity(1);
    setAddedMessage(false);
  };

  // ---------------------------------------------------------
  // HAS VARIANTS?
  // ---------------------------------------------------------

  const hasVariants = (product.variants?.length ?? 0) > 0;

  // ---------------------------------------------------------
  // COMING SOON / OUT OF STOCK
  // ---------------------------------------------------------

  const isComingSoon =
    product.category === "hair_acc" ||
    effectiveInventory === 0 ||
    product.badge === "Coming Soon";

  // ---------------------------------------------------------
  // ADD TO CART
  // ---------------------------------------------------------

  const handleAddToCart = () => {
    if (isComingSoon) {
      return;
    }

    // Product has variants but no valid variant selected
    if (hasVariants && !selectedVariant) {
      alert("Please select all product options before adding to cart.");
      return;
    }

    // No inventory
    if (effectiveInventory <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    const safeQuantity = Math.min(quantity, effectiveInventory);

    // Create product copy using selected variant values.
    // This keeps your existing addToCart(product, quantity)
    // function compatible.

    const productForCart = {
      ...product,
      price: effectivePrice,
      compareAtPrice: effectiveCompareAtPrice,
      image: effectiveImage,
      inventory: effectiveInventory,
    };

    addToCart(productForCart, safeQuantity);

    setAddedMessage(true);

    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);
  };

  // ---------------------------------------------------------
  // WHATSAPP VARIANT TEXT
  // ---------------------------------------------------------

  const selectedVariantText =
    selectedVariant &&
    Object.entries(selectedVariant.options || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

  const whatsAppMessage = `Hi Glam Glim! I would like to order the product: "${
    product.name
  }"${
    selectedVariantText ? ` (${selectedVariantText})` : ""
  } (Quantity: ${quantity}, Price: Rs. ${effectivePrice.toLocaleString()}). Please let me know the details.`;

  const whatsAppUrl = `https://wa.me/923001234567?text=${encodeURIComponent(
    whatsAppMessage
  )}`;

  // ---------------------------------------------------------
  // RELATED PRODUCTS
  // ---------------------------------------------------------

  const sameSubcategoryProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.subcategory === product.subcategory &&
        p.id !== product.id &&
        p.isPublished
    )
    .slice(0, 3);

  const otherCategoryProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id &&
        p.isPublished &&
        !sameSubcategoryProducts.some((related) => related.id === p.id)
    )
    .slice(0, 3 - sameSubcategoryProducts.length);

  const fallbackRelated = [...sameSubcategoryProducts, ...otherCategoryProducts];

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">

          {/* Back button */}

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-eyebrow font-semibold text-charcoal-soft hover:text-wine mb-10 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to catalog
          </Link>

          {/* Product details */}

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* ================================================= */}
            {/* PRODUCT IMAGE */}
            {/* ================================================= */}

            <div className="lg:col-span-6 relative">
<div className="bg-lilac-soft rounded-[2px] overflow-hidden border border-line relative shadow-md flex justify-center">                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-eyebrow font-semibold bg-cream text-wine px-3 py-1 shadow-xs border border-line/40">
                    {product.badge}
                  </span>
                )}

                <img
                  src={effectiveImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail selector - only shows when there is more than one image */}

              {galleryImages.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[2px] overflow-hidden border-2 transition-colors ${
                        idx === activeImageIndex
                          ? "border-wine"
                          : "border-line/50 hover:border-wine/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* PRODUCT INFORMATION */}
            {/* ================================================= */}

            <div className="lg:col-span-6 space-y-6">

              {/* Category + Name */}

              <div>
                <p className="text-[11px] uppercase tracking-eyebrow text-magenta font-semibold mb-1">
                  {product.category === "hair_acc"
                    ? "Hair Accessories"
                    : product.category}
                </p>

                <h1 className="font-display text-[36px] sm:text-[42px] text-charcoal leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}

              <div className="flex items-center gap-4 border-b border-line/60 pb-5">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={
                        i < Math.floor(product.rating) ? "currentColor" : "none"
                      }
                      strokeWidth={1.5}
                    />
                  ))}

                  <span className="text-[13px] font-medium text-charcoal ml-1.5">
                    {product.rating}
                  </span>
                </div>

                <span className="text-[12px] text-charcoal-soft">
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>

              {/* ================================================= */}
              {/* PRICE */}
              {/* ================================================= */}

              <div className="flex items-baseline gap-3 flex-wrap">

                {/* Discounted / selling price */}

                <span className="text-[24px] sm:text-[28px] font-semibold text-wine">
                  Rs. {effectivePrice.toLocaleString()}
                </span>

                {/* Original price + saving */}

                {hasDiscount && (
                  <>
                    <span className="text-[16px] text-charcoal-soft/60 line-through">
                      Rs. {effectiveCompareAtPrice.toLocaleString()}
                    </span>

                    <span className="text-[11px] uppercase tracking-wider font-semibold bg-magenta/10 text-magenta px-2 py-0.5 rounded-sm">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}

              <p className="text-[14px] sm:text-[15px] text-charcoal-soft leading-relaxed">
                {product.shortDescription}
              </p>

              {/* ================================================= */}
              {/* DYNAMIC VARIANTS */}
              {/* ================================================= */}

              {hasVariants && (
                <div className="space-y-5 border-y border-line/60 py-5">

                  {Object.entries(variantGroups).map(([groupName, options]) => (
                    <div key={groupName} className="space-y-2.5">

                      <div className="flex items-center justify-between">
                        <span className="text-[13px] uppercase tracking-eyebrow font-semibold text-charcoal">
                          {groupName}
                        </span>

                        <span className="text-[12px] text-charcoal-soft">
                          {selectedOptions[groupName] || "Select"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">

                        {options.map((option) => {
                          const isSelected =
                            selectedOptions[groupName] === option;

                          const available = isOptionAvailable(
                            groupName,
                            option
                          );

                          return (
                            <button
                              key={`${groupName}-${option}`}
                              type="button"
                              disabled={!available}
                              onClick={() =>
                                handleOptionChange(groupName, option)
                              }
                              className={`px-4 py-2 border text-[12px] transition-all rounded-[2px] ${
                                isSelected
                                  ? "border-wine bg-wine text-cream"
                                  : available
                                  ? "border-line bg-cream text-charcoal hover:border-wine hover:text-wine"
                                  : "border-line/50 bg-charcoal/5 text-charcoal-soft/40 cursor-not-allowed line-through"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}

                      </div>
                    </div>
                  ))}

                  {/* Selected variant information */}

                  {selectedVariant ? (
                    <div className="text-[12px] text-charcoal-soft">
                      {effectiveInventory > 0 ? (
                        <span>
                          {effectiveInventory}{" "}
                          {effectiveInventory === 1 ? "item" : "items"} available
                        </span>
                      ) : (
                        <span className="text-wine font-semibold">
                          This combination is out of stock
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[12px] text-wine">
                      Please select all options to continue.
                    </p>
                  )}
                </div>
              )}

              {/* ================================================= */}
              {/* COMING SOON / QUANTITY */}
              {/* ================================================= */}

              {isComingSoon ? (
                <div className="border border-line bg-lilac-soft/30 p-5 rounded-[2px] space-y-4">

                  <p className="text-[13px] font-semibold text-wine uppercase tracking-wider">
                    Arriving Soon
                  </p>

                  <p className="text-[12px] text-charcoal-soft">
                    This hair accessory item is currently being prepared for
                    our catalog. You can join the early notification waitlist
                    on the shop main page to get notified once stock arrives!
                  </p>

                  <Link
                    href="/shop?category=hair_acc"
                    className="inline-block text-[12px] uppercase tracking-eyebrow font-semibold text-wine border-b border-wine pb-0.5 hover:text-wine-deep hover:border-wine-deep"
                  >
                    Go to Hair Accessories section
                  </Link>

                </div>
              ) : (
                <div className="space-y-4 pt-2">

                  {/* Quantity */}

                  <div className="flex items-center gap-3 flex-wrap">

                    <span className="text-[13px] uppercase tracking-eyebrow text-charcoal-soft">
                      Quantity:
                    </span>

                    <div className="flex items-center border border-line bg-cream rounded-[2px]">

                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-1.5 text-charcoal-soft hover:text-wine transition-colors disabled:opacity-40"
                      >
                        -
                      </button>

                      <span className="px-4 text-[14px] font-semibold text-charcoal min-w-[24px] text-center">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((q) =>
                            Math.min(effectiveInventory, q + 1)
                          )
                        }
                        disabled={
                          quantity >= effectiveInventory ||
                          effectiveInventory <= 0
                        }
                        className="px-3 py-1.5 text-charcoal-soft hover:text-wine transition-colors disabled:opacity-40"
                      >
                        +
                      </button>

                    </div>

                    <span className="text-[11px] text-charcoal-soft/70">
                      {effectiveInventory > 0
                        ? `${effectiveInventory} items in stock`
                        : "Out of stock"}
                    </span>

                  </div>

                  {/* ================================================= */}
                  {/* CTA BUTTONS */}
                  {/* ================================================= */}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={
                        effectiveInventory <= 0 ||
                        (hasVariants && !selectedVariant)
                      }
                      className="flex-1 bg-wine text-cream py-4 text-[13px] uppercase tracking-eyebrow font-medium hover:bg-wine-deep transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addedMessage ? (
                        <>
                          <Check size={16} />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] text-cream hover:bg-[#20ba56] py-4 text-[13px] uppercase tracking-eyebrow font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm text-center"
                    >
                      <MessageSquare size={16} />
                      Order on WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-4 border border-line rounded-[2px] transition-colors ${
                        isFavorite
                          ? "text-red-500 bg-red-50/50 border-red-200"
                          : "text-charcoal-soft hover:text-wine bg-cream"
                      }`}
                      aria-label="Favorite"
                    >
                      <Heart
                        size={18}
                        className={isFavorite ? "fill-red-500" : ""}
                      />
                    </button>

                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* INGREDIENTS */}
              {/* ================================================= */}

              <div className="border-t border-line/60 pt-6">

                <h3 className="text-[12px] uppercase tracking-eyebrow font-semibold text-charcoal mb-3">
                  Ingredients
                </h3>

                <div className="text-[13px] text-charcoal-soft leading-relaxed">
                  <p>
                    {product.ingredients ||
                      "Raw botanical extracts, skin-safe emollients. Full list pending lab certification."}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ================================================= */}
          {/* RELATED PRODUCTS */}
          {/* ================================================= */}

          <div className="mt-24 pt-10 border-t border-line">

            <h2 className="font-display text-[26px] text-charcoal mb-10">
              You Might Also Love
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">

              {fallbackRelated.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}

            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}