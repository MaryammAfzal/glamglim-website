"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useShop } from "@/lib/store";

export function MiniCart() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
  } = useShop();

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [cartOpen]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with fade-in effect */}
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity duration-300 ease-out"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Panel with slide-in animation */}
        <div className="w-screen max-w-md bg-cream border-l border-line shadow-2xl flex flex-col animate-fade-in-up md:animate-none md:translate-x-0 transition-transform duration-300 ease-out">
          {/* Header */}
          <div className="px-6 py-5 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-wine" />
              <h2 className="text-[15px] uppercase tracking-eyebrow font-medium text-charcoal">
                Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="text-charcoal hover:text-wine p-1 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Cart list */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-lilac-soft rounded-full flex items-center justify-center text-wine mb-4">
                  <ShoppingBag size={24} strokeWidth={1.5} />
                </div>
                <p className="text-[16px] text-charcoal font-display">Your cart is empty</p>
                <p className="text-[13px] text-charcoal-soft mt-1 mb-6 max-w-xs">
                  Fill it with our premium makeup and signature perfume collections.
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="bg-wine text-cream px-6 py-2.5 text-[12px] uppercase tracking-eyebrow hover:bg-wine-deep transition-colors"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 pb-6 border-b border-line/60 last:border-none"
                  >
                    {/* Product image -> links to product detail page */}
                    <Link
                      href={`/shop/${item.product.id}`}
                      onClick={() => setCartOpen(false)}
                      className="w-20 aspect-[3/4] bg-lilac-soft rounded-[2px] overflow-hidden shrink-0 block"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          {/* Product name -> links to product detail page */}
                          <Link
                            href={`/shop/${item.product.id}`}
                            onClick={() => setCartOpen(false)}
                            className="text-[14px] font-medium text-charcoal leading-tight hover:text-wine transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[14px] font-medium text-wine">
                              Rs. {(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="w-5 h-5 flex items-center justify-center rounded-full text-charcoal-soft hover:text-wine hover:bg-lilac-soft transition-colors"
                              aria-label={`Remove ${item.product.name} from cart`}
                            >
                              <X size={13} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] uppercase tracking-eyebrow text-charcoal-soft mt-1">
                          {item.product.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-line bg-cream rounded-[2px]">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-charcoal-soft hover:text-wine transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="px-2.5 text-[13px] text-charcoal min-w-[20px] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-charcoal-soft hover:text-wine transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer summary */}
          {cart.length > 0 && (
            <div className="border-t border-line px-6 py-6 bg-lilac-soft/40">
              <div className="flex justify-between text-charcoal mb-4">
                <span className="text-[14px]">Subtotal</span>
                <span className="text-[16px] font-semibold text-wine">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[12px] text-charcoal-soft mb-6 leading-relaxed">
                Shipping and taxes calculated at checkout. Cash on Delivery (COD) is available.
              </p>
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full text-center bg-wine text-cream py-3.5 text-[13px] uppercase tracking-eyebrow hover:bg-wine-deep transition-all duration-300 shadow-xs hover:shadow-md"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="block w-full text-center text-[12px] text-charcoal hover:text-wine transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}