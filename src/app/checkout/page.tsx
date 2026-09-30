"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Truck,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useShop, Order } from "@/lib/store";

type CheckoutMethod = "COD" | "Online";

type FormErrors = {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
};

const JAZZCASH_ACCOUNT_NO = "03254715421";
const JAZZCASH_ACCOUNT_NAME = "GLAMGLIM";
const WHATSAPP_NUMBER = "923254715421";

export default function CheckoutPage() {
  const {
    cart,
    placeOrder,
    clearCart,
  } = useShop();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    checkoutMethod: CheckoutMethod;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutMethod, setCheckoutMethod] =
    useState<CheckoutMethod>("COD");
  const initiateCheckoutTracked = useRef(false);

  // =========================
  // COPY ACCOUNT NUMBER
  // =========================

  const [copied, setCopied] = useState(false);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(JAZZCASH_ACCOUNT_NO);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard failure
    }
  };

  // =========================
  // PROMO CODE
  // =========================

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  // =========================
  // TOTALS
  // =========================

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shippingFee =
    subtotal > 2500 || subtotal === 0 ? 0 : 200;

  const discount =
    promoApplied && subtotal >= 1500
      ? Math.round(subtotal * 0.1)
      : 0;

  const total = subtotal - discount + shippingFee;

  // =========================
  // META INITIATE CHECKOUT
  // =========================

  useEffect(() => {
    if (
      initiateCheckoutTracked.current ||
      cart.length === 0 ||
      typeof window === "undefined" ||
      typeof (window as any).fbq !== "function"
    ) {
      return;
    }

    initiateCheckoutTracked.current = true;

    (window as any).fbq("track", "InitiateCheckout", {
      content_ids: cart.map((item) => item.product.id),
      content_type: "product",
      value: total,
      currency: "PKR",
      num_items: cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    });
  }, [cart, total]);

  // =========================
  // FORM VALIDATION
  // =========================

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Please enter your name.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Please enter your phone number.";
    } else {
      const phoneRegex = /^(?:\+92|92|0)3[0-9]{9}$/;

      if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ""))) {
        errors.phone = "Please enter a valid Pakistani phone number.";
      }
    }

    if (!formData.address.trim()) {
      errors.address = "Please enter your complete address.";
    }

    if (!formData.city.trim()) {
      errors.city = "Please enter your city.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =========================
  // FORM INPUT
  // =========================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleFieldFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTimeout(() => {
      e.target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  // =========================
  // PROMO
  // =========================

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoError("Please enter a promo code.");
      setPromoApplied(false);
      return;
    }

    if (code !== "AYESHA10") {
      setPromoError("Invalid promo code.");
      setPromoApplied(false);
      return;
    }

    if (subtotal < 1500) {
      setPromoError(
        "Minimum order of Rs. 1,500 is required."
      );
      setPromoApplied(false);
      return;
    }

    setPromoCode("AYESHA10");
    setPromoError("");
    setPromoApplied(true);
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async (
    e: React.SyntheticEvent,
    checkoutMethod: CheckoutMethod
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      setShowValidationModal(true);
      return;
    }

    if (cart.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const snapshot = {
      subtotal,
      discount,
      shippingFee,
      total,
      checkoutMethod,
    };

    try {
      const order = await placeOrder({
        ...formData,
        checkoutMethod,
        promoCode: promoApplied
          ? promoCode
          : undefined,
      });

      if (!order) {
        throw new Error("Order could not be created.");
      }

      setOrderSummary(snapshot);
      setPlacedOrder(order);

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }, 50);

      clearCart();

      // =========================
      // ONLINE PAYMENT -> WHATSAPP SCREENSHOT
      // =========================

      if (checkoutMethod === "Online") {
        const itemsText = cart
          .map(
            (item) =>
              `${item.product.name} x${item.quantity} - Rs. ${(item.product.price * item.quantity).toLocaleString()}`
          )
          .join("\n");

        const message = `Hi Glam Glim! I would like to confirm my order.

Order ID: ${order.id}

Customer Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
City: ${formData.city}
Payment Method: Online (JazzCash)

Items:
${itemsText}

Subtotal: Rs. ${subtotal.toLocaleString()}
${
  discount > 0
    ? `Promo Discount (10%): - Rs. ${discount.toLocaleString()}\n`
    : ""
}Shipping: ${
          shippingFee === 0
            ? "FREE"
            : `Rs. ${shippingFee.toLocaleString()}`
        }

Total: Rs. ${total.toLocaleString()}

I am sending the payment screenshot below.`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          message
        )}`;

        window.open(whatsappUrl, "_blank");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Something went wrong while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCityKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      e.currentTarget.blur();

      setTimeout(() => {
        document
          .getElementById("checkout-buttons")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }, 100);
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  if (!placedOrder && cart.length === 0) {
    return (
      <>
        <SiteHeader />

        <main className="min-h-[70vh] bg-cream flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <ShoppingBag className="w-12 h-12 mx-auto mb-5 text-wine" />

            <h1 className="font-serif text-3xl text-charcoal mb-3">
              Your cart is empty
            </h1>

            <p className="text-sm text-charcoal/60 mb-7">
              Add some beautiful products to your cart before
              checking out.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-wine text-cream px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-wine-deep transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>

        <SiteFooter />
      </>
    );
  }

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (placedOrder && orderSummary) {
    return (
      <>
        <SiteHeader />

        <main className="min-h-[70vh] bg-cream px-4 py-10 sm:py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-line p-5 sm:p-8">
              <div className="text-center mb-8">
                <CheckCircle2 className="w-14 h-14 mx-auto text-green-600 mb-4" />

                <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-2">
                  Order Placed!
                </h1>

                <p className="text-sm text-charcoal/60">
                  Thank you for shopping with Glam Glim.
                </p>
              </div>

              <div className="border border-line bg-cream p-4 sm:p-5 mb-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-charcoal/50">
                    Order ID
                  </span>

                  <span className="text-xs font-medium text-charcoal break-all text-right">
                    {placedOrder.id}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-charcoal/60">
                      Subtotal
                    </span>

                    <span className="text-charcoal shrink-0">
                      Rs.{" "}
                      {orderSummary.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between gap-4">
                      <span className="text-charcoal/60">
                        Promo Discount (10%)
                      </span>

                      <span className="text-green-600 shrink-0">
                        - Rs.{" "}
                        {orderSummary.discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <span className="text-charcoal/60">
                      Shipping
                    </span>

                    <span className="text-charcoal shrink-0">
                      {orderSummary.shippingFee === 0
                        ? "FREE"
                        : `Rs. ${orderSummary.shippingFee.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="border-t border-line pt-3 flex justify-between gap-4">
                    <span className="font-semibold text-charcoal">
                      Total
                    </span>

                    <span className="font-semibold text-wine shrink-0">
                      Rs.{" "}
                      {orderSummary.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* ONLINE PAYMENT REMINDER */}
              {orderSummary.checkoutMethod === "Online" && (
                <div className="border border-line bg-cream p-4 sm:p-5 mb-6 text-sm space-y-2">
                  <p className="font-semibold text-charcoal">
                    Complete your payment
                  </p>

                  <p className="text-charcoal/60 text-xs leading-relaxed">
                    Send Rs. {orderSummary.total.toLocaleString()} to
                    the JazzCash account below, then send the payment
                    screenshot on WhatsApp.
                  </p>

                  <div className="flex justify-between gap-4 pt-1">
                    <span className="text-charcoal/60">Account No</span>
                    <span className="font-medium text-charcoal">
                      {JAZZCASH_ACCOUNT_NO}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-charcoal/60">Account Name</span>
                    <span className="font-medium text-charcoal">
                      {JAZZCASH_ACCOUNT_NAME}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-3 bg-[#25D366] text-white px-4 py-3 text-[11px] uppercase tracking-wider font-medium hover:bg-[#20bd5a] transition-colors"
                  >
                    Send Screenshot on WhatsApp
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 border border-wine text-wine px-5 py-3 text-[11px] uppercase tracking-wider font-medium hover:bg-wine hover:text-cream transition-colors"
                >
                  Continue Shopping
                </Link>

                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 bg-wine text-cream px-5 py-3 text-[11px] uppercase tracking-wider font-medium hover:bg-wine-deep transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </>
    );
  }

  // =========================
  // CHECKOUT
  // =========================

  return (
    <>
      <SiteHeader />

      <main className="bg-cream min-h-screen pb-24 sm:pb-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">

          {/* BACK */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-charcoal/60 hover:text-wine transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Link>

          {/* TITLE */}
          <div className="mb-7 sm:mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine mb-2">
              Glam Glim
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
              Checkout
            </h1>
          </div>

          <div className="grid w-full min-w-0 max-w-full lg:grid-cols-12 gap-6 lg:gap-10 items-start">

            {/* ============================================
                LEFT COLUMN - SHIPPING + PAYMENT
                ============================================ */}

            <div className="w-full min-w-0 lg:col-span-7 order-1">
              <form
                id="checkout-form"
                noValidate
                onSubmit={(e) => e.preventDefault()}
                className="space-y-5"
              >

                {/* SHIPPING DETAILS */}
                <div className="bg-white border border-line p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-lilac-soft/50 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-wine" />
                    </div>

                    <div>
                      <h2 className="font-serif text-xl text-charcoal">
                        Shipping Details
                      </h2>

                      <p className="text-[10px] uppercase tracking-wider text-charcoal/40 mt-0.5">
                        Where should we deliver?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">

                    {/* NAME */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-charcoal mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={handleFieldFocus}
                        enterKeyHint="next"
                        placeholder="Enter your full name"
                        className={`w-full min-w-0 bg-lilac-soft/20 border ${
                          formErrors.name
                            ? "border-red-400"
                            : "border-line"
                        } px-3.5 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-hidden focus:border-wine/50`}
                      />

                      {formErrors.name && (
                        <p className="mt-1.5 text-[11px] text-red-500">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* PHONE */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-charcoal mb-2">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        enterKeyHint="next"
                        onFocus={handleFieldFocus}
                        onChange={handleInputChange}
                        placeholder="03XX XXXXXXX"
                        className={`w-full min-w-0 bg-lilac-soft/20 border ${
                          formErrors.phone
                            ? "border-red-400"
                            : "border-line"
                        } px-3.5 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-hidden focus:border-wine/50`}
                      />

                      {formErrors.phone && (
                        <p className="mt-1.5 text-[11px] text-red-500">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-charcoal mb-2">
                        Complete Address
                      </label>

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onFocus={handleFieldFocus}
                        enterKeyHint="next"
                        placeholder="House no., street, area, landmark..."
                        rows={3}
                        className={`w-full min-w-0 resize-none bg-lilac-soft/20 border ${
                          formErrors.address
                            ? "border-red-400"
                            : "border-line"
                        } px-3.5 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-hidden focus:border-wine/50`}
                      />

                      {formErrors.address && (
                        <p className="mt-1.5 text-[11px] text-red-500">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    {/* CITY */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-charcoal mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onFocus={handleFieldFocus}
                        onChange={handleInputChange}
                        enterKeyHint="done"
                        onKeyDown={handleCityKeyDown}
                        placeholder="Enter your city"
                        className={`w-full min-w-0 bg-lilac-soft/20 border ${
                          formErrors.city
                            ? "border-red-400"
                            : "border-line"
                        } px-3.5 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-hidden focus:border-wine/50`}
                      />

                      {formErrors.city && (
                        <p className="mt-1.5 text-[11px] text-red-500">
                          {formErrors.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="bg-white border border-line p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-lilac-soft/50 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-wine" />
                    </div>

                    <div>
                      <h2 className="font-serif text-xl text-charcoal">
                        Payment Method
                      </h2>

                      <p className="text-[10px] uppercase tracking-wider text-charcoal/40 mt-0.5">
                        Choose how you'd like to pay
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">

                    {/* CASH ON DELIVERY */}
                    <button
                      type="button"
                      onClick={() => setCheckoutMethod("COD")}
                      className={`w-full text-left border p-4 transition-colors ${
                        checkoutMethod === "COD"
                          ? "border-wine bg-wine/5"
                          : "border-line bg-cream"
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        {/* RADIO */}
                        <div
                          className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                            checkoutMethod === "COD"
                              ? "border-wine"
                              : "border-charcoal/30"
                          }`}
                        >
                          {checkoutMethod === "COD" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-wine" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-charcoal">
                            Cash on Delivery
                          </p>

                          <p className="text-[11px] text-charcoal/55 mt-1 leading-relaxed">
                            Pay when your order arrives at your doorstep.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* ONLINE PAYMENT */}
                    <div
                      className={`border transition-colors ${
                        checkoutMethod === "Online"
                          ? "border-wine bg-wine/5"
                          : "border-line bg-cream"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setCheckoutMethod("Online")}
                        className="w-full text-left p-4"
                      >
                        <div className="flex items-start gap-3">

                          {/* RADIO */}
                          <div
                            className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                              checkoutMethod === "Online"
                                ? "border-wine"
                                : "border-charcoal/30"
                            }`}
                          >
                            {checkoutMethod === "Online" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-wine" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-charcoal">
                              Online Payment
                            </p>

                            <p className="text-[11px] text-charcoal/55 mt-1 leading-relaxed">
                              Pay via JazzCash and send us the payment
                              screenshot on WhatsApp.
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* DROPDOWN DETAILS */}
                      {checkoutMethod === "Online" && (
                        <div className="px-4 pb-4">
                          <div className="border border-line bg-white p-4 space-y-3 text-sm">
                            <div className="flex justify-between gap-4">
                              <span className="text-charcoal/60">
                                Method
                              </span>
                              <span className="font-medium text-charcoal">
                                JazzCash
                              </span>
                            </div>

                            <div className="flex justify-between items-center gap-4">
                              <span className="text-charcoal/60">
                                Account No
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="font-medium text-charcoal">
                                  {JAZZCASH_ACCOUNT_NO}
                                </span>

                                <button
                                  type="button"
                                  onClick={handleCopyAccount}
                                  className="text-[10px] uppercase tracking-wider border border-wine text-wine px-2 py-1 hover:bg-wine hover:text-cream transition-colors"
                                >
                                  {copied ? "Copied" : "Copy"}
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-charcoal/60">
                                Account Name
                              </span>
                              <span className="font-medium text-charcoal">
                                {JAZZCASH_ACCOUNT_NAME}
                              </span>
                            </div>

                            <p className="text-[10px] text-charcoal/50 leading-relaxed border-t border-line pt-3">
                              After placing your order, send the payment
                              screenshot on WhatsApp so we can confirm it.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </form>
            </div>

            {/* ============================================
                RIGHT COLUMN - ORDER SUMMARY
                ============================================ */}

            <div className="w-full min-w-0 lg:col-span-5 order-2">
              <div className="bg-white border border-line p-4 sm:p-6 lg:sticky lg:top-24">

                {/* ORDER TITLE */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="font-serif text-xl text-charcoal">
                      Your Order
                    </h2>

                    <p className="text-[10px] uppercase tracking-wider text-charcoal/40 mt-0.5">
                      {cart.length}{" "}
                      {cart.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <ShoppingBag className="w-5 h-5 text-wine shrink-0" />
                </div>

                {/* PRODUCTS */}
                <div className="space-y-4 mb-5">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3"
                    >
                      <div className="w-16 h-20 sm:w-20 sm:h-24 bg-lilac-soft/20 overflow-hidden shrink-0">
                        <img
                          src={item.product.image?.split(",")[0] || "/lipstick_matte.png"}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal line-clamp-2">
                          {item.product.name}
                        </p>

                        <p className="text-[11px] text-charcoal/50 mt-1">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-sm font-semibold text-wine mt-2">
                          Rs.{" "}
                          {(
                            item.product.price *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line pt-5">

                  {/* PROMO CODE */}
                  <div className="border border-line bg-cream p-4 rounded-[2px] space-y-3 mb-5">
                    <p className="text-[12px] uppercase tracking-wider font-semibold text-charcoal">
                      Promo Code
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError("");
                          setPromoApplied(false);
                        }}
                        placeholder="Enter promo code"
                        disabled={promoApplied}
                        className="flex-1 min-w-0 bg-lilac-soft/35 border border-line px-3 py-2.5 text-[12px] text-charcoal uppercase placeholder:text-charcoal/35 focus:outline-hidden focus:border-wine/50 rounded-[2px]"
                      />

                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoApplied}
                        className="bg-wine text-cream px-4 py-2.5 text-[11px] uppercase tracking-wider font-medium hover:bg-wine-deep transition-colors disabled:opacity-60 shrink-0"
                      >
                        {promoApplied ? "Applied" : "Apply"}
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-[11px] text-red-500">
                        {promoError}
                      </p>
                    )}

                    {promoApplied && (
                      <p className="text-[11px] text-green-600 font-medium">
                        🎉 AYESHA10 applied — 10% discount added!
                      </p>
                    )}
                  </div>

                  {/* TOTALS */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-charcoal/60">
                        Subtotal
                      </span>

                      <span className="text-charcoal shrink-0">
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between gap-4">
                        <span className="text-charcoal/60">
                          Promo Discount (10%)
                        </span>

                        <span className="text-green-600 shrink-0">
                          - Rs. {discount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between gap-4">
                      <span className="text-charcoal/60">
                        Shipping
                      </span>

                      <span className="text-charcoal shrink-0">
                        {shippingFee === 0
                          ? "FREE"
                          : `Rs. ${shippingFee.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="border-t border-line pt-4 flex justify-between gap-4">
                      <span className="font-semibold text-charcoal">
                        Total
                      </span>

                      <span className="font-semibold text-wine text-base shrink-0">
                        Rs. {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* FREE SHIPPING MESSAGE */}
                  {subtotal > 0 && subtotal <= 2500 && (
                    <div className="mt-5 flex items-start gap-2 bg-lilac-soft/25 p-3">
                      <Truck className="w-4 h-4 text-wine shrink-0 mt-0.5" />

                      <p className="text-[10px] leading-relaxed text-charcoal/60">
                        Add Rs.{" "}
                        {(2500 - subtotal).toLocaleString()} more
                        to get free shipping.
                      </p>
                    </div>
                  )}

                  {/* SECURITY */}
                  <div className="mt-4 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />

                    <p className="text-[10px] leading-relaxed text-charcoal/50">
                      Your information is kept secure and is only
                      used to process your order.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================
                ORDER BUTTONS
                ============================================ */}

            <div
              id="checkout-buttons"
              className="w-full min-w-0 lg:col-span-7 lg:col-start-1 order-3"
            >
              <div className="bg-white border border-line p-4 sm:p-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* COD BUTTON */}
                  <button
                    type="button"
                    disabled={
                      isSubmitting || checkoutMethod !== "COD"
                    }
                    onClick={(e) =>
                      handlePlaceOrder(e, "COD")
                    }
                    className={`w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3.5 text-[11px] uppercase tracking-wider font-medium transition-colors ${
                      checkoutMethod === "COD"
                        ? "bg-wine text-cream hover:bg-wine-deep"
                        : "bg-charcoal/10 text-charcoal/30 cursor-not-allowed"
                    } disabled:cursor-not-allowed`}
                  >
                    <ShoppingBag className="w-4 h-4" />

                    {isSubmitting && checkoutMethod === "COD"
                      ? "Processing..."
                      : "Place COD Order"}
                  </button>

                  {/* ONLINE PAYMENT BUTTON */}
                  <button
                    type="button"
                    disabled={
                      isSubmitting || checkoutMethod !== "Online"
                    }
                    onClick={(e) =>
                      handlePlaceOrder(e, "Online")
                    }
                    className={`w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3.5 text-[11px] uppercase tracking-wider font-medium transition-colors ${
                      checkoutMethod === "Online"
                        ? "bg-wine text-cream hover:bg-wine-deep"
                        : "bg-charcoal/10 text-charcoal/30 cursor-not-allowed"
                    } disabled:cursor-not-allowed`}
                  >
                    <ShieldCheck className="w-4 h-4" />

                    {isSubmitting && checkoutMethod === "Online"
                      ? "Processing..."
                      : "Online Payment"}
                  </button>

                </div>

                <p className="text-[10px] text-center text-charcoal/40 mt-3">
                  By placing your order, you agree to our
                  order and delivery terms.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ================================================
          VALIDATION MODAL
          ================================================ */}

      {showValidationModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4">
          <div className="relative w-full max-w-sm bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() =>
                setShowValidationModal(false)
              }
              className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className="w-9 h-9 bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>

              <div>
                <h3 className="font-serif text-xl text-charcoal mb-1">
                  Please check your details
                </h3>

                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Please fill in all required fields before
                  placing your order.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowValidationModal(false)
              }
              className="w-full mt-6 bg-wine text-cream py-3 text-[11px] uppercase tracking-wider font-medium hover:bg-wine-deep transition-colors"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}