"use client";

import { useActionState, useState } from "react";
import { placeOrder } from "@/app/actions/checkout";
import Link from "next/link";
import Image from "next/image";

const DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola",
  "Bogura", "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chittagong",
  "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur",
  "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj",
  "Habiganj", "Jamalpur", "Jessore", "Jhalokati", "Jhenaidah",
  "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj", "Kurigram",
  "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura",
  "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh",
  "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
  "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati",
  "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
  "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];

export type CheckoutItem = {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    salePrice: number | null;
    imageUrl: string | null;
  };
};

type Props = {
  items: CheckoutItem[];
  subtotal: number;
};

function calcShipping(district: string): number {
  return district.toLowerCase() === "dhaka" ? 80 : 150;
}

const inputCls =
  "w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

export default function CheckoutForm({ items, subtotal }: Props) {
  const [state, action, pending] = useActionState(placeOrder, undefined);
  const [district, setDistrict] = useState("");

  const shipping = district ? calcShipping(district) : null;
  const total = shipping !== null ? subtotal + shipping : null;

  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-800 mb-2">Order Placed!</h2>
        <p className="text-green-700 text-sm mb-1">
          Your order{" "}
          <span className="font-mono font-bold">{state.orderNumber}</span> has been received.
        </p>
        <p className="text-green-600 text-sm mb-6">
          Our team will call you to confirm and arrange delivery. Pay cash when your order arrives.
        </p>
        <Link
          href="/account/orders"
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ── Left: form ──────────────────────────────────────────────────── */}
      <div className="flex-1">
        <form action={action} className="space-y-6">
          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              {state.error}
            </p>
          )}

          {/* Delivery address */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-5">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input name="fullName" type="text" required className={inputCls} placeholder="Your full name" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input name="phone" type="tel" required className={inputCls} placeholder="01XXXXXXXXX" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input name="line1" type="text" required className={inputCls} placeholder="House, Road, Area" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input name="city" type="text" required className={inputCls} placeholder="e.g. Dhaka" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Order Notes{" "}
                  <span className="text-stone-400 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-1">
              Payment — Cash on Delivery
            </h2>
            <p className="text-sm text-stone-500 mb-4">
              No advance payment required. Pay when your order arrives.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span className="text-amber-800">Pay cash to the delivery agent at your door</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span className="text-amber-800">Our team will call you before delivery</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span className="text-amber-800">
                  Shipping: <strong>৳80</strong> inside Dhaka &nbsp;/&nbsp; <strong>৳150</strong> outside Dhaka
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending || !district}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-full text-sm transition-colors"
          >
            {pending
              ? "Placing Order…"
              : total !== null
              ? `Place Order — ৳${total.toLocaleString()}`
              : "Select a district to continue"}
          </button>
        </form>
      </div>

      {/* ── Right: order summary ─────────────────────────────────────────── */}
      <div className="lg:w-80 shrink-0">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sticky top-24">
          <h2 className="text-base font-semibold text-stone-900 mb-4">Your Order</h2>

          <div className="space-y-3 mb-4">
            {items.map((item) => {
              const price = item.product.salePrice ?? item.product.price;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                    {item.product.imageUrl && (
                      <Image
                        src={item.product.imageUrl}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-stone-500">
                      {item.quantity} × ৳{price.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-stone-900 shrink-0">
                    ৳{(price * item.quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-stone-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span>
                {shipping !== null ? (
                  <span className="font-medium text-stone-800">৳{shipping}</span>
                ) : (
                  <span className="text-stone-400 text-xs">Select district</span>
                )}
              </span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 text-base pt-1 border-t border-stone-100">
              <span>Total</span>
              <span>
                {total !== null ? `৳${total.toLocaleString()}` : "—"}
              </span>
            </div>
          </div>

          {district && (
            <p className="text-xs text-stone-400 mt-3 text-center">
              {district === "Dhaka" ? "Inside Dhaka delivery" : `Delivery to ${district}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
