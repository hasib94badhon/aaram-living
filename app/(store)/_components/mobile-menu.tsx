"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg
            className="w-5 h-5 text-stone-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-stone-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-sm z-50">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 text-sm font-medium text-stone-700">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="hover:text-stone-900"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="hover:text-stone-900"
            >
              Products
            </Link>
            {isLoggedIn ? (
              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="hover:text-stone-900"
              >
                My Orders
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="hover:text-stone-900"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
