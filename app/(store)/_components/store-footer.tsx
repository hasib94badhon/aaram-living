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
              <li>📞 +880 1700-000000</li>
              <li>📍 Dhaka, Bangladesh</li>
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
