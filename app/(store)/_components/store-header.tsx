import Link from "next/link";
import MobileMenu from "./mobile-menu";

export default function StoreHeader({
  isLoggedIn,
  cartCount,
}: {
  isLoggedIn: boolean;
  cartCount: number;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-stone-900 tracking-tight"
          >
            Aaram <span className="text-amber-600">Living</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-stone-900 transition-colors"
            >
              Products
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/account/orders"
                className="hidden md:block text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                My Orders
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Cart icon */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-stone-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <MobileMenu isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </header>
  );
}
