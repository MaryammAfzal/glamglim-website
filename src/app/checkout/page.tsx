"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Truck,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useShop, Order } from "@/lib/store";

type CheckoutMethod = "COD" | "WhatsApp";

// ---------- Validation ----------
interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

function validateForm(formData: {
  name: string;
  phone: string;
  address: string;
  city: string;
}): FormErrors {
  const errors: FormErrors = {};

  const name = formData.name.trim();

  if (!name) {
    errors.name = "Full name is required.";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters.";
  } else if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    errors.name = "Name should only contain letters.";
  }

  const phone = formData.phone.trim();
  const phoneDigitsOnly = phone.replace(/[\s-]/g, "");

  if (!phone) {
    errors.phone = "Mobile number is required.";
  } else if (!/^03\d{9}$/.test(phoneDigitsOnly)) {
    errors.phone =
      "Enter a valid Pakistani mobile number (e.g. 03001234567).";
  }

  const address = formData.address.trim();

  if (!address) {
    errors.address = "Delivery address is required.";
  } else if (address.length < 10) {
    errors.address =
      "Please enter a more complete address (min. 10 characters).";
  }

  return errors;
}

// ---------- Popup Modal ----------
function ValidationModal({
  errors,
  onClose,
}: {
  errors: FormErrors;
  onClose: () => void;
}) {
  const messages = Object.values(errors).filter(Boolean) as string[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm px-4 overflow-x-hidden"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm min-w-0 bg-cream border border-line rounded-[2px] shadow-xl p-6 space-y-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-wine min-w-0">
            <AlertCircle size={20} className="shrink-0" />
            <h3 className="font-display text-[18px] text-charcoal">
              Please check your details
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-charcoal-soft hover:text-charcoal transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="space-y-1.5 text-[13px] text-charcoal-soft list-disc list-inside break-words">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="w-full bg-wine text-cream py-2.5 text-[12px] uppercase tracking-eyebrow font-medium hover:bg-wine-deep transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, placeOrder } = useShop();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Karachi",
  });

  const [formErrors, setFormErrors] =
    useState<FormErrors>({});

  const [showValidationModal, setShowValidationModal] =
    useState(false);

  const [placedOrder, setPlacedOrder] =
    useState<Order | null>(null);

  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    shippingFee: number;
    total: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =========================================================
     TOTALS
     ========================================================= */

  const subtotal = cart.reduce(
    (acc, item) =>
      acc + item.product.price * item.quantity,
    0
  );

  const shippingFee =
    subtotal > 2500 || subtotal === 0
      ? 0
      : 200;

  const total = subtotal + shippingFee;

  /* =========================================================
     INPUT CHANGE
     ========================================================= */

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      formErrors[name as keyof FormErrors]
    ) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /* =========================================================
     PLACE ORDER
     ========================================================= */

  const handlePlaceOrder = async (
    e: React.FormEvent,
    checkoutMethod: CheckoutMethod
  ) => {
    e.preventDefault();

    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowValidationModal(true);
      return;
    }

    setIsSubmitting(true);

    const snapshot = {
      subtotal,
      shippingFee,
      total,
    };

    const order = await placeOrder({
      ...formData,
      checkoutMethod,
    });

    if (order) {
      setPlacedOrder(order);
      setOrderSummary(snapshot);

      if (checkoutMethod === "WhatsApp") {
        const itemsText = order.items
          .map(
            (item) =>
              `- ${item.name} (Qty: ${item.quantity}) - Rs. ${item.price}`
          )
          .join("\n");

        const waMessage = `Hi Glam Glim! I placed an order via WhatsApp:

*Order ID:* #${order.id}
*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*Address:* ${order.address}, ${order.city}

*Items Ordered:*
${itemsText}

*Subtotal:* Rs. ${snapshot.subtotal.toLocaleString()}
*Shipping:* ${
          snapshot.shippingFee === 0
            ? "FREE"
            : `Rs. ${snapshot.shippingFee}`
        }
*Total Bill:* Rs. ${order.total.toLocaleString()} (COD)`;

        const waUrl =
          `https://wa.me/923254715421?text=` +
          encodeURIComponent(waMessage);

        window.open(waUrl, "_blank");
      }
    }

    setIsSubmitting(false);
  };

  /* =========================================================
     ORDER SUCCESS
     ========================================================= */

  if (placedOrder && orderSummary) {
    return (
      <div className="w-full max-w-full min-w-0 overflow-x-hidden">
        <SiteHeader />

        <main className="w-full max-w-full min-w-0 flex-1 bg-cream py-16 flex items-center justify-center px-5 sm:px-8 overflow-x-hidden">
          <div className="w-full max-w-md min-w-0 bg-cream border border-line p-8 text-center space-y-6 animate-fade-in-up shadow-lg">
            
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto border border-green-200">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2 min-w-0">
              <h1 className="font-display text-[30px] text-charcoal">
                Order Placed!
              </h1>

              <p className="text-[13px] text-charcoal-soft leading-relaxed break-words">
                Thank you for shopping with us. Your order{" "}
                <span className="font-semibold text-wine break-all">
                  #{placedOrder.id}
                </span>{" "}
                has been logged successfully.
              </p>
            </div>

            <div className="bg-lilac-soft/40 border border-line p-4 rounded-[2px] text-left text-[12px] space-y-2 min-w-0">
              
              <p className="break-words">
                <strong>Recipient:</strong>{" "}
                {placedOrder.customerName}
              </p>

              <p className="break-words">
                <strong>Phone:</strong>{" "}
                {placedOrder.phone}
              </p>

              <p className="break-words">
                <strong>Shipping Address:</strong>{" "}
                {placedOrder.address},{" "}
                {placedOrder.city}
              </p>

              <div className="border-t border-line/60 mt-2 pt-2 space-y-1">
                
                <div className="flex justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="shrink-0">
                    Rs.{" "}
                    {orderSummary.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Shipping Fee</span>
                  <span className="shrink-0">
                    {orderSummary.shippingFee === 0
                      ? "FREE"
                      : `Rs. ${orderSummary.shippingFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between gap-4 font-semibold text-wine border-t border-line/60 pt-1">
                  <span>Total Bill</span>
                  <span className="shrink-0">
                    Rs.{" "}
                    {orderSummary.total.toLocaleString()}
                  </span>
                </div>

              </div>

              <p className="pt-1 break-words">
                <strong>Checkout Method:</strong>{" "}
                {placedOrder.checkoutMethod ===
                "WhatsApp"
                  ? "WhatsApp Redirect"
                  : "Standard Website COD"}
              </p>

            </div>

            <p className="text-[12px] text-charcoal-soft break-words">
              We will contact you via SMS or WhatsApp to
              confirm your order before dispatching.
              Delivery typically takes 2-4 working days.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="block w-full bg-wine text-cream py-3 text-[12px] uppercase tracking-eyebrow font-medium hover:bg-wine-deep transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        </main>

        <SiteFooter />
      </div>
    );
  }

  /* =========================================================
     CHECKOUT PAGE
     ========================================================= */

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden">
      
      <SiteHeader />

      {showValidationModal && (
        <ValidationModal
          errors={formErrors}
          onClose={() =>
            setShowValidationModal(false)
          }
        />
      )}

      <main className="w-full max-w-full min-w-0 flex-1 bg-cream py-12 overflow-x-hidden">
        
        <div className="mx-auto w-full max-w-6xl min-w-0 px-5 sm:px-8">

          {/* =================================================
              BACK TO SHOP
              ================================================= */}

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-eyebrow font-semibold text-charcoal-soft hover:text-wine mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to shopping
          </Link>

          {/* =================================================
              TITLE
              ================================================= */}

          <h1 className="font-display text-[32px] sm:text-[38px] text-charcoal mb-10">
            Checkout
          </h1>

          {/* =================================================
              EMPTY CART
              ================================================= */}

          {cart.length === 0 ? (
            <div className="w-full min-w-0 border border-line p-12 text-center rounded-[2px] bg-cream">

              <ShoppingBag
                size={32}
                className="text-wine/40 mx-auto mb-4"
              />

              <p className="text-[16px] text-charcoal font-display">
                Your cart is empty
              </p>

              <p className="text-[13px] text-charcoal-soft mt-1 mb-6">
                You cannot checkout without items in your
                shopping bag.
              </p>

              <Link
                href="/shop"
                className="bg-wine text-cream px-6 py-2.5 text-[12px] uppercase tracking-eyebrow font-medium hover:bg-wine-deep transition-colors"
              >
                Go to Shop
              </Link>

            </div>
          ) : (

            /* =================================================
               MAIN CHECKOUT GRID
               ================================================= */

            <div className="grid w-full min-w-0 max-w-full lg:grid-cols-12 gap-10 items-start">

              {/* =================================================
                  LEFT COLUMN
                  ================================================= */}

              <div className="w-full min-w-0 max-w-full lg:col-span-7 space-y-6">

                <form
                  className="w-full min-w-0 max-w-full border border-line bg-cream p-6 sm:p-8 space-y-6 rounded-[2px]"
                  noValidate
                >

                  <h2 className="font-display text-[22px] text-charcoal border-b border-line pb-3">
                    Shipping Details
                  </h2>

                  <div className="space-y-4">

                    {/* NAME */}

                    <div className="min-w-0">
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-soft font-semibold mb-1">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Ayesha Jamil"
                        className={`block w-full min-w-0 max-w-full bg-lilac-soft/35 border px-4 py-2.5 text-[13px] text-charcoal focus:outline-hidden rounded-[2px] transition-colors ${
                          formErrors.name
                            ? "border-red-400 focus:border-red-400"
                            : "border-line focus:border-wine/50"
                        }`}
                      />

                      {formErrors.name && (
                        <p className="text-[11px] text-red-500 mt-1 break-words">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* PHONE */}

                    <div className="min-w-0">
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-soft font-semibold mb-1">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 03001234567"
                        className={`block w-full min-w-0 max-w-full bg-lilac-soft/35 border px-4 py-2.5 text-[13px] text-charcoal focus:outline-hidden rounded-[2px] transition-colors ${
                          formErrors.phone
                            ? "border-red-400 focus:border-red-400"
                            : "border-line focus:border-wine/50"
                        }`}
                      />

                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 break-words">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* ADDRESS */}

                    <div className="min-w-0">
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-soft font-semibold mb-1">
                        Delivery Address
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House / Apartment / Street / Area"
                        className={`block w-full min-w-0 max-w-full bg-lilac-soft/35 border px-4 py-2.5 text-[13px] text-charcoal focus:outline-hidden rounded-[2px] transition-colors ${
                          formErrors.address
                            ? "border-red-400 focus:border-red-400"
                            : "border-line focus:border-wine/50"
                        }`}
                      />

                      {formErrors.address && (
                        <p className="text-[11px] text-red-500 mt-1 break-words">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    {/* CITY */}

                    <div className="min-w-0">
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-soft font-semibold mb-1">
                        City
                      </label>

                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="block w-full min-w-0 max-w-full bg-lilac-soft/35 border border-line px-3 py-2.5 text-[13px] text-charcoal focus:outline-hidden focus:border-wine/50 rounded-[2px] transition-colors cursor-pointer"
                      >
                        <option value="Karachi">
                          Karachi
                        </option>
                        <option value="Lahore">
                          Lahore
                        </option>
                        <option value="Islamabad">
                          Islamabad
                        </option>
                        <option value="Rawalpindi">
                          Rawalpindi
                        </option>
                        <option value="Faisalabad">
                          Faisalabad
                        </option>
                        <option value="Multan">
                          Multan
                        </option>
                        <option value="Peshawar">
                          Peshawar
                        </option>
                        <option value="Gujranwala">
                          Gujranwala
                        </option>
                        <option value="Sialkot">
                          Sialkot
                        </option>
                        <option value="Quetta">
                          Quetta
                        </option>
                      </select>
                    </div>

                  </div>

                  {/* =================================================
                      PAYMENT
                      ================================================= */}

                  <div className="border-t border-line/60 pt-6 space-y-4">

                    <h3 className="text-[12px] uppercase tracking-wider font-semibold text-charcoal">
                      Payment Method
                    </h3>

                    <div className="border border-wine/30 bg-lilac-soft/10 p-4 flex items-start gap-3 rounded-[2px] min-w-0">

                      <div className="mt-0.5 text-wine shrink-0">
                        <Truck size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-charcoal">
                          Cash on Delivery (COD)
                        </p>

                        <p className="text-[11px] text-charcoal-soft mt-0.5 break-words">
                          Pay in cash when your beauty
                          products arrive. Safe & secure.
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      BUTTONS
                      ================================================= */}

                  <div className="grid w-full min-w-0 sm:grid-cols-2 gap-3 pt-4 border-t border-line/60">

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={(e) =>
                        handlePlaceOrder(e, "COD")
                      }
                      className="w-full min-w-0 bg-wine text-cream py-4 text-[12px] uppercase tracking-eyebrow font-medium hover:bg-wine-deep transition-all duration-300 shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Processing..."
                        : "Place COD Order"}
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={(e) =>
                        handlePlaceOrder(
                          e,
                          "WhatsApp"
                        )
                      }
                      className="w-full min-w-0 bg-[#25D366] text-cream py-4 text-[12px] uppercase tracking-eyebrow font-medium hover:bg-[#20ba56] transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <MessageSquare
                        size={13}
                        className="shrink-0"
                      />
                      <span className="truncate">
                        Confirm on WhatsApp
                      </span>
                    </button>

                  </div>

                </form>

              </div>

              {/* =================================================
                  RIGHT COLUMN
                  ================================================= */}

              <div className="w-full min-w-0 max-w-full lg:col-span-5 border border-line bg-lilac-soft/20 p-6 rounded-[2px] space-y-6">

                <h2 className="font-display text-[22px] text-charcoal border-b border-line/60 pb-3">
                  Your Order
                </h2>

                {/* =================================================
                    CART ITEMS
                    ================================================= */}

                <div className="w-full min-w-0 max-w-full max-h-[300px] overflow-y-auto overflow-x-hidden space-y-4 pr-1">

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex w-full min-w-0 max-w-full gap-3 text-[13px] border-b border-line/40 pb-4 last:border-none"
                    >

                      {/* IMAGE */}

                      <div className="w-12 h-16 bg-lilac-soft overflow-hidden rounded-[1px] shrink-0 border border-line/40 flex items-center justify-center">
                        <img
                          src={
                            item.product.image ||
                            "/lipstick_matte.png"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="flex-1 min-w-0 overflow-hidden">

                        <p className="font-medium text-charcoal truncate">
                          {item.product.name}
                        </p>

                        <p className="text-[11px] text-charcoal-soft mt-0.5 truncate">
                          Rs.{" "}
                          {item.product.price.toLocaleString()}{" "}
                          x {item.quantity}
                        </p>

                      </div>

                      {/* ITEM TOTAL */}

                      <span className="font-semibold text-wine shrink-0 whitespace-nowrap text-right">
                        Rs.{" "}
                        {(
                          item.product.price *
                          item.quantity
                        ).toLocaleString()}
                      </span>

                    </div>
                  ))}

                </div>

                {/* =================================================
                    TOTALS
                    ================================================= */}

                <div className="border-t border-line/60 pt-4 space-y-2.5 text-[13px] text-charcoal-soft">

                  <div className="flex justify-between gap-4">
                    <span>Subtotal</span>

                    <span className="font-medium text-charcoal shrink-0">
                      Rs.{" "}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Shipping Fee</span>

                    <span className="font-medium text-charcoal shrink-0">
                      {shippingFee === 0
                        ? "FREE"
                        : `Rs. ${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-line/60 pt-3 text-[15px] font-semibold text-charcoal">
                    <span>Total Amount</span>

                    <span className="text-wine shrink-0 whitespace-nowrap">
                      Rs.{" "}
                      {total.toLocaleString()}
                    </span>
                  </div>

                </div>

                {/* =================================================
                    SECURITY MESSAGE
                    ================================================= */}

                <div className="border border-line bg-cream p-4 rounded-[2px] flex items-start gap-2.5 text-[11px] text-charcoal-soft min-w-0">

                  <ShieldCheck
                    size={16}
                    className="text-wine shrink-0 mt-0.5"
                  />

                  <p className="min-w-0 break-words">
                    By placing an order, you agree to
                    receive verification calls and
                    delivery status updates on the phone
                    number provided.
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}