import Link from "next/link";

export default function StoreFooter() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">
              Aaram <span className="text-amber-500">Living</span>
            </p>
            <p className="text-sm leading-relaxed">
              Bringing comfort and style to your home. Quality products
              delivered across Bangladesh.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>📧 support@aarambd.com</li>
              <li>📍 Dhaka, Bangladesh</li>
              <li>
                <Link
                  href="https://www.facebook.com/profile.php?id=61582905971296"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                  </svg>
                  Facebook Page
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-6 text-xs text-center">
          © {new Date().getFullYear()} Aaram Living. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
