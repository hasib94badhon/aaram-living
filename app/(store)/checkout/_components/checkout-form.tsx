"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/actions/checkout";
import Link from "next/link";

const DISTRICTS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
  "Comilla",
  "Jessore",
  "Bogura",
  "Noakhali",
  "Dinajpur",
];

export default function CheckoutForm() {
  const [state, action, pending] = useActionState(placeOrder, undefined);

  if (state?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-800 mb-2">
          Order Placed!
        </h2>
        <p className="text-green-700 text-sm mb-3">
          Your order{" "}
          <span className="font-mono font-bold">{state.orderNumber}</span> has
          been received. We will confirm your payment and start processing your
          order shortly.
        </p>
        <p className="text-green-600 text-xs mb-6">
          For any questions, contact us at support@aarambd.com
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
    <form action={action} className="space-y-8">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          {state.error}
        </p>
      )}

      {/* Delivery address */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-stone-900 mb-5">
          Delivery Address
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="fullName"
              type="text"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Your full name"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Address Line <span className="text-red-500">*</span>
            </label>
            <input
              name="line1"
              type="text"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="House, Road, Area"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              type="text"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. Dhaka"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select district</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Order Notes{" "}
              <span className="text-stone-400 font-normal text-xs">
                (optional)
              </span>
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Any special instructions..."
            />
          </div>
        </div>
      </div>

      {/* Payment — bKash */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-stone-900 mb-1">
          Payment — bKash
        </h2>
        <p className="text-sm text-stone-500 mb-5">
          Send the total amount to our bKash merchant number, then enter the
          details below.
        </p>

        {/* bKash instructions box */}
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-5 text-sm">
          <p className="font-semibold text-pink-800 mb-1">
            bKash Merchant Number
          </p>
          <p className="font-mono text-lg font-bold text-pink-700">
            01700-000000
          </p>
          <p className="text-pink-600 mt-2 text-xs">
            Go to bKash app → Send Money → enter the number above → send the
            exact total amount → copy the Transaction ID.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Your bKash Number <span className="text-red-500">*</span>
            </label>
            <input
              name="bkashNumber"
              type="tel"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              bKash Transaction ID <span className="text-red-500">*</span>
            </label>
            <input
              name="transactionId"
              type="text"
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. 8N6XXXXXXX"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full text-sm transition-colors"
      >
        {pending ? "Placing Order…" : "Place Order"}
      </button>
    </form>
  );
}
